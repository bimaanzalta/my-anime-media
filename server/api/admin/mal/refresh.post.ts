import { eq } from 'drizzle-orm'
import { getDb } from '../../../db'
import { malConnections } from '../../../db/schema'
import { refreshMalToken } from '../../../utils/mal'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const db = getDb()
  const rows = await db
    .select()
    .from(malConnections)
    .where(eq(malConnections.userId, user.id as number))
    .limit(1)

  if (rows.length === 0) {
    throw createError({ statusCode: 404, message: 'MAL tidak terhubung' })
  }

  const conn = rows[0]

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
      .where(eq(malConnections.userId, user.id as number))

    // Perbarui cookie juga
    setCookie(event, 'mal_access_token', refreshed.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: refreshed.expires_in,
      path: '/',
    })

    return {
      ok: true,
      expiresAt: newExpiresAt,
    }
  } catch (e: any) {
    throw createError({
      statusCode: 502,
      message: 'Gagal refresh token. Silakan hubungkan ulang akun MAL.',
    })
  }
})
