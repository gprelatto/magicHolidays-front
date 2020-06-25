import React, { useState, useEffect } from "react";
import { Redirect } from 'react-router-dom'

import axios from 'axios';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
import Face from "@material-ui/icons/Face";
import Email from "@material-ui/icons/Email";
import AddAlert from "@material-ui/icons/AddAlert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import styles from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.js";

import { useAuth } from "context/auth";
import { useTranslation } from 'react-i18next'

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const { t, i18n } = useTranslation();

  const [isError, setIsError] = useState(false);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = React.useState(false);
  const [bar, setBar] = React.useState(null);
  const [tr, setTR] = React.useState(false);
  const [message, setMessage] = React.useState('');

  const baseUrl = 'https://mhtravelagency-api.herokuapp.com/';

  const { setAuth } = useAuth();

  const classes = useStyles();

  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  function postLogin() {
    progressBar();
    const bodyForm = new FormData();
    bodyForm.append('mail', mail);
    bodyForm.append('password', password);

    axios({
      method: 'post',
      url: baseUrl + 'login/',
      data: bodyForm,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      if (response.data.code === 200) {
        let responseJson = response.data.data;
        removeProgressBar();
        setAuth(response.data.data || {});
        changeLanguage(responseJson.lang ?? 'es');
        props.history.push('/admin');
      } else {
        removeProgressBar();
        setMessage(response.data.message);
        setIsError(true);
      }
    }).catch(e => {
      console.log('e',e)
      setIsError(true);
      setMessage(e);
      removeProgressBar();
    });
  }

  useEffect(() => {
    if (!tr && isError) {
      setTR(true);
      setTimeout(function() {
        setTR(false);
        setIsError(false);
      }, 3000);
    }
  }, [isError]);

  const progressBar = () => {
    setBar(
      <CustomLinearProgress
        variant="indeterminate"
        color="primary"
        value={30}
      />
    );
  };

  const removeProgressBar = () => {
    setBar(null);
  };
  
  const changeLanguage = (lang) => {
      i18n.changeLanguage(lang)
  }
  
  return (
    <div className={classes.container}>
      {redirect}
      {bar}
      <GridContainer justify="center">
        <GridItem xs={12} sm={6} md={4}>
          <form>
            <Card login className={classes[cardAnimaton]}>
              <CardHeader
                className={`${classes.cardHeader} ${classes.textCenter}`}
                color="primary"
              >
                <h4 className={classes.cardTitle}>Log in</h4>
              </CardHeader>
              <CardBody>
                <CustomInput
                  labelText="Email..."
                  id="email"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Email className={classes.inputAdornmentIcon} />
                      </InputAdornment>
                    ),
                    onChange: e => { setMail(e.target.value) }
                  }}
                />
                <CustomInput
                  labelText="Password"
                  id="password"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon className={classes.inputAdornmentIcon}>
                          lock_outline
                        </Icon>
                      </InputAdornment>
                    ),
                    type: "password",
                    autoComplete: "off",
                    onChange: e => { setPassword(e.target.value) }
                  }}
                />
              </CardBody>
              <CardFooter className={classes.justifyContentCenter}>
                <Button color="rose" simple size="lg" block onClick={() => postLogin()}>
                  Let{"'"}s Go
                </Button>
              </CardFooter>
            </Card>
          </form>
          <Snackbar
            place="tr"
            color="danger"
            icon={AddAlert}
            message={message}
            open={tr}
            closeNotification={() => setTR(false)}
            close
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
