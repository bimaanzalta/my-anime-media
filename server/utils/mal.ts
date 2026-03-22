import { eq } from 'drizzle-orm'
import { getDb } from '../db'
import { malConnections } from '../db/schema'

const MAL_BASE_URL = 'https://api.myanimelist.net/v2'
const MAL_AUTH_URL = 'https://myanimelist.net/v1/oauth2'

// ─── OAuth URL ────────────────────────────────────────────────────────────────

export function getMalAuthUrl(codeChallenge: string, state: string) {
  const config = useRuntimeConfig()
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.malClientId,
    code_challenge: codeChallenge,
    code_challenge_method: 'plain',
    state,
    redirect_uri: `${config.public.siteUrl}/auth/mal/callback`,
  })
  return `${MAL_AUTH_URL}/authorize?${params}`
}

// ─── Token Exchange ───────────────────────────────────────────────────────────

export async function exchangeMalCode(code: string, codeVerifier: string) {
  const config = useRuntimeConfig()
  return $fetch<{ access_token: string; refresh_token: string; expires_in: number; token_type: string }>(
    `${MAL_AUTH_URL}/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.malClientId,
        client_secret: config.malClientSecret,
        grant_type: 'authorization_code',
        code,
        code_verifier: codeVerifier,
        redirect_uri: `${config.public.siteUrl}/auth/mal/callback`,
      }).toString(),
    }
  )
}

// ─── Token Refresh ────────────────────────────────────────────────────────────

export async function refreshMalToken(refreshToken: string) {
  const config = useRuntimeConfig()
  return $fetch<{ access_token: string; refresh_token: string; expires_in: number }>(
    `${MAL_AUTH_URL}/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: config.malClientId,
        client_secret: config.malClientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    }
  )
}

// ─── Get Valid Token (auto-refresh if expired / near-expiry) ─────────────────

/**
 * Returns a valid MAL access token for the given user.
 * Auto-refreshes if the token is expired or within 5 minutes of expiry.
 * Returns null if no connection exists.
 */
export async function getValidMalToken(userId: number): Promise<string | null> {
  const db = getDb()
  const rows = await db
    .select()
    .from(malConnections)
    .where(eq(malConnections.userId, userId))
    .limit(1)

  if (rows.length === 0) return null

  const conn = rows[0]
  const fiveMinutes = 5 * 60 * 1000
  const isExpiredOrNear = conn.expiresAt.getTime() - Date.now() < fiveMinutes

  if (!isExpiredOrNear) {
    return conn.accessToken
  }

  // Token expired / near expiry — refresh
  try {
    const refreshed = await refreshMalToken(conn.refreshToken)
    const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000)

    await db
      .update(malConnections)
      .set({
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
        expiresAt: newExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(malConnections.userId, userId))

    return refreshed.access_token
  } catch {
    // Refresh failed — token invalid, connection needs re-auth
    return null
  }
}

// ─── Save / Update MAL Connection ────────────────────────────────────────────

export async function saveMalConnection(
  userId: number,
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
) {
  const db = getDb()
  const expiresAt = new Date(Date.now() + expiresIn * 1000)

  // Fetch MAL user info to store username
  let malUserId: number | null = null
  let malUsername: string | null = null
  try {
    const me = await $fetch<{ id: number; name: string }>(`${MAL_BASE_URL}/users/@me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    malUserId = me.id
    malUsername = me.name
  } catch {}

  const existing = await db
    .select({ id: malConnections.id })
    .from(malConnections)
    .where(eq(malConnections.userId, userId))
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(malConnections)
      .set({ accessToken, refreshToken, expiresAt, malUserId, malUsername, updatedAt: new Date() })
      .where(eq(malConnections.userId, userId))
  } else {
    await db.insert(malConnections).values({
      userId,
      accessToken,
      refreshToken,
      expiresAt,
      malUserId,
      malUsername,
    })
  }
}

// ─── MAL API Calls ────────────────────────────────────────────────────────────

export async function searchMalAnime(query: string, accessToken?: string) {
  const config = useRuntimeConfig()
  const headers: Record<string, string> = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : { 'X-MAL-CLIENT-ID': config.malClientId }

  return $fetch(`${MAL_BASE_URL}/anime`, {
    headers,
    query: {
      q: query,
      limit: 20,
      fields: 'id,title,main_picture,synopsis,mean,genres,status,media_type,start_date,end_date,studios,num_episodes',
    },
  })
}

export async function getMalAnimeDetail(malId: number, accessToken?: string) {
  const config = useRuntimeConfig()
  const headers: Record<string, string> = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : { 'X-MAL-CLIENT-ID': config.malClientId }

  return $fetch(`${MAL_BASE_URL}/anime/${malId}`, {
    headers,
    query: {
      fields: 'id,title,alternative_titles,main_picture,synopsis,mean,rank,popularity,genres,media_type,status,start_date,end_date,studios,related_anime,related_manga,num_episodes,source',
    },
  })
}

export async function searchMalManga(query: string, accessToken?: string) {
  const config = useRuntimeConfig()
  const headers: Record<string, string> = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : { 'X-MAL-CLIENT-ID': config.malClientId }

  return $fetch(`${MAL_BASE_URL}/manga`, {
    headers,
    query: {
      q: query,
      limit: 20,
      fields: 'id,title,main_picture,synopsis,mean,genres,status,media_type,start_date,end_date,authors',
    },
  })
}
