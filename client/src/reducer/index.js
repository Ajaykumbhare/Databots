import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import requestReducer from "./requestReducer";
import loadingReducer from "./loadingReducer";
import offersReducer from "./offersReducer";
import checkoutReducer from "./checkoutReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  request: requestReducer,
  loading: loadingReducer,
  profile: profileReducer,
  offers: offersReducer,
  checkOut: checkoutReducer
});
