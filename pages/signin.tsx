import { FcGoogle } from "react-icons/fc";
import {
	Button,
	Center,
	Text,
	Flex,
	Stack,
	Heading,
	Box,
	Link,
} from "@chakra-ui/react";
import { getProviders, signIn, getSession } from "next-auth/react";

export default function SignIn({ providers }: any) {
	return (
		<Flex minH={"100vh"} align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"}>Sign in to your account</Heading>
					<Text fontSize={"lg"} color={"gray.600"}>
						to enjoy all of our cool <Link color={"blue.400"}>features</Link> ✌️
					</Text>
				</Stack>
				<Box rounded={"lg"} boxShadow={"lg"} p={8}>
					{Object.values(providers).map((provider: any) => (
						<Button
							onClick={() => signIn(provider.id)}
							key={provider.name}
							w={"full"}
							maxW={"md"}
							variant={"outline"}
							leftIcon={<FcGoogle />}
						>
							<Center>
								<Text>Sign in with Google</Text>
							</Center>
						</Button>
					))}
				</Box>
			</Stack>
		</Flex>
	);
}

export async function getServerSideProps(context: any) {
	const { req, res } = context;
	const session = await getSession({ req });
	const providers = await getProviders();

	if (session) {
		res.writeHead(302, {
			Location: "/",
		});
		res.end();
	}
	return {
		props: { providers },
	};
}
