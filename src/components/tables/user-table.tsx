'use client'

import type { FC } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useFetcher } from '@/hooks/fetcher'
import type { User } from '@prisma/client'
import storeNewUser from '@/actions/storeNewUser'
import destroyUserById from '@/actions/destroyUserById'
import toast from 'react-hot-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  name: z.string().min(1),
  nick: z.string().min(1),
})

export const UserTable: FC = () => {
  const { data, mutate } = useFetcher<User[]>('api/users', {
    revalidateOnFocus: true,
    refreshInterval: 10000,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      nick: '',
    },
  })

  const onSubmit = form.handleSubmit(data => {
    form.reset()

    toast
      .promise(
        storeNewUser(data).then(async () => await mutate()),
        {
          loading: 'creating user, please wait...',
          success: 'user created',
          error: 'unknown error',
        },
      )
      .catch(console.error)
  })

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Nick</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Type a name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              <TableCell>
                <FormField
                  control={form.control}
                  name="nick"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Type a nick" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>

              <TableCell className="text-right">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button variant="outline" size="icon" type="submit">
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
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.nick}</TableCell>
                <TableCell className="text-right">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          variant="outline"
                          size="icon"
                          type="button"
                          onClick={e => {
                            e.preventDefault()

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
      </form>
    </Form>
  )
}
