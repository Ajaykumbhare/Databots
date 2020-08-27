import {
  ADD_REQUEST,
  GET_REQUESTS,
  GET_REQUEST,
  ADD_REPLY,
  SENT_OFFER,
  GET_COUNT
} from "../actions/types";

const initialState = {
  request: null,
  requests: null,
  count: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_REQUESTS:
      return {
        ...state,
        requests: action.payload
      };

    case GET_REQUEST:
    case ADD_REQUEST:
    case SENT_OFFER:
    case ADD_REPLY:
      return {
        ...state,
        request: action.payload
      };

    case GET_COUNT:
      return {
        ...state,
        count: action.payload
      };
    default:
      return state;
  }
}
