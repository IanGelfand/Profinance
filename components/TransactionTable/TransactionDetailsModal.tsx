import React from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	Text,
	Divider,
} from "@chakra-ui/react";

export default function TransactionDetailsModal({
	isOpen,
	onOpen,
	onClose,
	transaction,
	accounts,
}) {
	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent w={"90%"}>
				<ModalHeader>
					{new Date(transaction.date).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
					})}
				</ModalHeader>
				<ModalCloseButton />
				<Divider />
				<ModalBody>
					<Text fontWeight="bold" color={"gray.500"}>
						{transaction.name}
					</Text>
					<Text
						color={transaction.amount < 0 && "green.500"}
						fontSize={"5xl"}
						fontWeight={"medium"}
					>
						{transaction.amount < 0
							? `+$${transaction.amount.toString().substring(1)}`
							: `$${transaction.amount}`}
					</Text>
					<Text fontSize={"sm"} color={"gray.500"}>
						{transaction.category[0]}
					</Text>
				</ModalBody>
				<Divider />
				<ModalFooter justifyContent={"center"}>
					{accounts.map((account) => {
						if (account.account_id === transaction.account_id) {
							return (
								<Text key={account.account_id}>
									{account.name} ...{account.mask}
								</Text>
							);
						}
					})}
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
