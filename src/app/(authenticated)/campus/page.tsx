"use client";

import { CampusTable } from "@/components/tables/campus-table";
import { useIsClient } from "@/hooks/isClient";
import type { FC } from "react";

const Page: FC = () => {
	const isClient = useIsClient();
	return <>{isClient && <CampusTable />}</>;
};

export default Page;
