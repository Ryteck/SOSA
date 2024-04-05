import authOptions from "@/settings/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
	const session = await getServerSession(authOptions);
	if (session !== null) redirect("/");

	return <>{children}</>;
};

export default Layout;
