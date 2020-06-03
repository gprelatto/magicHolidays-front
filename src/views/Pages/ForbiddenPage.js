import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/errorPageStyles.js";

const useStyles = makeStyles(styles);

export default function ForbiddenPage() {
  const classes = useStyles();
  return (
    <div className={classes.contentCenter}>
      <GridContainer>
        <GridItem md={12}>
          <h1 className={classes.title}>403</h1>
          <h2 className={classes.subTitle}>Forbidden</h2>
          <h4 className={classes.description}>
            You do not have permissions to access this page.
          </h4>
        </GridItem>
      </GridContainer>
    </div>
  );
}
