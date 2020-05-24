import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";

// core components
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);

export default function SupplierForm() {
    const classes = useStyles();

    return (
        <GridItem xs={12} sm={12} md={6}>
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <MailOutline />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>Add Supplier</h4>
          </CardHeader>
          <CardBody>
            <form>
              <CustomInput
                labelText="Supplier Name"
                id="description"
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "text"
                }}
              />
              <Button color="rose">Submit</Button>
            </form>
          </CardBody>
        </Card>
      </GridItem>
    );
}