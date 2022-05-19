import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
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
import {
	Flex,
	Center,
	useDisclosure,
	Table,
	Thead,
	Tr,
	Tbody,
	TableContainer,
	Th,
	Box,
	Text,
	Td,
} from "@chakra-ui/react";
import coin from "../public/290-coin-outline-edited.json";
import Lottie from "react-lottie-player";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import TransactionDetailsModal from "../components/TransactionTable/TransactionDetailsModal";

export default function Spending() {
	const transactions = useSelector((state) => state.transactions);
	const [loading, setLoading] = useState(true);
	const [transactionDetails, setTransactionDetails] = useState(null);
	const [categorizedAmounts, setCategorizedAmounts] = useState({});
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		setLoading(true);
		if (Object.values(transactions).length > 0) {
			setCategorizedAmounts(
				transactions.transactions.reduce((acc, transaction) => {
					if (transaction.amount > 0) {
						if (acc[transaction.category[0]]) {
							acc[transaction.category[0]].total += transaction.amount;
						} else {
							acc[transaction.category[0]] = {
								total: transaction.amount,
								category: transaction.category[0],
							};
						}
					}
					return acc;
				}, {}),
			);
			setLoading(false);
		}
	}, [transactions]);

	const options = {
		maintainAspectRatio: false,
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

	const labels =
		!loading && Object.values(transactions).length > 0
			? transactions.transactions.reduce((acc, transaction) => {
					if (transaction.category && transaction.amount > 0) {
						if (!acc.includes(transaction.category[0])) {
							acc.push(transaction.category[0]);
						}
					}
					return acc;
			  }, [])
			: [];

	const data = {
		labels,
		datasets: [
			{
				label: "My First Dataset",
				data: labels.map((category) =>
					!loading && Object.keys(transactions).length > 0
						? transactions.transactions.reduce((acc, transaction) => {
								if (transaction.category) {
									if (
										transaction.category[0] === category &&
										transaction.amount > 0
									) {
										acc += transaction.amount;
									}
								}
								return acc;
						  }, 0)
						: 0,
				),
				backgroundColor: labels.map(
					(label) => `hsl(${Math.random() * 360}, 100%, 50%)`,
				),
				hoverOffset: 4,
			},
		],
	};

	return !loading && Object.keys(transactions).length > 0 ? (
		<>
			<Text color={"gray.900"} m={5}>
				Spending Breakdown
			</Text>
			<TableContainer shadow={"lg"} borderRadius={5} w={"100%"}>
				<Box>
					<Doughnut
						style={{
							width: "75%",
							height: "75%",
						}}
						plugins={[
							{
								beforeDraw: function (chart) {
									var width = chart.width,
										height = chart.height,
										ctx = chart.ctx;
									ctx.restore();
									var fontSize = (height / 220).toFixed(2);
									ctx.font = fontSize + "em sans-serif";
									ctx.textBaseline = "top";
									var text = `$${transactions.transactions
											.reduce((acc, transaction) => {
												if (transaction.amount > 0) {
													acc += transaction.amount;
												}
												return acc;
											}, 0)
											.toFixed(2)
											.toString()}`,
										textX = Math.round(
											(width - ctx.measureText(text).width) / 2,
										),
										textY = height / 2;
									ctx.fillText(text, textX, textY);
									ctx.save();
								},
							},
						]}
						data={data}
						options={options}
					/>
				</Box>
				<Table variant="simple">
					<Thead>
						<Tr>
							<Th color={"black"} fontWeight={"medium"}>
								Category
							</Th>
							<Th color={"black"} fontWeight={"medium"}>
								% Spend
							</Th>
							<Th color={"black"} fontWeight={"medium"}>
								Amount
							</Th>
						</Tr>
					</Thead>
					<Tbody>
						{Object.values(categorizedAmounts)
							.sort((a, b) => b.total - a.total)
							.map((category) => (
								<Tr key={category.category}>
									<Td>{category.category}</Td>
									<Td color={"black"} fontWeight={"medium"}>
										{(
											(category.total /
												transactions.transactions.reduce((acc, transaction) => {
													if (transaction.amount > 0) {
														acc += transaction.amount;
													}
													return acc;
												}, 0)) *
											100
										).toFixed(0)}
										% of spend
									</Td>
									<Td color={"black"} fontWeight={"medium"}>
										${category.total.toFixed(2)}
									</Td>
								</Tr>
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
	);
}
