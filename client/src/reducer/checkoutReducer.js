import {
  CHECKOUT_BEGIN,
  CHECKOUT_SUCCESS,
  CHECKOUT_CANCEL,
  SHOW_PAGE_LOADING
} from "../actions/types";

const initialState = {
  url: null,
  checkout_status: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CHECKOUT_BEGIN:
      return {
        ...state,
        url: action.payload
      };

    case CHECKOUT_SUCCESS:
      return {
        ...state,
        url: null,
        checkout_status: action.payload
      };

    case CHECKOUT_CANCEL:
      return {
        ...state,
        url: null,
        checkout_status: action.payload
      };

    case SHOW_PAGE_LOADING:
      return {
        ...state,
        url: null
      };
    default:
      return state;
  }
}
