import * as types from "./types";
import axios from "axios";

//get balance
export const getBalance = () => async (dispatch) => {
	try {
		const { data } = await axios.get("/api/plaid/balance");
		return dispatch({ type: types.GET_BALANCE, payload: data["Balance"] });
	} catch (error) {
		console.log(error);
	}
};

export const getTransactions = () => async (dispatch) => {
	try {
		const { data } = await axios.get("/api/plaid/transactions");
		return dispatch({
			type: types.GET_TRANSACTIONS,
			payload: data["Transactions"],
		});
	} catch (error) {
		console.log(error);
	}
};
