import { eq } from 'drizzle-orm'
import { getDb } from '../../db'
import { users } from '../../db/schema'
import { hashPassword, createToken, setAuthCookie } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password } = body

  if (!username || !email || !password) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const db = getDb()
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing.length > 0) {
    throw createError({ statusCode: 409, message: 'Email already registered' })
  }

  const passwordHash = await hashPassword(password)
  await db.insert(users).values({ username, email, passwordHash, role: 'member' })

  const newUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
  const config = useRuntimeConfig()
  const token = await createToken({ id: newUser[0].id, role: newUser[0].role }, config.jwtSecret)
  setAuthCookie(event, token)

  return { user: { id: newUser[0].id, username: newUser[0].username, email: newUser[0].email, role: newUser[0].role } }
})
