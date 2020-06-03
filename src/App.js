import React, { useState, useEffect } from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

import PrivateRoute from "routes.js"

import { AuthContext } from "./context/auth";

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";

function App() {
    const existingToken = JSON.parse(localStorage.getItem("auth") || '{}');
    const [auth, setAuth] = useState(existingToken);
    const hist = createBrowserHistory();

    const setAuthData = (data) => {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth(data);
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth: setAuthData }}>
            <Router history={hist}>
                <Switch>
                    <PrivateRoute path="/admin" component={AdminLayout} />
                    <Route path="/auth" component={AuthLayout} />
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;