import {
  AUTH_ERROR,
  ADD_REQUEST,
  SHOW_PAGE_LOADING,
  GET_ERRORS,
  ADD_REPLY
} from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
    case AUTH_ERROR:
      return action.payload;

    case ADD_REPLY:
    case ADD_REQUEST:
    case SHOW_PAGE_LOADING:
      return {};

    default:
      return state;
  }
}
