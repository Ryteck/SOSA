"use client";

import storeNewSession from "@/actions/storeNewSession";
import { ConfigureSession } from "@/components/configure-session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type PeopleWithSessionsAndAlerts from "@/types/PeopleWithSessionsAndAlerts";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import type { FC } from "react";
import toast from "react-hot-toast";

export const SessionTable: FC = () => {
	const { data, mutate } = useFetcher<PeopleWithSessionsAndAlerts[]>(
		"api/sessions",
		{
			revalidateOnFocus: true,
			refreshInterval: 10000,
		},
	);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Person Name</TableHead>
					<TableHead>Person Details</TableHead>
					<TableHead>Session status</TableHead>
					<TableHead className="text-right">Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{data?.map((person) => (
					<TableRow key={person.id}>
						<TableCell className="font-medium">{person.name}</TableCell>
						<TableCell>{person.details}</TableCell>

						<TableCell>
							<Badge
								variant={
									person.sessionId === undefined
										? "secondary"
										: person.alertId === undefined
											? "default"
											: "destructive"
								}
							>
								{person.sessionId === undefined
									? "closed"
									: person.alertId === undefined
										? "opened"
										: "alerted"}
							</Badge>
						</TableCell>

						<TableCell className="text-right">
							{person.sessionId === undefined ? (
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
															storeNewSession({ personId: person.id }).then(
																async () => await mutate(),
															),
															{
																loading: "opening session, please wait...",
																success: "session opened",
																error: "unknown error",
															},
														)
														.catch(console.error);
												}}
											>
												<OpenInNewWindowIcon className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Open new session</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							) : (
								<ConfigureSession sessionId={person.sessionId} />
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
