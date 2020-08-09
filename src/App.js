import React, { useState, Suspense } from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

import PrivateRoute from "routes.js"

import html2canvas from 'html2canvas';

import { AuthContext } from "./context/auth";
import './i18n';

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";

function App() {
    const existingToken = JSON.parse(localStorage.getItem("auth") || '{}');
    const [auth, setAuth] = useState(existingToken);
    const hist = createBrowserHistory();

    const setAuthData = (data) => {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth(data);
    }

    window.html2canvas = html2canvas;

    return (
        <AuthContext.Provider value={{ auth, setAuth: setAuthData }}>
            <Suspense fallback={null}>
                <Router history={hist}>
                    <Switch>
                        <PrivateRoute path="/admin" component={AdminLayout} />
                        <Route path="/auth" component={AuthLayout} />
                        <Route path="/error" component={AuthLayout} />
                        <Route exact path="" render={() => <Redirect to="/admin" />} />
                    </Switch>
                </Router>
            </Suspense>
        </AuthContext.Provider>
    );
}

export default App;