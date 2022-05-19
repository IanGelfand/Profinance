import React, { useEffect, useState } from "react";
import {
	Center,
	Spinner,
	TableContainer,
	Table,
	Td,
	Tr,
	Th,
	Thead,
	Tbody,
	Tfoot,
	Text,
	Flex,
	useMediaQuery,
	Menu,
	MenuButton,
	Select,
	useDisclosure,
} from "@chakra-ui/react";
import { getSession } from "next-auth/react";
import { FiChevronRight } from "react-icons/fi";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import TransactionDetailsModal from "../components/TransactionTable/TransactionDetailsModal";
import coin from "../public/290-coin-outline-edited.json";
import Lottie from "react-lottie-player";
import { useSelector } from "react-redux";

export default function Transactions() {
	const transactions = useSelector((state) => state.transactions);
	const [transactionDetails, setTransactionDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const [transactionCategories, setTransactionCategories] = useState([]);
	const [category, setCategory] = useState("All Categories");
	const [transactionAccountTypes, setTransactionAccountTypes] = useState([]);
	const [accountType, setAccountType] = useState("All Accounts");
	const [isMobile] = useMediaQuery("(max-width: 768px)");
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		setLoading(true);
		if (Object.values(transactions).length > 0) {
			const categories = transactions.transactions.reduce((acc, cur) => {
				if (cur.category) {
					if (!acc.includes(cur.category[0])) {
						acc.push(cur.category[0]);
					}
				}
				return acc;
			}, []);

			setTransactionAccountTypes(transactions.accounts);
			setTransactionCategories(categories);
			setLoading(false);
		}
	}, [transactions]);

	return (
		<>
			{loading && !Object.values(transactions).length > 0 ? (
				<Center h="100vh">
					<Lottie
						loop
						animationData={coin}
						play
						style={{ width: 75, height: 75 }}
					/>
				</Center>
			) : (
				<>
					<Flex direction={isMobile ? "column" : "row"}>
						<Select
							m={2}
							shadow="md"
							variant="filled"
							onChange={(e) => {
								setAccountType(e.target.value);
							}}
						>
							<option>All Accounts</option>
							{transactionAccountTypes.map((account) => (
								<option value={account.subtype} key={account.account_id}>
									{account.name}
								</option>
							))}
						</Select>
						<Select
							m={2}
							shadow="md"
							variant="filled"
							onChange={(e) => {
								setCategory(e.target.value);
							}}
						>
							<option>All Categories</option>
							{transactionCategories.map((cat, index) => (
								<option value={cat} key={index}>
									{cat}
								</option>
							))}
						</Select>
					</Flex>
					<TableContainer mt={5} shadow={"lg"} borderRadius={5}>
						<Table variant="simple">
							<Thead>
								<Tr>
									{!isMobile && <Th>Date</Th>}
									{!isMobile && <Th>Name</Th>}
									{!isMobile && <Th>Category</Th>}
									{!isMobile && <Th>Amount</Th>}
								</Tr>
							</Thead>
							<Tbody>
								{transactions.transactions.map((transaction) => {
									return transactionAccountTypes.map((account) => {
										if (
											(transaction.category[0] === category ||
												category === "All Categories") &&
											(account.subtype === accountType ||
												accountType === "All Accounts") &&
											account.account_id === transaction.account_id
										) {
											return (
												<TransactionTable
													isMobile={isMobile}
													key={transaction.transaction_id}
													onOpen={onOpen}
													transaction={transaction}
													setTransactionDetails={setTransactionDetails}
												/>
											);
										}
									});
								})}
							</Tbody>
						</Table>
					</TableContainer>
					{transactionDetails && (
						<TransactionDetailsModal
							accounts={transactionAccountTypes}
							transaction={transactionDetails}
							isOpen={isOpen}
							onOpen={onOpen}
							onClose={onClose}
						/>
					)}
				</>
			)}
		</>
	);
}

export async function getServerSideProps(context: any) {
	const { req, res } = context;
	const session = await getSession({ req });

	if (!session) {
		res.writeHead(302, {
			Location: "/signin",
		});
		res.end();
	} else if (!session.user.access_token) {
		res.writeHead(302, {
			Location: "/connect",
		});
		res.end();
	}
	return {
		props: {},
	};
}
