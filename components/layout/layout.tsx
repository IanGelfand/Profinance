import { Flex, useMediaQuery } from "@chakra-ui/react";
import React from "react";
import SideNav from "../SideNav/SideNav";

export default function Layout({ children }) {
	const [isMobile] = useMediaQuery("(max-width: 768px)");
	return (
		<SideNav>
			<main>{children}</main>
		</SideNav>
	);
}
