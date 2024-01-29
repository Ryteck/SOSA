'use client'

import { type FC, useEffect } from 'react'

interface Props {
  enable: boolean
}

export const Beep: FC<Props> = ({ enable }) => {
  useEffect(() => {
    const beep = new Audio('/assets/audios/drop.mp3')

    const playBeep = (): void => {
      beep.play().catch(console.error)
    }

    if (enable) playBeep()

    return () => {
      beep.pause()
      beep.currentTime = 0
    }
  }, [])

  return <span>audio</span>
}
