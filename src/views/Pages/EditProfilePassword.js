import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom'

import axios from 'axios';

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import AddAlert from "@material-ui/icons/AddAlert";

// core components
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "components/Snackbar/Snackbar.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import { useTranslation } from 'react-i18next';

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function EditProfilePassword(props) {
    const { t, i18n } = useTranslation();

    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');

    const [registerPassword, setRegisterPassword] = React.useState('');
    const [registerPasswordConfirmation, setRegisterPasswordConfirmation] = React.useState('');
    
    const [bar, setBar] = React.useState(null);
    const [tr, setTR] = React.useState(false);
    const [pwTr, setPwTr] = React.useState(false);
    const [alert, setAlert] = React.useState(null);
    const [redirect, setRedirect] = React.useState(false);

    const classes = useStyles();
    const alertClasses = useAlertStyles();

    useEffect(() => {
    }, [])

    useEffect(() => {
        password === "" ? setRegisterPassword("error") : setRegisterPassword("success");
    }, [password]);

    useEffect(() => {
        passwordConfirmation === "" ? setRegisterPasswordConfirmation("error") : setRegisterPasswordConfirmation("success");
    }, [passwordConfirmation]);

    const submitClick = () => {
        if (registerPassword !== "error"
            && registerPasswordConfirmation !== "error") {

            if (password === passwordConfirmation) {
                progressBar();

                const bodyForm = new FormData();
                bodyForm.append('password', password);

                let auth = JSON.parse(localStorage.getItem('auth'));
                
                axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL + 'updatePassword/',
                    data: bodyForm,
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'mail': auth.mail,
                        'token': auth.token
                    }
                }).then((response) => {
                    removeProgressBar();
                    successAlert()
                }).catch(e => {
                    props.history.push('/auth/forbidden')
                });
            }
            else {
                if (!pwTr) {
                    setPwTr(true);
                    setTimeout(function() {
                      setTR(false);
                    }, 3000);
                }    
            }
        }
        else {
            if (!tr) {
                setTR(true);
                setTimeout(function() {
                  setTR(false);
                }, 3000);
            }
        }
    };

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

      const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="User Added!"
            onConfirm={() => {
              setRedirect(<Redirect to='/admin/logout' />);
            }}
            onCancel={() => {
                setRedirect(<Redirect to='/admin/logout' />);
            }}
            confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
            cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
            confirmBtnText="Done"
            cancelBtnText="Cancel"
            showCancel
          >
            Customer added!
          </SweetAlert>
        );
      };

      const hideAlert = () => {
        setAlert(null);
      };    

    return (
        <GridItem xs={12} sm={12} md={6}>
            {bar}
            {alert}
            {redirect}
            <Card>
                <CardHeader color="rose" icon>
                    <CardIcon color="rose">
                    <MailOutline />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>{t('profile.edit.password.title')}</h4>
                </CardHeader>
                <CardBody>
                    <form>
                        <CustomInput
                            labelText={t('profile.edit.password.pwLabel')}
                            id="pw"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "password",
                                autoComplete: "new-password",
                                onChange: event => {
                                    setPassword(event.target.value)
                                },
                                value: password
                            }}
                        />
                        <CustomInput
                            labelText={t('profile.edit.password.repeatPwLabel')}
                            id="pw2"
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                type: "password",
                                autoComplete: "new-password",
                                onChange: event => {
                                    setPasswordConfirmation(event.target.value)
                                },
                                value: passwordConfirmation
                            }}
                        />
                        <div className={classes.formCategory}>
                        <small>*</small> {t('common.requiredFields')}
                        </div>
                        <Button 
                            color="rose"
                            onClick={submitClick}
                        >
                            Submit
                        </Button>
                    </form>
                </CardBody>
                <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message={t('common.snackbar.missingAlertWithMail')}
                    open={tr}
                    closeNotification={() => setTR(false)}
                    close
                />
                <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message={t('common.snackbar.passwords')}
                    open={pwTr}
                    closeNotification={() => setPwTr(false)}
                    close
                />
            </Card>
      </GridItem>
    );
}