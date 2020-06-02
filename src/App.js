import React, { useState, useEffect } from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import PrivateRoute from "routes.js"

import { AuthContext } from "./context/auth";

import "assets/scss/material-dashboard-pro-react.scss?v=1.8.0";

function App() {
    const [authToken, setAuthToken] = useState();
    
    useEffect(() => {
        const existingToken = localStorage.getItem("token");
        if (existingToken !== undefined && existingToken !== 'undefined' && existingToken !== null) {
            setAuthToken(existingToken);
        }
    }, []);

    const hist = createBrowserHistory();

    const setToken = (data) => {
        localStorage.setItem("token", JSON.stringify(data));
        setAuthToken(data);
    }

    return (
        <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
            <Router history={hist}>
                <Switch>
                    <Route path="/auth/login-page" component={AuthLayout} />
                    <PrivateRoute path="/admin" component={AdminLayout} />
                    <Route exact path="/" render={() => (
                        <Redirect to="/admin"/>
                    )}/>
                </Switch>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;