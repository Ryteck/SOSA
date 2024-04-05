"use client";

import { UserTable } from "@/components/tables/user-table";
import { useIsClient } from "@/hooks/isClient";
import type { FC } from "react";

const Page: FC = () => {
	const isClient = useIsClient();
	return <>{isClient && <UserTable />}</>;
};

export default Page;
