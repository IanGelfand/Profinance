import React from "react";
import { FiChevronRight } from "react-icons/fi";
import { Tr, Td, Flex, Text } from "@chakra-ui/react";

export default function TransactionTable({
	transaction,
	onOpen,
	setTransactionDetails,
	isMobile,
}) {
	return isMobile ? (
		<Tr
			_hover={{
				bg: "gray.100",
			}}
			onClick={() => {
				setTransactionDetails(transaction);
				onOpen();
			}}
			key={transaction.transaction_id}
		>
			<Td>
				<Flex direction={"column"}>
					<Text>{transaction.name}</Text>
					<Text>
						{new Date(transaction.date).toLocaleDateString("en-US", {
							month: "short",
							day: "numeric",
						})}
					</Text>
				</Flex>
			</Td>
			<Td color={transaction.amount < 0 && "green.500"}>
				<Flex px={1} alignItems={"center"} justifyContent={"flex-end"}>
					{transaction.amount < 0
						? `+$${transaction.amount.toString().substring(1)}`
						: `$${transaction.amount}`}
					<FiChevronRight color={"black"} />
				</Flex>
			</Td>
		</Tr>
	) : (
		<Tr
			_hover={{
				bg: "gray.100",
			}}
			onClick={() => {
				setTransactionDetails(transaction);
				onOpen();
			}}
			key={transaction.transaction_id}
		>
			<Td>
				{new Date(transaction.date).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
				})}
			</Td>
			<Td>{transaction.name}</Td>
			<Td>{transaction.category[0]}</Td>
			<Td color={transaction.amount < 0 && "green.500"}>
				<Flex px={1} alignItems={"center"} justifyContent={"flex-end"}>
					{transaction.amount < 0
						? `+$${transaction.amount.toString().substring(1)}`
						: `$${transaction.amount}`}
					<FiChevronRight color={"black"} />
				</Flex>
			</Td>
		</Tr>
	);
}
