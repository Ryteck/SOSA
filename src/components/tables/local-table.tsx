"use client";

import destroyLocalById from "@/actions/destroyLocalById";
import storeNewLocal from "@/actions/storeNewLocal";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import type LocalDetails from "@/types/LocalDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Campus } from "@prisma/client";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
	name: z.string().min(1),
	details: z.string(),
	campusId: z.string(),
});

export const LocalTable: FC = () => {
	const { data, mutate } = useFetcher<LocalDetails[]>("api/locations", {
		revalidateOnFocus: true,
		refreshInterval: 10000,
	});

	const { data: campus } = useFetcher<Campus[]>("api/campus", {
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
				storeNewLocal(data).then(async () => await mutate()),
				{
					loading: "creating local, please wait...",
					success: "local created",
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
							<TableHead>Local Name</TableHead>
							<TableHead>Local Details</TableHead>
							<TableHead>Campus</TableHead>
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

							<TableCell>
								<FormField
									control={form.control}
									name="campusId"
									render={({ field }) => (
										<FormItem>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a campus" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{campus?.map((arg) => (
														<SelectItem key={arg.id} value={arg.id}>
															{arg.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
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

						{data?.map((local) => (
							<TableRow key={local.id}>
								<TableCell className="font-medium">{local.name}</TableCell>
								<TableCell>{local.details}</TableCell>

								<TableCell>{local.campus.name}</TableCell>

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
																destroyLocalById(local.id).then(
																	async () => await mutate(),
																),
																{
																	loading: "deleting local, please wait...",
																	success: "local deleted",
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
