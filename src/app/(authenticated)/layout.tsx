import { SideMenu } from "@/components/side-menu";
import { Separator } from "@/components/ui/separator";
import authOptions from "@/settings/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = async ({ children }) => {
	const session = await getServerSession(authOptions);
	if (session === null) redirect("/");

	return (
		<main className="flex h-screen flex-col">
			<div className="flex items-center justify-between p-4">
				<h2 className="text-2xl font-bold">SOSA system</h2>
				<SideMenu />
			</div>
			<Separator />
			{children}
		</main>
	);
};

export default Layout;
