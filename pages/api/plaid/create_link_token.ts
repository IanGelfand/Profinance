const { Configuration, PlaidApi, PlaidEnvironments } = require("plaid");
import { getSession } from "next-auth/react";

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
	const session = await getSession({ req });
	const tokenResponse = await client.linkTokenCreate({
		user: { client_user_id: session.userId },
		client_name: "Plaid's Tiny Quickstart",
		language: "en",
		products: ["auth", "transactions", "identity"],
		country_codes: ["US"],
		redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
	});
	res.json(tokenResponse.data);
}
