import {
  CHECKOUT_BEGIN,
  CHECKOUT_SUCCESS,
  CHECKOUT_CANCEL,
  GET_ERRORS
} from "./types";
import axios from "axios";

export const checkOut = payload => async dispatch => {
  try {
    const { data } = await axios.post(`/api/checkOut/pay`, payload);
    dispatch({
      type: CHECKOUT_BEGIN,
      payload: data
    });
  } catch ({ response }) {
    dispatch({ type: GET_ERRORS, payload: response.data });
  }
};

export const checkOutSuccess = payload => async dispatch => {
  console.log(payload);
  try {
    const { data } = await axios.post(`/api/checkout${payload.url}`, payload);
    if (data.status === "Success") {
      dispatch({
        type: CHECKOUT_SUCCESS,
        payload: data
      });
    } else {
      dispatch({
        type: CHECKOUT_CANCEL,
        payload: data
      });
    }
  } catch ({ response }) {
    dispatch({ type: GET_ERRORS, payload: response });
  }
};
