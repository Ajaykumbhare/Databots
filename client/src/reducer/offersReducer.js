import { GET_OFFER, GET_OFFERS } from "../actions/types";

const initialState = {
  offers: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_OFFER:
    case GET_OFFERS:
      return {
        ...state,
        offers: action.payload
      };

    default:
      return state;
  }
}
