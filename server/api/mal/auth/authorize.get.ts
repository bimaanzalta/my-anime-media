import { getMalAuthUrl } from '../../../utils/mal'

function generateCodeVerifier() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  for (let i = 0; i < 128; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export default defineEventHandler(async (event) => {
  const { returnTo = '/admin/mal' } = getQuery(event)

  const codeVerifier = generateCodeVerifier()
  const state = Math.random().toString(36).substring(2)

  setCookie(event, 'mal_code_verifier', codeVerifier, { httpOnly: true, sameSite: 'lax', maxAge: 300 })
  setCookie(event, 'mal_state', state, { httpOnly: true, sameSite: 'lax', maxAge: 300 })
  setCookie(event, 'mal_return_to', returnTo as string, { httpOnly: true, sameSite: 'lax', maxAge: 300 })

  return sendRedirect(event, getMalAuthUrl(codeVerifier, state))
})
