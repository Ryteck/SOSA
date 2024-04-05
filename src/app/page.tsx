import authOptions from "@/settings/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { FC } from "react";

const Page: FC = async () => {
	const session = await getServerSession(authOptions);
	redirect(session === null ? "/login" : "/alerts");
};

export default Page;
