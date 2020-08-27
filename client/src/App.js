import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { Provider } from "react-redux";

import setAuthToken from "./utils/setAuthToken";
import store from "./store";
import { authUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import PrivateRoute from "./components/common/PrivateRoute";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import Reset from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import Dashboard from "./components/dashboard/Dashboard";
import Home from "./components/layout/Landing.js";

import AddRequest from "./components/request/AddRequest";
import CheckRequest from "./components/request/CheckRequest";
import RequestDetail from "./components/request/RequestDetail";

import YellowPages from "./components/Demo/YellowPages";
import Wallpaper from "./components/Demo/Wallpaper";
import ActivateProfile from "./components/auth/ActivateProfile";
import "./index.css";
import ProfileManage from "./components/auth/ProfileManage";
import Offer from "./components/request/Offer";
import OfferDetail from "./components/request/OfferDetail";
import PaymentStatus from "./components/checkout/PaymentStatus";

import AddAdmin from "./components/admin/AddAdmin";
import ViewAdmins from "./components/admin/ViewAdmin";

import Footer from "./components/layout/Footer.js";

// check for token
if (localStorage.jwtToken) {
  // set Auth token header with
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(authUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile);
    // Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/reset/:token" component={Reset} />
            <Route exact path="/ForgotPassword" component={ForgotPassword} />
            <Route exact path="/Try/YellowPages" component={YellowPages} />
            <Route exact path="/Try/Wallpaper" component={Wallpaper} />
            <Switch>
              <PrivateRoute
                exact
                path="/profileToken/:token"
                component={ActivateProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/ProfileManage"
                component={ProfileManage}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/addRequest" component={AddRequest} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/checkOffers" component={Offer} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/checkOffers/:id"
                component={OfferDetail}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/checkRequest"
                component={CheckRequest}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/checkRequest/:id"
                component={RequestDetail}
              />
            </Switch>
            <Switch>
              <PrivateRoute path="/success" component={PaymentStatus} />
            </Switch>
            <Switch>
              <PrivateRoute path="/AddAdmin" component={AddAdmin} />
            </Switch>
            <Switch>
              }
              <PrivateRoute path="/ViewAdmins" component={ViewAdmins} />
            </Switch>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
