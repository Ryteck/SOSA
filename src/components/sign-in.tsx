"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import type { FC } from "react";

export const SignIn: FC = () => (
	<Button
		onClick={() => {
			signIn().catch(console.error);
		}}
	>
		Sign in
	</Button>
);
