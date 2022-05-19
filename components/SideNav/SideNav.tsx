import React, { ReactNode, ReactText, useEffect } from "react";
import {
	IconButton,
	Box,
	CloseButton,
	Flex,
	Icon,
	useColorModeValue,
	Drawer,
	DrawerContent,
	Text,
	useDisclosure,
	BoxProps,
	FlexProps,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Avatar,
	Button,
	MenuDivider,
	VStack,
	HStack,
} from "@chakra-ui/react";
import {
	FiHome,
	FiTrendingUp,
	FiCompass,
	FiStar,
	FiSettings,
	FiMenu,
	FiSearch,
	FiCalendar,
	FiChevronDown,
	FiBell,
} from "react-icons/fi";
import { BsCashStack } from "react-icons/bs";
import { IconType } from "react-icons";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { getBalance, getTransactions } from "../../redux/actions";
import { useDispatch } from "react-redux";

interface LinkItemProps {
	name: string;
	icon: IconType;
	href: string;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: "Overview", icon: FiHome, href: "/" },
	{ name: "Spending", icon: BsCashStack, href: "/spending" },
	{ name: "Transactions", icon: FiSearch, href: "/transactions" },
];

export default function SideNav({ children }: { children: ReactNode }) {
	const dispatch = useDispatch();
	const { data: session, status } = useSession();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		dispatch(getBalance());
		dispatch(getTransactions());
	}, []);

	return session?.user && session?.user.access_token ? (
		<Box minH="100vh">
			<SidebarContent
				onClose={() => onClose}
				display={{ base: "none", md: "block" }}
			/>
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="full"
			>
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
			<MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
			<Box ml={{ base: 0, md: 60 }} p="4">
				{children}
			</Box>
		</Box>
	) : (
		<>{children}</>
	);
}

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	const { data: session, status } = useSession();
	return (
		<Box
			bg={useColorModeValue("white", "gray.900")}
			borderRight="1px"
			borderRightColor={useColorModeValue("gray.200", "gray.700")}
			w={{ base: "full", md: 60 }}
			pos="fixed"
			h="full"
			{...rest}
		>
			<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
				<Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
					Profinance
				</Text>
				<CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
			</Flex>
			<Flex h={"90%"} direction={"column"} justifyContent={"space-between"}>
				<Flex direction={"column"}>
					{LinkItems.map((link) => (
						<NavItem
							onClose={onClose}
							href={link.href}
							key={link.name}
							icon={link.icon}
						>
							{link.name}
						</NavItem>
					))}
				</Flex>
				<Flex justifyContent={"center"} alignItems={"center"}>
					<Menu>
						<MenuButton
							py={2}
							transition="all 0.3s"
							_focus={{ boxShadow: "none" }}
						>
							<HStack>
								<Avatar size={"sm"} src={session?.user.image} />
								<VStack alignItems="flex-start" spacing="1px" ml="2">
									<Text fontSize="sm">{session?.user?.name}</Text>
									<Text fontSize="xs" color="gray.600">
										{session?.user?.email}
									</Text>
								</VStack>
								<Box>
									<FiChevronDown />
								</Box>
							</HStack>
						</MenuButton>
						<MenuList
							bg={useColorModeValue("white", "gray.900")}
							borderColor={useColorModeValue("gray.200", "gray.700")}
						>
							<MenuItem>Profile</MenuItem>
							<MenuItem>Settings</MenuItem>
							<MenuDivider />
							<MenuItem
								color={useColorModeValue("red.600", "red.400")}
								onClick={signOut}
							>
								Sign out
							</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			</Flex>
		</Box>
	);
};

interface NavItemProps extends FlexProps {
	icon: IconType;
	children: ReactText;
}
const NavItem = ({ onClose, href, icon, children, ...rest }: NavItemProps) => {
	return (
		<Link
			href={href}
			style={{ textDecoration: "none" }}
			_focus={{ boxShadow: "none" }}
		>
			<a>
				<Flex
					onClick={() => {
						setTimeout(() => onClose(), 300);
					}}
					m={2}
					align="center"
					p="3"
					mx="4"
					borderRadius="lg"
					role="group"
					cursor="pointer"
					_hover={{
						bg: "cyan.400",
						color: "white",
					}}
					{...rest}
				>
					{icon && (
						<Icon
							mr="4"
							fontSize="16"
							_groupHover={{
								color: "white",
							}}
							as={icon}
						/>
					)}
					{children}
				</Flex>
			</a>
		</Link>
	);
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 24 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue("white", "gray.900")}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue("gray.200", "gray.700")}
			justifyContent="flex-start"
			{...rest}
		>
			<IconButton
				variant="outline"
				onClick={onOpen}
				aria-label="open menu"
				icon={<FiMenu />}
			/>

			<Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
				Profinance
			</Text>
		</Flex>
	);
};
