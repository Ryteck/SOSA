"use client";

import destroyUserById from "@/actions/destroyUserById";
import storeNewUser from "@/actions/storeNewUser";
import updateUserPasswordById from "@/actions/updateUserPasswordById";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFetcher } from "@/hooks/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { PlusIcon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(1),
	nick: z.string().min(1),
	password: z.string().min(1),
});

interface Props {
	userId: string;
}

const PatchPassword: FC<Props> = ({ userId }) => {
	const [password, setPassoword] = useState("");

	return (
		<TableCell className="flex items-center gap-2">
			<Input
				type="password"
				placeholder="Type a new password"
				value={password}
				onChange={(e) => {
					setPassoword(e.target.value);
				}}
			/>
			<Button
				size="icon"
				variant="outline"
				onClick={(e) => {
					e.preventDefault();

					setPassoword("");

					toast
						.promise(updateUserPasswordById(userId, password), {
							loading: "changing the password, please wait...",
							success: "password changed",
							error: "unknown error",
						})
						.catch(console.error);
				}}
			>
				<ReloadIcon className="h-4 w-4" />
			</Button>
		</TableCell>
	);
};

export const UserTable: FC = () => {
	const { data, mutate } = useFetcher<Array<Omit<User, "password">>>(
		"api/users",
		{
			revalidateOnFocus: true,
			refreshInterval: 10000,
		},
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			nick: "",
			password: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		form.reset();

		toast
			.promise(
				storeNewUser(data).then(async () => await mutate()),
				{
					loading: "creating user, please wait...",
					success: "user created",
					error: "unknown error",
				},
			)
			.catch(console.error);
	});

	return (
		<Form {...form}>
			<form onSubmit={onSubmit}>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Nick</TableHead>
							<TableHead>Password</TableHead>
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

							<TableCell>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													type="password"
													placeholder="Type a password"
													{...field}
												/>
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

						{data?.map((user) => (
							<TableRow key={user.id}>
								<TableCell className="font-medium">{user.name}</TableCell>

								<TableCell>{user.nick}</TableCell>

								<PatchPassword userId={user.id} />

								<TableCell className="text-right">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<Button
													variant="outline"
													size="icon"
													type="button"
													onClick={(e) => {
														e.preventDefault();

														toast
															.promise(
																destroyUserById(user.id).then(
																	async () => await mutate(),
																),
																{
																	loading: "deleting user, please wait...",
																	success: "user deleted",
																	error: "unknown error",
																},
															)
															.catch(console.error);
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
	);
};
