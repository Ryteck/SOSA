"use client";

import destroySessionById from "@/actions/destroySessionById";
import setLocationsById from "@/actions/setLocationsById";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFetcher } from "@/hooks/fetcher";
import type LocalActive from "@/types/LocalActive";
import { GearIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { type FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import {ScrollArea} from "@/components/ui/scroll-area";

interface Props {
	sessionId: string;
}

export const ConfigureSession: FC<Props> = ({ sessionId }) => {
	const url = `api/locations/${sessionId}`;

	const { data: locations, isLoading } = useFetcher<LocalActive[]>(url, {});

	const [actives, setActives] = useState<string[]>([]);

	const { mutate } = useSWRConfig();

	useEffect(() => {
		if (!isLoading) {
			setActives(
				locations?.filter((local) => local.active).map(({ id }) => id) ?? [],
			);
		}
	}, [isLoading, locations]);

	return (
		<Dialog>
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger>
						<DialogTrigger asChild>
							<Button variant="outline" size="icon" type="button">
								<GearIcon className="h-4 w-4" />
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>Configure session</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<DialogContent>

					<DialogHeader>
						<DialogTitle>Edit session</DialogTitle>
						<DialogDescription>Available session locations</DialogDescription>
					</DialogHeader>

				<ScrollArea className="h-96 pr-8">
					<div className="flex flex-col gap-2">
						{locations?.map((local) => {
							const checkId = `local:${local.id}`;

							return (
								<div key={local.id} className="flex items-center gap-2">
									<Checkbox
										id={checkId}
										checked={actives.includes(local.id)}
										onCheckedChange={(checked) => {
											setActives((state) => {
												if (checked) return [...state, local.id];
												return state.filter((arg) => arg !== local.id);
											});
										}}
									/>
									<Label
										className="flex items-center gap-2 text-lg"
										htmlFor={checkId}
									>
										<p>
											{local.campus.name} - {local.name}
										</p>
										<p className="text-xs opacity-40">{local.details}</p>
									</Label>
								</div>
							);
						})}
					</div>
				</ScrollArea>

					<DialogFooter className="mt-8">
						<Button
							variant="destructive"
							onClick={() => {
								toast
									.promise(
										destroySessionById(sessionId).then(
											async () => await mutate("api/sessions"),
										),
										{
											loading: "closing, please wait...",
											success: "closed",
											error: "unknown error",
										},
									)
									.catch(console.error);
							}}
						>
							Close session
						</Button>

						<Button
							variant="secondary"
							onClick={() => {
								window.open(`/sessions/${sessionId}`, "_blank");
							}}
						>
							<OpenInNewWindowIcon className="mr-2 h-4 w-4" />
							share session
						</Button>

						<Button
							variant="default"
							onClick={() => {
								toast
									.promise(setLocationsById(sessionId, actives), {
										loading: "saving, please wait...",
										success: "saved",
										error: "unknown error",
									})
									.catch(console.error);
							}}
						>
							Save changes
						</Button>
					</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
