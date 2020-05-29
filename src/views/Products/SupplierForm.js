import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom'

import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import AddAlert from "@material-ui/icons/AddAlert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { postSupplier } from "common/Request/Requests.js";

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function SupplierForm() {
  const [supplier, setSupplier] = React.useState('');
  const [alert, setAlert] = React.useState(null);
  const [tr, setTR] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const [supplierInputState, setSupplierInputState] = React.useState('');

  const classes = useStyles();
  const alertClasses = useAlertStyles();

  useEffect(() => {
    if(supplier === "") {
      setSupplierInputState("error");
    } 
    else {
      setSupplierInputState("success");
    }
  }, [supplier]);

  const submitButton = () => {
    if(supplierInputState !== "error")
    {
      postSupplier(supplier).then((response) => {
        successAlert()
      });
    }
    else {
      if (!tr) {
        setTR(true);
        setTimeout(function() {
          setTR(false);
        }, 3000);
      }
    }
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Supplier Added!"
        onConfirm={() => {
          setRedirect(<Redirect to='/admin/supplierTable' />);
        }}
        onCancel={() => {
          setSupplier('');
          hideAlert();
        }}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Done"
        cancelBtnText="Add another"
        showCancel
      >
        Supplier added!
      </SweetAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
        {alert}
        {redirect}
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
                success={supplierInputState === "success"}
                error={supplierInputState === "error"}
                labelText='Supplier Name *'
                id='description'
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: 'text',
                  onChange: event => {
                    setSupplier(event.target.value)
                  },
                  value: supplier
                }}
              />
              <Button 
                color="rose"
                onClick={submitButton}>
                  Submit
                </Button>
            </form>
          </CardBody>
        </Card>
        <Snackbar
          place="tr"
          color="danger"
          icon={AddAlert}
          message="Missing mandatory fields."
          open={tr}
          closeNotification={() => setTR(false)}
          close
        />
      </GridItem>
    </GridContainer>
  );
}