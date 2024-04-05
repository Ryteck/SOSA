"use client";

import destroyCampusById from "@/actions/destroyCampusById";
import destroyUserById from "@/actions/destroyUserById";
import storeNewCampus from "@/actions/storeNewCampus";
import storeNewUser from "@/actions/storeNewUser";
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
import type { Campus } from "@prisma/client";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { NIL } from "uuid";
import { z } from "zod";

const formSchema = z.object({
	name: z.string().min(1),
});

export const CampusTable: FC = () => {
	const { data, mutate } = useFetcher<Campus[]>("api/campus", {
		revalidateOnFocus: true,
		refreshInterval: 10000,
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		form.reset();

		toast
			.promise(
				storeNewCampus(data).then(async () => await mutate()),
				{
					loading: "creating campus, please wait...",
					success: "campus created",
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
							<TableHead>ID</TableHead>
							<TableHead>Name</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>
								<Input value={NIL} disabled />
							</TableCell>
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

						{data?.map((campus) => (
							<TableRow key={campus.id}>
								<TableCell>{campus.id}</TableCell>
								<TableCell className="font-medium">{campus.name}</TableCell>

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
																destroyCampusById(campus.id).then(
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
