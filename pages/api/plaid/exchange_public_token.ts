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
		const exchangeResponse = await client.itemPublicTokenExchange({
			public_token: req.body.public_token,
		});
		const user = await prisma.user.findUnique({
			where: { id: session.userId },
		});
		await prisma.user.update({
			where: { id: session.userId },
			data: {
				access_token: exchangeResponse.data.access_token,
			},
		});
		res.json(true);
	} catch (error) {
		console.error(error);
	}
}
