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
import { NIL, v4 } from 'uuid'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useIsClient } from '@/hooks/isClient'

interface User {
  id: string
  name: string
  nick: string
}

const Page: FC = () => {
  const isClient = useIsClient()

  const [users, setUsers] = useState<User[]>([])

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
                          setUsers(state => [
                            ...state,
                            { id: v4(), name, nick },
                          ])

                          setName('')
                          setNick('')
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

            {users.map(user => (
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
                            setUsers(state =>
                              state.filter(({ id }) => id !== user.id),
                            )
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
