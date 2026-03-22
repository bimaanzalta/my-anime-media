import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { users } from '../../db/schema'
import { verifyPassword, createToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({ statusCode: 400, message: 'Missing credentials' })
  }

  const db = getDb()
  const found = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (found.length === 0) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const user = found[0]
  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: 'Invalid credentials' })
  }

  const config = useRuntimeConfig()
  const token = await createToken({ id: user.id, role: user.role }, config.jwtSecret)
  setAuthCookie(event, token)

  return { user: { id: user.id, username: user.username, email: user.email, role: user.role } }
})
