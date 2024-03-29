import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import styles from "assets/jss/material-dashboard-pro-react/views/errorPageStyles.js";

const useStyles = makeStyles(styles);

export default function NotFoundPage() {
  const classes = useStyles();
  return (
    <div className={classes.contentCenter}>
      <GridContainer>
        <GridItem md={12}>
          <h1 className={classes.title}>401</h1>
          <h2 className={classes.subTitle}>Unauthorized</h2>
          <h4 className={classes.description}>
            Please sign in.
          </h4>
        </GridItem>
      </GridContainer>
    </div>
  );
}
