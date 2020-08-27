import {
  SHOW_PAGE_LOADING,
  HIDE_PAGE_LOADING,
  SIGNUP_LOADING,
  LOGIN_LOADING,
  RESET_LOADING,
  AUTH_ERROR,
  REQUEST_LOADING,
  ADD_REQUEST,
  GET_ERRORS,
  GET_REQUEST,
  GET_REQUESTS,
  PROFILE_LOADING,
  GET_PROFILE,
  GET_OFFER,
  GET_OFFERS,
  OFFER_LOADING
} from "../actions/types";

const initialState = {
  page: false,
  login: false,
  signup: false,
  reset: false,
  request: false,
  profile: false,
  offer: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_PAGE_LOADING:
      return { ...state, page: true };

    case HIDE_PAGE_LOADING:
      return {
        login: false,
        page: false,
        signup: false,
        reset: false,
        request: false,
        profile: false,
        offer: false
      };

    case PROFILE_LOADING:
      return { ...state, profile: true };

    case SIGNUP_LOADING:
      return { ...state, signup: true };

    case LOGIN_LOADING:
      return { ...state, login: true };

    case RESET_LOADING:
      return { ...state, reset: true };

    case REQUEST_LOADING:
      return {
        ...state,
        request: true
      };

    case OFFER_LOADING:
      return {
        ...state,
        offer: true
      };

    case GET_OFFER:
    case GET_OFFERS:
      return {
        ...state,
        offer: false
      };

    case GET_ERRORS:
    case ADD_REQUEST:
    case GET_REQUEST:
    case GET_REQUESTS:
      return {
        ...state,
        request: false
      };

    case GET_PROFILE:
      return {
        ...state,
        profile: false
      };

    case AUTH_ERROR:
      return {
        ...state,
        login: false,
        signup: false,
        reset: false,
        request: false,
        profile: false,
        offer: false
      };

    default:
      return state;
  }
}
