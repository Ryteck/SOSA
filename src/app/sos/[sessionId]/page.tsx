"use client";

import destroyAlertById from "@/actions/destroyAlertById";
import storeNewAlert from "@/actions/storeNewAlert";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFetcher } from "@/hooks/fetcher";
import type AlertDetails from "@/types/AlertDetails";
import type FullSessionData from "@/types/FullSessionData";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { type FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { KeyedMutator } from "swr";

const pad2 = (arg: number): string => arg.toString().padStart(2, "0");

interface AlertProps {
	alert: AlertDetails;
	mutate: KeyedMutator<FullSessionData | null>;
}

const Alert: FC<AlertProps> = ({
	alert: { id, local, details, createdAt, user },
	mutate,
}) => {
	const [timeDifference, setTimeDifference] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const updateDifference = (): void => {
			const now = new Date();
			const moment = new Date(createdAt);
			const milli = now.getTime() - moment.getTime();

			const hours = Math.floor(milli / (1000 * 60 * 60));
			const minutes = Math.floor((milli % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((milli % (1000 * 60)) / 1000);

			setTimeDifference({
				hours,
				minutes,
				seconds,
			});
		};

		updateDifference();

		const intervalId = setInterval(updateDifference, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [createdAt]);

	const { hours, minutes, seconds } = timeDifference;

	return (
		<>
			<p className="text-2xl font-bold">Alert opened</p>

			{user !== null && <Badge>{user.name} is on the way</Badge>}

			<Card aria-label="Toggle bold" className="flex flex-col p-4 text-center">
				<p className="text-2xl font-bold">{local.name}</p>
				<p className="opacity-40">{local.details}</p>
			</Card>

			<p className="opacity-70">{details}</p>

			<p>{`${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`}</p>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant="destructive">Cancel</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Confirm?</DialogTitle>
						<DialogDescription>
							Do you confirm the cancellation of SOS?
						</DialogDescription>
					</DialogHeader>

					<div>{details}</div>

					<DialogFooter>
						<Button
							variant="destructive"
							onClick={() => {
								toast
									.promise(
										destroyAlertById(id).then(async () => await mutate()),
										{
											loading: "closing alert, please wait...",
											success: "alert closed",
											error: "unknown error",
										},
									)
									.catch(console.error);
							}}
						>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

interface Params {
	params: { sessionId: string };
}

const Page: FC<Params> = ({ params }) => {
	const { data, isLoading, mutate } = useFetcher<null | FullSessionData>(
		`/api/sessions/${params.sessionId}`,
		{
			revalidateOnFocus: true,
			refreshInterval: 5000,
		},
	);

	const [selectedLocal, setSelectedLocal] = useState("");
	const [details, setDetails] = useState("");

	useEffect(() => {
		if (isLoading) return;

		setSelectedLocal((state) =>
			data?.locations.map(({ id }) => id).includes(state) ? state : "",
		);

		if (data?.locations.length === 1) setSelectedLocal(data.locations[0].id);
	}, [data, isLoading]);

	if (isLoading)
		return (
			<main className="flex h-screen w-screen items-center justify-center">
				loading...
			</main>
		);

	if (data === null) {
		return (
			<main className="flex h-screen w-screen items-center justify-center">
				closed session
			</main>
		);
	}

	return (
		<ScrollArea className="h-screen w-screen">
			<main className="flex h-full w-full flex-col items-center gap-8 pt-8 text-center">
				<h2 className="text-3xl font-bold">{data?.person.name}</h2>

				{data?.alerts.length === 0 ? (
					<>
						<ScrollArea className="w-screen">
							<Card className="p-8">
								{data.locations.length === 0 ? (
									<Skeleton className="m-auto h-40 w-40" />
								) : (
									<ToggleGroup
										variant="outline"
										type="single"
										value={selectedLocal}
										onValueChange={(value) => {
											if (value !== "") setSelectedLocal(value);
										}}
									>
										{data.locations.map((local) => (
											<ToggleGroupItem
												key={local.id}
												value={local.id}
												aria-label="Toggle bold"
												className="flex h-full gap-2 flex-col p-2"
											>
												<p className="text-lg font-bold">{local.campus.name}</p>
												<p className="text-2xl font-bold">{local.name}</p>
												<p className="opacity-50">{local.details}</p>
											</ToggleGroupItem>
										))}
									</ToggleGroup>
								)}
							</Card>
							<ScrollBar orientation="horizontal" />
						</ScrollArea>

						<h2 className="text-3xl font-bold">
							{selectedLocal !== ""
								? `${
										data?.locations.find((arg) => arg.id === selectedLocal)
											?.name
									} selected`
								: "No location selected"}
						</h2>

						<Textarea
							className="w-5/6"
							placeholder="Type your message here."
							value={details}
							onChange={(e) => {
								setDetails(e.target.value);
							}}
						/>

						<Dialog>
							<DialogTrigger asChild>
								<Button
									className="flex-col rounded-full"
									style={{
										minWidth: "15rem",
										minHeight: "15rem",
										maxWidth: "15rem",
										maxHeight: "15rem",
									}}
									disabled={selectedLocal === ""}
								>
									<LightningBoltIcon className="h-40 w-40" />
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Confirm?</DialogTitle>
									<DialogDescription>
										Do you confirm the opening of SOS?
									</DialogDescription>
								</DialogHeader>

								<div>{details}</div>

								<DialogFooter>
									<Button
										onClick={() => {
											setDetails("");
											setSelectedLocal("");

											toast
												.promise(
													storeNewAlert({
														sessionId: params.sessionId,
														localId: selectedLocal,
														details,
													}).then(async () => await mutate()),
													{
														loading: "opening alert, please wait...",
														success: "alert opened",
														error: "unknown error",
													},
												)
												.catch(console.error);
										}}
									>
										Confirm
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</>
				) : (
					data !== undefined && <Alert alert={data.alerts[0]} mutate={mutate} />
				)}

				<ThemeModeToggle />
			</main>
		</ScrollArea>
	);
};

export default Page;
