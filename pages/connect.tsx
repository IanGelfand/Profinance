import React, { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";
import { getSession, useSession } from "next-auth/react";
import {
	Button,
	Center,
	Flex,
	Heading,
	Spinner,
	Stack,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

function Connect(props) {
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(true);
	const { data: session, status } = useSession();
	const router = useRouter();

	const onSuccess = useCallback(
		async (publicToken) => {
			setLoading(true);
			await fetch("/api/plaid/exchange_public_token", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ public_token: publicToken }),
			});
			setLoading(false);
			router.reload();
			router.push("/");
		},
		[router],
	);

	// Creates a Link token
	const createLinkToken = React.useCallback(async () => {
		// For OAuth, use previously generated Link token
		if (window.location.href.includes("?oauth_state_id=")) {
			const linkToken = localStorage.getItem("link_token");
			setToken(linkToken);
		} else {
			const response = await fetch("/api/plaid/create_link_token", {});
			const data = await response.json();
			setToken(data.link_token);
			localStorage.setItem("link_token", data.link_token);
		}
	}, [setToken]);

	let isOauth = false;

	const config = {
		token,
		onSuccess,
	};

	// For OAuth, configure the received redirect URI
	if (typeof window !== "undefined") {
		if (window.location.href.includes("?oauth_state_id=")) {
			config.receivedRedirectUri = window.location.href;
			isOauth = true;
		}
	}

	const { open, ready } = usePlaidLink(config);

	useEffect(() => {
		if (!session?.user?.access_token) {
			if (token == null) {
				createLinkToken();
			}
			if (isOauth && ready) {
				open();
			}
		}
	}, [
		token,
		isOauth,
		ready,
		open,
		session?.user?.access_token,
		createLinkToken,
	]);
	return (
		<div>
			{status === "loading" && (
				<Center h={"100vh"}>
					<Spinner />
				</Center>
			)}
			{!session?.user?.access_token && (
				<Flex
					mx={5}
					minH={"100vh"}
					align={"center"}
					justify={"center"}
					bg={"gray.50"}
				>
					<Stack
						spacing={4}
						w={"full"}
						maxW={"md"}
						bg={"white"}
						rounded={"xl"}
						boxShadow={"lg"}
						p={6}
						my={12}
					>
						<Heading
							textAlign={"center"}
							lineHeight={1.1}
							fontSize={{ base: "2xl", md: "3xl" }}
						>
							Connect to your bank{" "}
						</Heading>
						<Stack spacing={6}>
							<Button
								bg={"blue.400"}
								color={"white"}
								_hover={{
									bg: "blue.500",
								}}
								onClick={() => open()}
							>
								Connect Bank
							</Button>
						</Stack>
					</Stack>
				</Flex>
			)}
		</div>
	);
}

export default Connect;

export async function getServerSideProps(context: any) {
	const { req, res } = context;
	const session = await getSession({ req });

	if (!session) {
		res.writeHead(302, {
			Location: "/signin",
		});
		res.end();
	} else if (session.user.access_token) {
		res.writeHead(302, {
			Location: "/",
		});
		res.end();
	}
	return {
		props: {},
	};
}
