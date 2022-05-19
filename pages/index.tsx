import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBalance, getTransactions } from "../redux/actions";
import type { NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import {
	Button,
	Center,
	Spinner,
	Box,
	Text,
	useMediaQuery,
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableCaption,
	TableContainer,
	Flex,
	Menu,
	MenuButton,
	useDisclosure,
} from "@chakra-ui/react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from "chart.js";
import { FiChevronRight } from "react-icons/fi";
import { AiFillBank } from "react-icons/ai";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import TransactionTableMobile from "../components/TransactionTable/TransactionTableMobile";
import TransactionDetailsModal from "../components/TransactionTable/TransactionDetailsModal";
import coin from "../public/290-coin-outline-edited.json";
import Lottie from "react-lottie-player";
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
);

const Home: NextPage = () => {
	const balance = useSelector((state) => state.balance);
	const transactions = useSelector((state) => state.transactions);
	const [transactionDetails, setTransactionDetails] = useState(null);
	const [loading, setLoading] = useState(true);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isMobile] = useMediaQuery("(max-width: 768px)");
	const dispatch = useDispatch();

	useEffect(() => {
		setLoading(true);
		if (
			Object.values(transactions).length > 0 &&
			Object.values(balance).length > 0
		) {
			setLoading(false);
		}
	}, [transactions, balance]);
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Spending",
			},
		},
	};
	const labels = Array.from({ length: 30 }, (_, i) =>
		new Date(new Date().setDate(new Date().getDate() - i)).toLocaleDateString(
			"en-US",
			{
				month: "short",
				day: "numeric",
			},
		),
	).reverse();
	const data = {
		labels,
		datasets: [
			{
				label: "Income",
				data: labels.map((day) =>
					!loading &&
					Object.keys(transactions).length > 0 &&
					Object.keys(balance).length > 0
						? transactions.transactions.reduce((acc, transaction) => {
								if (
									transaction.amount < 0 &&
									new Date(transaction.date).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									}) === day
								) {
									return acc + Math.abs(transaction.amount);
								} else {
									return acc;
								}
						  }, 0)
						: 0,
				),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
			},
			{
				label: "Expenses",
				data: labels.map((day) =>
					!loading &&
					Object.keys(transactions).length > 0 &&
					Object.keys(balance).length > 0
						? transactions.transactions.reduce((acc, transaction) => {
								if (
									transaction.amount > 0 &&
									new Date(transaction.date).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									}) === day
								) {
									return acc + transaction.amount;
								} else {
									return acc;
								}
						  }, 0)
						: 0,
				),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};
	return (
		<>
			{!loading &&
			Object.keys(transactions).length > 0 &&
			Object.keys(balance).length > 0 ? (
				<>
					{balance.accounts.map((account) => {
						if (account.subtype === "checking") {
							return (
								<React.Fragment key={account.account_id}>
									<Box
										shadow={"lg"}
										w={isMobile ? "100%" : "20%"}
										textAlign={"center"}
										color="white"
										bg={"blue.500"}
										borderRadius={5}
									>
										<Text color={"gray.300"}>Account Balance</Text>
										<Text fontWeight={"medium"} fontSize={"3xl"}>
											$<></>
											{account.balances.available}
										</Text>
										<Text color={"gray.300"}>
											as of {new Date().toLocaleDateString("en-US")}
										</Text>
									</Box>
									<Flex
										alignItems={isMobile && "center"}
										direction={isMobile && "column"}
									>
										<Box shadow="lg" borderRadius={5} p={5}>
											<Line
												style={{
													width: "100%",
													height: "100%",
												}}
												options={options}
												data={data}
											/>
										</Box>
									</Flex>
								</React.Fragment>
							);
						}
					})}
					<Flex
						direction={isMobile && "column"}
						justifyContent={"space-between"}
						my={2}
					>
						<Text fontWeight={"medium"} fontSize={"lg"}>
							Recent Transactions
						</Text>
						<Text color={"gray.500"}>
							You&apos;ve had {transactions.total_transactions} transactions so
							far this month
						</Text>
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
								{transactions.transactions.map((transaction) => (
									<TransactionTable
										isMobile={isMobile}
										key={transaction.transaction_id}
										onOpen={onOpen}
										transaction={transaction}
										setTransactionDetails={setTransactionDetails}
									/>
								))}
							</Tbody>
						</Table>
					</TableContainer>
					{transactionDetails && (
						<TransactionDetailsModal
							accounts={transactions.accounts}
							transaction={transactionDetails}
							isOpen={isOpen}
							onOpen={onOpen}
							onClose={onClose}
						/>
					)}
				</>
			) : (
				<Center h="100vh">
					<Lottie
						loop
						animationData={coin}
						play
						style={{ width: 75, height: 75 }}
					/>
				</Center>
			)}
		</>
	);
};

export default Home;

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
