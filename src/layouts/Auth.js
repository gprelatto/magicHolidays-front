import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import AuthNavbar from "components/Navbars/AuthNavbar.js";
import Footer from "components/Footer/Footer.js";

import LoginPage from "views/Pages/LoginPage.js"
import ForbiddenPage from "views/Pages/ForbiddenPage.js"

import { routes } from "routes.js";

import styles from "assets/jss/material-dashboard-pro-react/layouts/authStyle.js";

import login from "assets/img/login-2.jpg";
import lock from "assets/img/lock.jpeg";
import error from "assets/img/clint-mckoy.jpg";

const useStyles = makeStyles(styles);

export default function Pages(props) {
  const { ...rest } = props;
  // ref for the wrapper div
  const wrapper = React.createRef();
  // styles
  const classes = useStyles();

  React.useEffect(() => {
    document.body.style.overflow = "unset";
    return function cleanup() { };
  });

  const getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/auth") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBgImage = () => {
    if (window.location.pathname.indexOf("/auth/login-page") !== -1) {
      return login;
    } else if (window.location.pathname.indexOf("/auth/forbidden") !== -1) {
      return lock;
    }
  };

  const getActiveRoute = routes => {
    let activeRoute = "Magic Holiday Travel Agency";
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
      }
    }
    return activeRoute;
  };

  return (
    <div>
      <AuthNavbar brandText="" {...rest} />
      <div className={classes.wrapper} ref={wrapper}>
        <div
          className={classes.fullPage}
          style={
            {
              'backgroundImage': "url(" + getBgImage() + ")",
              'backgroundPosition': 'center center',
              'backgroundRepeat': 'no-repeat',
              'backgroundAttachment': 'fixed',
              'backgroundSize': 'cover'
            }
          }
        >
          <Route path="/auth/login-page/" component={LoginPage} />
          <Route path="/auth/forbidden/" component={ForbiddenPage} />
          {/* <Redirect exact from="/auth" to="/auth/login-page/" /> */}
          <Footer white />
        </div>
      </div>
    </div>
  );
}
