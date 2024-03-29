import React from "react";
import cx from "classnames";
import { Switch, Route, Redirect } from "react-router-dom";

import { useAuth } from "context/auth";

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Footer from "components/Footer/Footer.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import Dashboard from "views/Dashboard/Dashboard.js";

import PrivateRoute, { routes } from "routes.js";

import styles from "assets/jss/material-dashboard-pro-react/layouts/adminStyle.js";

var ps;

const useStyles = makeStyles(styles);

export default function AdminLayout(props) {
  const { ...rest } = props;
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
  const [image, setImage] = React.useState(require("assets/img/sidebar-2.jpg"));
  const [color, setColor] = React.useState("blue");
  const [bgColor, setBgColor] = React.useState("black");
  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [logo, setLogo] = React.useState(require("assets/img/Magic_fondo_transparente.png"));
  const [auth, setAuth] = React.useState(useAuth());
  // styles
  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    " " +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf("Win") > -1
    });
  // ref for main panel div
  const mainPanel = React.createRef();
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  });

  // functions for changeing the states from components
  const handleImageClick = image => {
    setImage(image);
  };

  const handleColorClick = color => {
    setColor(color);
  };

  const handleBgColorClick = bgColor => {
    switch (bgColor) {
      case "white":
        setLogo(require("assets/img/logo.svg"));
        break;
      default:
        setLogo(require("assets/img/logo-white.svg"));
        break;
    }
    setBgColor(bgColor);
  };
  
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getRoute = () => {
    return window.location.pathname !== "/admin/full-screen-maps";
  };

  const getActiveRoute = routes => {
    let activeRoute = "Default Brand Text";
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

  const getRoutes = routes => {
    let userType = auth.auth.user_type;

    return routes.map((prop, key) => {
      if (prop.collapse && (userType === 1 || prop.permissions.length > 1)) 
      {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin" && (userType === 1 || prop.permissions.length > 1)) 
      {
        return (
          <PrivateRoute
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

  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };

  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };


  const getFileteredRoutes = () => {
    let filteredRoutes = [];
    let userType = auth.auth.user_type;

    routes.forEach((r,i) => {
      if(!r.collapse) {
        if(userType === 1 || r.permissions.length > 1) {
          filteredRoutes.push(r);
        }
      }
      else {
        if(userType === 1 || r.permissions.length > 1) {
          let route = {
            collapse: r.collapse,
            name: r.name,
            rtlName: r.rtlName,
            icon: r.icon,
            state: r.state,
            permissions: r.permissions,
            views: [],
            render : r.render
          };

          r.views.forEach((v) => {
            if(userType === 1 || r.permissions.length > 1) {
              route.views.push(v);
            }
          });

          filteredRoutes.push(route);
        }
      }
    });

    return filteredRoutes;
  }

  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={getFileteredRoutes()}
        logoText={"Magic Holiday"}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(routes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              {getRoutes(routes)}
              <Redirect from="/admin" to="/admin/dashboard"/>
            </div>
          </div>
        ) : (
          <div className={classes.map}>
            {getRoutes(routes)}
            <Redirect from="/admin" to="/admin/dashboard"/>
          </div>
        )}
        {getRoute() ? <Footer fluid /> : null}
      </div>
    </div>
  );
}
