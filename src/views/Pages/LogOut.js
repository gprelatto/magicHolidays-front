import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom'
import { useAuth } from "context/auth";

function LogOut() {
    const [enableRedirect, setEnableRedirect] = React.useState(false)
    const { setAuthToken } = useAuth();

    useEffect(() => {
        setAuthToken();
        setEnableRedirect(true);
    }, []);

    return (
        enableRedirect ?
        <>
         <Redirect to="/auth/login-form" /> 
        </>
        : <></>
    );
}

export default LogOut;