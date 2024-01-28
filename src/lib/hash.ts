import { createHash } from 'crypto'

const HASH_ROUNDS = Number(process.env.HASH_ROUNDS)
const HASH_SECRET = String(process.env.HASH_SECRET)

const hash = (args: string): string =>
  createHash('sha256').update(args).digest('hex')

export const generateHash = (args: string): string =>
  Array.from({ length: HASH_ROUNDS }).reduce(hash, `${HASH_SECRET}&${args}`)

export const compareHash = (text: string, hash: string): boolean =>
  generateHash(text) === hash
