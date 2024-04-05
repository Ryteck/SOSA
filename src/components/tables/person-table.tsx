"use client";

import destroyPersonById from "@/actions/destroyPersonById";
import storeNewPerson from "@/actions/storeNewPerson";
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
import type { Person } from "@prisma/client";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(1),
	details: z.string(),
});

export const PersonTable: FC = () => {
	const { data, mutate } = useFetcher<Person[]>("api/people", {
		revalidateOnFocus: true,
		refreshInterval: 10000,
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			details: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		form.reset();

		toast
			.promise(
				storeNewPerson(data).then(async () => await mutate()),
				{
					loading: "creating person, please wait...",
					success: "person created",
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
							<TableHead>Person Name</TableHead>
							<TableHead>Person Details</TableHead>
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
									name="details"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="Type a detail" {...field} />
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

						{data?.map((person) => (
							<TableRow key={person.id}>
								<TableCell className="font-medium">{person.name}</TableCell>
								<TableCell>{person.details}</TableCell>
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
																destroyPersonById(person.id).then(
																	async () => await mutate(),
																),
																{
																	loading: "deleting person, please wait...",
																	success: "person deleted",
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
