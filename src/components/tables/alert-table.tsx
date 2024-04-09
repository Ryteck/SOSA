"use client";

import destroyAlertById from "@/actions/destroyAlertById";
import updateAlertUserById from "@/actions/updateAlertUserById";
import { Beep } from "@/components/beep";
import { Button } from "@/components/ui/button";
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
import type AlertDetailsWithSession from "@/types/AlertDetailsWithSession";
import type { Campus, User } from "@prisma/client";
import { Cross1Icon } from "@radix-ui/react-icons";
import { type FC, useEffect, useState } from "react";
import toast from "react-hot-toast";

const pad2 = (arg: number): string => arg.toString().padStart(2, "0");

interface TimerProps {
	createdAt: string | Date;
}

const Timer: FC<TimerProps> = ({ createdAt }) => {
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
		<TableCell className="text-right">
			{`${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`}
		</TableCell>
	);
};

interface UserSelectProps {
	id: string;
	users: Array<Omit<User, "password">>;
	userSelected?: string;
}

const UserSelect: FC<UserSelectProps> = ({ id, users, userSelected }) => {
	const [userSel, setUserSel] = useState(userSelected);

	const [userSelTemp, setUserSelTemp] = useState<undefined | string>(undefined);

	useEffect(() => {
		if (userSelected) {
			setUserSel(userSelected);

			if (userSelected === userSelTemp) setUserSelTemp(undefined);
		}
	}, [userSelected, userSelTemp]);

	return (
		<Select
			value={userSelTemp ?? userSel}
			onValueChange={(value) => {
				setUserSelTemp(value);
				updateAlertUserById(id, value).catch((err) => {
					console.error(err);
					setUserSel(userSel);
				});
			}}
		>
			<SelectTrigger>
				<SelectValue placeholder="Select a user" />
			</SelectTrigger>
			<SelectContent>
				{users?.map((user) => (
					<SelectItem key={user.id} value={user.id}>
						{user.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

interface Props {
	controllerMode?: true;
}

export const AlertTable: FC<Props> = ({ controllerMode }) => {
	const { data, mutate, isLoading } = useFetcher<AlertDetailsWithSession[]>(
		"api/alerts",
		{
			revalidateOnFocus: true,
			refreshInterval: 3000,
		},
	);

	const { data: campus } = useFetcher<Campus[]>("api/campus", {
		revalidateOnFocus: true,
		refreshInterval: 10000,
	});

	const { data: users } = useFetcher<Array<Omit<User, "password">>>(
		"api/users",
		{
			revalidateOnFocus: true,
			refreshInterval: 10000,
		},
	);

	const [isBeepEnable, setIsBeepEnable] = useState(false);
	const [selectedCampus, setSelectedCampus] = useState<string>();

	useEffect(() => {
		if (isLoading || isBeepEnable) return;

		const interval = setInterval(() => {
			setIsBeepEnable(true);
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	}, [isLoading, isBeepEnable]);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Person</TableHead>
					<TableHead>
						<Select value={selectedCampus} onValueChange={setSelectedCampus}>
							<SelectTrigger>
								<SelectValue placeholder="Select a campus" />
							</SelectTrigger>
							<SelectContent>
								{campus?.map((arg) => (
									<SelectItem key={arg.id} value={arg.id}>
										{arg.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</TableHead>
					<TableHead>Local</TableHead>
					<TableHead>Details</TableHead>
					<TableHead>User</TableHead>
					<TableHead className="text-right">Time</TableHead>
					{controllerMode && (
						<TableHead className="text-right">Close</TableHead>
					)}
				</TableRow>
			</TableHeader>
			<TableBody>
				{data
					?.filter(
						(arg) =>
							selectedCampus === undefined ||
							arg.local.campus.id === selectedCampus,
					)
					.map((alert) => (
						<TableRow key={alert.id}>
							<Beep enable={isBeepEnable} />

							<TableCell>
								<p className="text-xl font-bold">{alert.session.person.name}</p>
								<p className="opacity-50">{alert.session.person.details}</p>
							</TableCell>

							<TableCell>{alert.local.campus.name}</TableCell>

							<TableCell>
								<p className="text-xl font-bold">{alert.local.name}</p>
								<p className="opacity-50">{alert.local.details}</p>
							</TableCell>

							<TableCell>{alert.details}</TableCell>

							<TableCell>
								{controllerMode ? (
									<UserSelect
										id={alert.id}
										userSelected={alert.user?.id}
										users={users ?? []}
									/>
								) : (
									alert.user?.name
								)}
							</TableCell>

							<Timer createdAt={alert.createdAt} />

							{controllerMode && (
								<TableCell className="text-right">
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
																destroyAlertById(alert.id).then(
																	async () => await mutate(),
																),
																{
																	loading: "closing alert, please wait...",
																	success: "alert closed",
																	error: "unknown error",
																},
															)
															.catch(console.error);
													}}
												>
													<Cross1Icon className="h-4 w-4" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>Close</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</TableCell>
							)}
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
};
