import {
  UPDATE_PASSWORD,
  SHOW_PAGE_LOADING,
  HIDE_PAGE_LOADING,
  SIGNUP_LOADING,
  AUTH_ERROR,
  SENT_VERIFICATION,
  AUTH_USER,
  UNAUTH_USER,
  LOGIN_LOADING,
  RESET_LOADING,
  VALIDATE_TOKEN
} from "./types";

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

export const showPageLoading = () => ({ type: SHOW_PAGE_LOADING });
export const hidePageLoading = () => ({ type: HIDE_PAGE_LOADING });
export const showSignupLoading = () => ({ type: SIGNUP_LOADING });
export const showLoginLoading = () => ({ type: LOGIN_LOADING });
export const showResetLoading = () => ({ type: RESET_LOADING });
export const showAuthError = payload => ({ type: AUTH_ERROR, payload });

export const authUser = payload => {
  return {
    type: AUTH_USER,
    payload: payload
  };
};

export const unauthUser = () => ({ type: UNAUTH_USER });

export const sentVerification = payload => ({
  type: SENT_VERIFICATION,
  payload
});

// Register User
export const registerUser = (userData, history) => async dispatch => {
  dispatch(showSignupLoading());
  try {
    const { data } = await axios.post("/api/users/register", userData);
    dispatch(sentVerification(data));
  } catch ({ response }) {
    dispatch(showAuthError(response.data));
  }
};

// Login - Get user token

export const loginUser = userData => async dispatch => {
  dispatch(showLoginLoading());
  try {
    const {
      data: { token }
    } = await axios.post("api/users/login", userData);
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);
    const decoded = jwt_decode(token);
    dispatch(authUser(decoded));
  } catch ({ response }) {
    dispatch(showAuthError(response.data));
  }
};

export const forgotPassword = email => async dispatch => {
  dispatch(showResetLoading());
  try {
    const { data } = await axios.post("api/users/forgotpassword", email);
    dispatch(sentVerification(data));
  } catch ({ response }) {
    dispatch(showAuthError(response.data));
  }
};

export const checkToken = token => async dispatch => {
  try {
    const { data } = await axios.get(`/api/users/reset/${token}`);
    dispatch({
      type: VALIDATE_TOKEN,
      payload: data
    });
  } catch ({ response }) {
    dispatch({ type: AUTH_ERROR, payload: response.data });
  }
};

export const checkProfileToken = token => async dispatch => {
  try {
    const { data } = await axios.get(`/api/users/profile/${token}`);
    dispatch({
      type: VALIDATE_TOKEN,
      payload: data
    });
  } catch ({ response }) {
    dispatch({ type: AUTH_ERROR, payload: response.data });
  }
};

export const changePassword = (token, userData, history) => async dispatch => {
  dispatch(showResetLoading());
  try {
    const { data } = await axios.post(`/api/users/reset/${token}`, userData);
    dispatch({ type: UPDATE_PASSWORD, payload: data });
    history.push("/login");
  } catch ({ response }) {
    dispatch({
      type: AUTH_ERROR,
      payload: response.data
    });
  }
};

// Log user our
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  dispatch(showPageLoading());
  localStorage.removeItem("jwtToken");
  // Remove auth headers for future requests
  setAuthToken(false);
  // set Current user to {} which will set isAuthenticated to false
  dispatch(unauthUser({}));
};
