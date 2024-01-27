import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NIL } from 'uuid'

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nick: {
          label: 'Nick name',
          type: 'text',
          placeholder: 'type your nick',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'type your password',
        },
      },
      async authorize(credentials) {
        if (!credentials) return null

        if (credentials.nick === 'sosa' && credentials.password === 'sosa')
          return { id: NIL }

        return null
      },
    }),
  ],
}

export default authOptions
