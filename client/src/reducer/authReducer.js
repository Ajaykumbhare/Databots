import {
  RESET,
  TOKEN_STATUS,
  UPDATE_PASSWORD,
  AUTH_USER,
  UNAUTH_USER,
  SENT_VERIFICATION,
  VALIDATE_TOKEN
} from "../actions/types";
import isEmpty from "../validations/is-empty";

const initialState = {
  admin: false,
  isAuthenticated: false,
  sentVerification: false,
  user: {},
  success: "",
  currentProfile: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SENT_VERIFICATION:
      return {
        ...state,
        user: action.payload.user,
        success: action.payload.success,
        sentVerification: true
      };
    case AUTH_USER:
      return {
        ...state,
        admin: action.payload.roleId === 0 ? false : true,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };

    case UNAUTH_USER:
      return {
        state
      };

    case VALIDATE_TOKEN:
    case UPDATE_PASSWORD:
      return {
        ...state,
        status: action.payload
      };

    case RESET:
      return {
        ...state,
        reset: action.payload
      };
    case TOKEN_STATUS:
      return {
        ...state,
        status: action.payload
      };

    default:
      return state;
  }
}
