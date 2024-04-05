"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type FC, useState } from "react";

interface Props {
	value: string;
}

export const CopyClipboard: FC<Props> = ({ value }) => {
	const [isCopied, setIsCopied] = useState(false);

	return (
		<section className="flex items-center gap-2">
			<Input value={value} readOnly className="w-[512px]" />
			<Button
				onClick={() => {
					navigator.clipboard
						.writeText(value)
						.then(() => {
							setIsCopied(true);
							setTimeout(() => {
								setIsCopied(false);
							}, 1500);
						})
						.catch((err) => {
							console.log(err);
							alert("Error");
						});
				}}
			>
				{isCopied ? "Copied!" : "Copy"}
			</Button>
		</section>
	);
};
