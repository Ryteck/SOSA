import { compareHash } from "@/lib/hash";
import { userRepository } from "@/repositories/user";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				nick: {
					label: "Nick name",
					type: "text",
					placeholder: "type your nick",
				},
				password: {
					label: "Password",
					type: "password",
					placeholder: "type your password",
				},
			},
			async authorize(credentials) {
				if (!credentials) return null;

				if (credentials.nick === "")
					return credentials.password === String(process.env.BLANK_PASSWORD)
						? { id: "blank" }
						: null;

				const user = await userRepository.getUserByNick(credentials.nick);

				return compareHash(credentials.password, user.password)
					? { id: user.id }
					: null;
			},
		}),
	],
};

export default authOptions;
