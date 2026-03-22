import { exchangeMalCode, saveMalConnection } from '../../../utils/mal'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { code, state } = query

  const storedState = getCookie(event, 'mal_state')
  const codeVerifier = getCookie(event, 'mal_code_verifier')
  const returnTo = getCookie(event, 'mal_return_to') || '/admin/mal'

  // Validasi state PKCE
  if (!code || !codeVerifier || state !== storedState) {
    return sendRedirect(event, `/admin/mal?error=invalid_state`)
  }

  deleteCookie(event, 'mal_state')
  deleteCookie(event, 'mal_code_verifier')
  deleteCookie(event, 'mal_return_to')

  // Tukar code → tokens
  let tokens: { access_token: string; refresh_token: string; expires_in: number }
  try {
    tokens = await exchangeMalCode(code as string, codeVerifier)
  } catch (e) {
    console.error('[MAL callback] exchangeMalCode error:', e)
    return sendRedirect(event, `/admin/mal?error=exchange_failed`)
  }

  // Simpan ke DB jika user sudah login
  const user = await getUserFromEvent(event)
  if (user?.id) {
    try {
      await saveMalConnection(
        user.id as number,
        tokens.access_token,
        tokens.refresh_token,
        tokens.expires_in,
      )
    } catch (e) {
      console.error('[MAL callback] saveMalConnection error:', e)
    }
  } else {
    console.warn('[MAL callback] No logged-in user found — token not saved to DB')
  }

  // Cookie singkat untuk API call langsung
  setCookie(event, 'mal_access_token', tokens.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: tokens.expires_in,
    path: '/',
  })

  return sendRedirect(event, returnTo)
})
