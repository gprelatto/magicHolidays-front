import React, { useEffect } from "react";
import { useAuth } from "context/auth";

function LogOut(props) {
    const { setAuth } = useAuth();

    useEffect(() => {
        setAuth({});
        props.history.push('/auth/login-page');
    }, []);

    return (
        <></>
    );
}

export default LogOut;