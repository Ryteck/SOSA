"use client";

import { LocalTable } from "@/components/tables/local-table";
import { PersonTable } from "@/components/tables/person-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useIsClient } from "@/hooks/isClient";
import type { FC } from "react";

const Page: FC = () => {
	const isClient = useIsClient();
	return (
		<>
			{isClient && (
				<div
					className="flex h-full gap-4"
					style={{ maxHeight: "calc(100vh - 80px)" }}
				>
					<ScrollArea className="w-full">
						<PersonTable />
					</ScrollArea>
					<Separator orientation="vertical" className="h-full" />
					<ScrollArea className="w-full">
						<LocalTable />
					</ScrollArea>
				</div>
			)}
		</>
	);
};

export default Page;
