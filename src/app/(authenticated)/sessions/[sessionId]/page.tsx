import type { FC } from 'react'
import { sessionRepository } from '@/repositories/session'
import { QRCodeSVG } from 'qrcode.react'
import { CopyClipboard } from '@/components/copy-clipboard'

interface Params {
  params: { sessionId: string }
}

const Page: FC<Params> = async ({ params }) => {
  const baseUrl = process.env.PROD_URL ?? process.env.NEXTAUTH_URL

  if (baseUrl === undefined) {
    return (
      <main className="flex h-full w-full items-center justify-center text-2xl font-bold">
        URL not defined
      </main>
    )
  }

  const url = new URL(`/sos/${params.sessionId}`, baseUrl).toString()

  const person = await sessionRepository.getPersonById(params.sessionId)

  return (
    <main className="flex flex-col items-center">
      <h2 className="mt-2 text-center text-2xl font-bold">{person.name}</h2>

      <div className="m-12 aspect-square h-fit w-fit bg-white p-1">
        <QRCodeSVG className="h-[320px] w-[320px]" value={url} />
      </div>

      <CopyClipboard value={url} />
    </main>
  )
}

export default Page
