"use client";

import { SessionTable } from "@/components/tables/session-table";
import { useIsClient } from "@/hooks/isClient";
import type { FC } from "react";

const Page: FC = () => {
	const isClient = useIsClient();
	return <>{isClient && <SessionTable />}</>;
};

export default Page;
