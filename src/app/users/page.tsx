'use client'

import { type FC, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { NIL } from 'uuid'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useIsClient } from '@/hooks/isClient'
import { useFetcher } from '@/hooks/fetcher'
import type { User } from '@prisma/client'
import storeNewUser from '@/actions/storeNewUser'
import destroyUserById from '@/actions/destroyUserById'
import toast from 'react-hot-toast'

const Page: FC = () => {
  const isClient = useIsClient()

  const { data, mutate } = useFetcher<User[]>('api/users', {
    revalidateOnFocus: true,
    refreshInterval: 10000,
  })

  const [name, setName] = useState('')
  const [nick, setNick] = useState('')

  return (
    <>
      {isClient && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[380px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Nick</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-primary/20">
                {NIL}
              </TableCell>
              <TableCell>
                <Input
                  placeholder="Type a name"
                  value={name}
                  onChange={e => {
                    setName(e.target.value)
                  }}
                />
              </TableCell>

              <TableCell>
                <Input
                  placeholder="Type a nick"
                  value={nick}
                  onChange={e => {
                    setNick(e.target.value)
                  }}
                />
              </TableCell>

              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          toast
                            .promise(
                              storeNewUser({ name, nick }).then(
                                async () => await mutate(),
                              ),
                              {
                                loading: 'creating user, please wait...',
                                success: 'user created',
                                error: 'unknown error',
                              },
                            )
                            .then(() => {
                              setName('')
                              setNick('')
                            })
                            .catch(console.error)
                        }}
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add to list</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
            </TableRow>

            {data?.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.nick}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            toast
                              .promise(
                                destroyUserById(user.id).then(
                                  async () => await mutate(),
                                ),
                                {
                                  loading: 'deleting user, please wait...',
                                  success: 'user deleted',
                                  error: 'unknown error',
                                },
                              )
                              .then(() => {
                                setName('')
                                setNick('')
                              })
                              .catch(console.error)
                          }}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
export default Page
