"use client";

import { AlertTable } from "@/components/tables/alert-table";
import { useIsClient } from "@/hooks/isClient";
import type { FC } from "react";

const Page: FC = () => {
	const isClient = useIsClient();
	return <>{isClient && <AlertTable controllerMode />}</>;
};

export default Page;
