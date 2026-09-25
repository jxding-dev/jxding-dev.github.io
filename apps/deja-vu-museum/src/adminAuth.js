const ADMIN_SESSION_KEY = 'deja-vu-museum-admin-session'
const ADMIN_SALT = 'C0cH5hN8MtCATSfqj9XsQw=='
const ADMIN_HASH = 'H8Z4MDqYFmLF8Btomz2noX7X5EQXTfbNvZXENAalMac='
const ADMIN_ITERATIONS = 420000

const encoder = new TextEncoder()

const base64ToBytes = (value) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0))

const bytesToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer)
  let output = ''
  bytes.forEach((byte) => {
    output += String.fromCharCode(byte)
  })
  return btoa(output)
}

const safeEqual = (left, right) => {
  if (left.length !== right.length) return false
  let result = 0
  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index)
  }
  return result === 0
}

export const hasAdminSession = () => window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'verified'

export const clearAdminSession = () => window.sessionStorage.removeItem(ADMIN_SESSION_KEY)

export const verifyAdminPassphrase = async (passphrase) => {
  if (!passphrase.trim()) return false

  const key = await window.crypto.subtle.importKey('raw', encoder.encode(passphrase), 'PBKDF2', false, ['deriveBits'])
  const bits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(ADMIN_SALT),
      iterations: ADMIN_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    256,
  )
  const verified = safeEqual(bytesToBase64(bits), ADMIN_HASH)
  if (verified) window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'verified')
  return verified
}
