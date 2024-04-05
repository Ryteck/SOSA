"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import type { FC } from "react";

export const SignOut: FC = () => (
	<Button
		onClick={() => {
			signOut().catch(console.error);
		}}
	>
		Sign out
	</Button>
);
