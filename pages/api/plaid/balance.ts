const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
import { getSession } from "next-auth/react";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const config = new Configuration({
	basePath: PlaidEnvironments[process.env.PLAID_ENV],
	baseOptions: {
		headers: {
			"PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
			"PLAID-SECRET": process.env.PLAID_SECRET,
			"Plaid-Version": "2020-09-14",
		},
	},
});

const client = new PlaidApi(config);

export default async function handler(req, res) {
	try {
		const session = await getSession({ req });
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
		});
		const balanceResponse = await client.accountsBalanceGet({
			access_token: user.access_token,
		});
		res.json({
			Balance: balanceResponse.data,
		});
	} catch (error) {
		console.error(error);
	}
}
