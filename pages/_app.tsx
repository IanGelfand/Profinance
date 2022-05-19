import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/layout/layout";
import { Provider } from "react-redux";
import { useStore } from "../redux/store";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const store = useStore(pageProps.initialReduxState);

	return (
		<Provider store={store}>
			<SessionProvider session={session}>
				<ChakraProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</ChakraProvider>
			</SessionProvider>
		</Provider>
	);
}

export default MyApp;
