import { cn } from "@/lib/utils";
import type * as React from "react";

const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
	className,
	...props
}) => (
	<div
		className={cn("animate-pulse rounded-md bg-muted", className)}
		{...props}
	/>
);

export { Skeleton };
