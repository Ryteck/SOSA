'use client'

import { type FC, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useFetcher } from '@/hooks/fetcher'
import type AlertDetailsWithSession from '@/types/AlertDetailsWithSession'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { Cross1Icon } from '@radix-ui/react-icons'
import destroyAlertById from '@/actions/destroyAlertById'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { User } from '@prisma/client'
import updateAlertUserById from '@/actions/updateAlertUserById'

const pad2 = (arg: number): string => arg.toString().padStart(2, '0')

interface TimerProps {
  createdAt: string | Date
}

const Timer: FC<TimerProps> = ({ createdAt }) => {
  const moment = new Date(createdAt)

  const [timeDifference, setTimeDifference] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const updateDifference = (): void => {
      const now = new Date()
      const milli = now.getTime() - moment.getTime()

      const hours = Math.floor(milli / (1000 * 60 * 60))
      const minutes = Math.floor((milli % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((milli % (1000 * 60)) / 1000)

      setTimeDifference({
        hours,
        minutes,
        seconds,
      })
    }

    updateDifference()

    const intervalId = setInterval(updateDifference, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [createdAt])

  const { hours, minutes, seconds } = timeDifference

  return (
    <TableCell className="text-right">
      {`${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`}
    </TableCell>
  )
}

interface UserSelectProps {
  id: string
  users: Array<Omit<User, 'password'>>
  userSelected?: string
}

const UserSelect: FC<UserSelectProps> = ({ id, users, userSelected }) => {
  const [userSel, setUserSel] = useState(userSelected)

  return (
    <Select
      value={userSel}
      onValueChange={value => {
        setUserSel(value)
        updateAlertUserById(id, value).catch(err => {
          console.error(err)
          setUserSel(userSel)
        })
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {users?.map(user => (
          <SelectItem key={user.id} value={user.id}>
            {user.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface Props {
  controllerMode?: true
}

export const AlertTable: FC<Props> = ({ controllerMode }) => {
  const { data, mutate } = useFetcher<AlertDetailsWithSession[]>('api/alerts', {
    revalidateOnFocus: true,
    refreshInterval: 5000,
  })

  const { data: users } = useFetcher<Array<Omit<User, 'password'>>>(
    'api/users',
    {
      revalidateOnFocus: true,
      refreshInterval: 10000,
    },
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Person</TableHead>
          <TableHead>Local</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>User</TableHead>
          <TableHead className="text-right">Time</TableHead>
          {controllerMode && (
            <TableHead className="text-right">Close</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map(alert => (
          <TableRow key={alert.id}>
            <TableCell>
              <p className="text-xl font-bold">{alert.session.person.name}</p>
              <p className="opacity-50">{alert.session.person.details}</p>
            </TableCell>

            <TableCell>
              <p className="text-xl font-bold">{alert.local.name}</p>
              <p className="opacity-50">{alert.local.details}</p>
            </TableCell>

            <TableCell>{alert.details}</TableCell>

            <TableCell>
              {controllerMode ? (
                <UserSelect
                  id={alert.id}
                  userSelected={alert.user?.id}
                  users={users ?? []}
                />
              ) : (
                alert.user?.name
              )}
            </TableCell>

            <Timer createdAt={alert.createdAt} />

            {controllerMode && (
              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        onClick={() => {
                          toast
                            .promise(
                              destroyAlertById(alert.id).then(
                                async () => await mutate(),
                              ),
                              {
                                loading: 'closing alert, please wait...',
                                success: 'alert closed',
                                error: 'unknown error',
                              },
                            )
                            .catch(console.error)
                        }}
                      >
                        <Cross1Icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Close</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
