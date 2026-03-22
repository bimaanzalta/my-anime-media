import { exchangeMalCode, saveMalConnection } from '../../../utils/mal'
import { getUserFromEvent } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { code, state } = query

  const storedState = getCookie(event, 'mal_state')
  const codeVerifier = getCookie(event, 'mal_code_verifier')
  const returnTo = getCookie(event, 'mal_return_to') || '/admin/mal'

  if (!code || state !== storedState || !codeVerifier) {
    throw createError({ statusCode: 400, message: 'Invalid OAuth state' })
  }

  deleteCookie(event, 'mal_state')
  deleteCookie(event, 'mal_code_verifier')
  deleteCookie(event, 'mal_return_to')

  const tokens = await exchangeMalCode(code as string, codeVerifier)

  // Save to DB if user is logged in
  const user = await getUserFromEvent(event)
  if (user?.id) {
    await saveMalConnection(
      user.id as number,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_in,
    )
  }

  // Also keep a short-lived cookie for immediate API use
  setCookie(event, 'mal_access_token', tokens.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: tokens.expires_in,
    path: '/',
  })

  return sendRedirect(event, returnTo)
})
