import axios from "axios";
import io from "socket.io-client";
import {
  ADD_REQUEST,
  GET_ERRORS,
  GET_REQUEST,
  GET_REQUESTS,
  REQUEST_LOADING,
  ADD_REPLY,
  SENT_OFFER,
  GET_OFFER,
  GET_OFFERS,
  OFFER_LOADING,
  GET_ORDERS,
  GET_COUNT
} from "./types";
  
const socket = io.connect("http://localhost:5000", {
  transports: ["websocket", "polling", "flashsocket"]
});

export const requestLoading = () => ({ type: REQUEST_LOADING });
export const offerLoading = () => ({ type: OFFER_LOADING });

export const addRequest = (workData, history) => async dispatch => {
  dispatch(requestLoading());
  try {
    const { data } = await axios.post(`/api/workRequest/`, workData);
    dispatch({
      type: ADD_REQUEST,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const addReply = (id, message) => async dispatch => {
  try {
    const { data } = await axios.post(`/api/workRequest/chat/${id}`, message);
    dispatch({
      type: ADD_REPLY,
      payload: data
    });
    socket.emit("reply", {
      message: message,
      rid: id
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const sentOffer = (id, offer) => async dispatch => {
  try {
    const { data } = await axios.post(`/api/workRequest/offer/${id}`, offer);
    dispatch({
      type: SENT_OFFER,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const getOffers = () => async dispatch => {
  dispatch(offerLoading());
  try {
    const { data } = await axios.get(`/api/workRequest/offer`);
    dispatch({
      type: GET_OFFERS,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const getOffer = id => async dispatch => {
  dispatch(offerLoading());
  try {
    const { data } = await axios.get(`/api/workRequest/offer/${id}`);
    dispatch({
      type: GET_OFFER,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const getOrders = () => async dispatch => {
  try {
    const { data } = await axios.get("/api/workRequest/orders");
    dispatch({
      type: GET_ORDERS,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const getRequests = () => async dispatch => {
  dispatch(setRequestLoading());
  try {
    const { data } = await axios.get(`/api/workRequest`);
    dispatch({
      type: GET_REQUESTS,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const getRequest = payload => async dispatch => {
  dispatch(setRequestLoading());
  try {
    const { data } = await axios.get(`/api/workRequest/request/${payload}`);
    dispatch({
      type: GET_REQUEST,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const socketUpdate = payload => async dispatch => {
  try {
    const { data } = await axios.get(`/api/workRequest/request/${payload}`);
    dispatch({
      type: GET_REQUEST,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const getDashboardCount = () => async dispatch => {
  try {
    const { data } = await axios.get(`/api/workRequest/getDashboardCount`);
    dispatch({
      type: GET_COUNT,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

export const setRequestLoading = () => {
  return {
    type: REQUEST_LOADING
  };
};
