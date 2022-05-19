import { combineReducers } from "redux";
import * as types from "./types";

// INITIAL TIMER STATE
const initialBalance = {};
const initialTransactions = {};
const initialIncome = {};

const balanceReducer = (state = initialBalance, { type, payload }) => {
	switch (type) {
		case types.GET_BALANCE:
			return payload;
		default:
			return state;
	}
};

const transactionsReducer = (
	state = initialTransactions,
	{ type, payload },
) => {
	switch (type) {
		case types.GET_TRANSACTIONS:
			return payload;
		default:
			return state;
	}
};

const incomeReducer = (state = initialIncome, { type, payload }) => {
	switch (type) {
		case types.GET_INCOME:
			return payload;
		default:
			return state;
	}
};

// COMBINED REDUCERS
const reducers = {
	balance: balanceReducer,
	transactions: transactionsReducer,
	income: incomeReducer,
};

export default combineReducers(reducers);
