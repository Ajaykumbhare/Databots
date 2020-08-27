import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER
} from "./types";

export const showProfileLoading = () => ({ type: PROFILE_LOADING });

export const getCurrentProfile = () => async dispatch => {
  dispatch(showProfileLoading());
  try {
    const { data } = await axios.get(`/api/users/current`);
    dispatch({
      type: GET_PROFILE,
      payload: data
    });
  } catch ({ response }) {
    dispatch({ type: GET_ERRORS, payload: response.data });
  }
};

// Add User
export const addUser = (userData, history) => async dispatch => {
  try {
    await axios.post(`/api/users/register`, userData);
    history.push("/dashboard");
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

// update user
export const updateUser = (userData, history) => async dispatch => {
  dispatch(showProfileLoading());
  try {
    await axios.post(`/api/users/update`, userData);
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push("/logout");
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

// Get current Profile

export const currentProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get("/api/users/current")
    .then(res => {
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// GET All Users

export const displayAllUser = () => async dispatch => {
  dispatch(setProfileLoading());
  try {
    const { data } = await axios.get(`/api/users`);
    dispatch({
      type: GET_PROFILE,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_PROFILE,
      payload: {}
    });
  }
};

// Delete Users profiles

export const deleteUser = email => async dispatch => {
  try {
    const { data } = await axios.post(`/api/users/${email}`);
    dispatch({
      type: GET_PROFILE,
      payload: data
    });
  } catch ({ response }) {
    dispatch({
      type: GET_ERRORS,
      payload: response.data
    });
  }
};

// Create Profile

export const createProfile = (profileData, history) => dispatch => {
  axios
    .post(`/api/profile`, profileData)
    .then(res => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Profile Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};

// Clear Profiles
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  };
};

// set logged in user

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
