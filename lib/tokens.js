import { SignJWT, jwtVerify } from 'jose'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../config/prisma.js'

// Secrets (in real projects, store in env vars)
const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || 'super-access-secret')

// Time configs
const ACCESS_TOKEN_EXPIRES_IN = '15m'
const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7

/**
 * Create a JWT access token
 */
export async function generateAccessToken(user) {
  return await new SignJWT({
    sub: user.id,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRES_IN)
    .sign(ACCESS_SECRET)
}

/**
 * Create a refresh token (UUID string + expiry timestamp for DB)
 */
export function generateRefreshToken() {
  const token = uuidv4()
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000)
  return { token, expiresAt }
}

/**
 * Verify and decode access token
 */
export async function verifyAccessToken(token) {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET)
    return payload
  } catch (err) {
    return null
  }
}

export async function refreshAccessToken(incomingToken) {
  // 1. Look up token in DB
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: incomingToken },
    include: { user: true },
  })

  if (!storedToken || storedToken.revoked) {
    throw new Error('Invalid or revoked refresh token')
  }

  if (new Date(storedToken.expiresAt) < new Date()) {
    throw new Error('Refresh token expired')
  }

  const user = storedToken.user

  // 2. Issue new access token
  const accessToken = await generateAccessToken(user)

  // 3. Rotate refresh token (optional but recommended)
  await prisma.refreshToken.update({
    where: { token: incomingToken },
    data: { revoked: true },
  })

  const { token: newRefreshToken, expiresAt } = generateRefreshToken()

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: user.id,
      expiresAt,
    },
  })

  // 4. Return new tokens
  return {
    accessToken,
    refreshToken: newRefreshToken,
  }
}
