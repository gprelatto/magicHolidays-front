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
import FormLabel from "@material-ui/core/FormLabel";
import Snackbar from "components/Snackbar/Snackbar.js";
import Datetime from "react-datetime";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { postNewNotification, redirectToUnforbidden } from "common/Request/Requests.js";
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function NewAlertForm(props) {
    const { t, i18n } = useTranslation();

    const [message, setMessage] = React.useState('');
    const [from, setFrom] = React.useState('');
    const [to, setTo] = React.useState('');

    const [alert, setAlert] = React.useState(null);
    const [tr, setTR] = React.useState(false);
    const [alert2, setAlert2] = React.useState(null);
    const [tr2, setTR2] = React.useState(false);
    const [redirect, setRedirect] = React.useState(false);

    const [messageState, setMessageState] = React.useState('');
    const [fromState, setFromState] = React.useState('');
    const [toState, setToState] = React.useState('');

    const classes = useStyles();
    const alertClasses = useAlertStyles();

    useEffect(() => {
        if (message === "") {
            setMessageState("error");
        }
        else {
            setMessageState("success");
        }
    }, [message]);

    useEffect(() => {
        if (from === "") {
            setFromState("error");
        }
        else {
            setFromState("success");
        }
    }, [from]);

    useEffect(() => {
        if (to === "") {
            setToState("error");
        }
        else {
            setToState("success");
        }
    }, [to]);

    const submitButton = () => {
        if (messageState !== "error"
            && toState !== "error"
            && fromState !== "error") {

            let toDate = new Date(to);
            let fromDate = new Date(from);

            if (toDate - fromDate < 0) {
                if (!tr2) {
                    setTR2(true);
                    setTimeout(function () {
                        setTR2(false);
                    }, 3000);
                }
            }
            else {
                let data = {
                    message: message,
                    date_to: to,
                    date_from: from
                };

                postNewNotification(data).then((response) => {
                    if (response.data.code === 403) {
                        redirectToUnforbidden(props);
                    }
                    successAlert()
                }).catch(e => {
                    props.history.push('/auth/forbidden')
                });
            }
        }
        else {
            if (!tr) {
                setTR(true);
                setTimeout(function () {
                    setTR(false);
                }, 3000);
            }
        }
    }

    const successAlert = () => {
        setAlert(
            <SweetAlert
                success
                style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
                title='Alerta Generada con Exito.'
                onConfirm={() => {
                    setRedirect(<Redirect to='/admin/customAlerts' />);
                }}
                onCancel={() => {
                    setTo('');
                    setFrom('');
                    setMessage('');
                    hideAlert();
                }}
                confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
                cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
                confirmBtnText={t('common.alert.done')}
                cancelBtnText={t('common.alert.addAnother')}
                showCancel
            >
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
                {alert2}
                <Card>
                    <CardHeader color="rose" icon>
                        <CardIcon color="rose">
                            <MailOutline />
                        </CardIcon>
                        <h4 className={classes.cardIconTitle}>Nueva Alerta</h4>
                    </CardHeader>
                    <CardBody>
                        <form>
                            <GridContainer>
                                <GridItem xs={4} sm={4} md={4} lg={4}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Descripcion
                                </FormLabel>
                                </GridItem>
                                <GridItem xs={4} sm={4} md={4} lg={8}>
                                    <CustomInput
                                        success={messageState === "success"}
                                        error={messageState === "error"}
                                        id='description'
                                        formControlProps={{
                                            fullWidth: true
                                        }}
                                        inputProps={{
                                            type: 'textarea',
                                            rows: 5,
                                            cols: 5,
                                            onChange: event => {
                                                setMessage(event.target.value)
                                            },
                                            value: message
                                        }}
                                    />
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={4} sm={4} md={4} lg={4}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Fecha desde
                                </FormLabel>
                                </GridItem>
                                <GridItem xs={4} sm={4} md={4} lg={8}>
                                    <Datetime
                                        dateFormat="YYYY-MM-DD"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        inputProps={{
                                            placeholder: "Seleccione fecha desde",
                                        }}
                                        onChange={(event) => {
                                            setFrom(event._d);
                                            setFromState("success");
                                        }}
                                        className={classes.select}
                                        value={from}
                                    />
                                </GridItem>
                            </GridContainer>

                            <GridContainer>
                                <GridItem xs={4} sm={4} md={4} lg={4}>
                                    <FormLabel className={classes.labelHorizontal}>
                                        Fecha hasta
                                </FormLabel>
                                </GridItem>
                                <GridItem xs={4} sm={4} md={4} lg={8}>
                                    <Datetime
                                        dateFormat="YYYY-MM-DD"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        inputProps={{
                                            placeholder: "Seleccione fecha hasta",
                                        }}
                                        onChange={(event) => {
                                            setTo(event._d);
                                            setToState("success");
                                        }}
                                        className={classes.select}
                                        value={to}
                                    />
                                </GridItem>
                            </GridContainer>


                            <Button
                                color="rose"
                                onClick={submitButton}>
                                {t('common.button.submit')}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
                <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message={t('common.snackbar.missingAlert')}
                    open={tr}
                    closeNotification={() => setTR(false)}
                    close
                />
                <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message='Corrobore que las fechas ingresadas sean correctas'
                    open={tr2}
                    closeNotification={() => setTR2(false)}
                    close
                />
            </GridItem>
        </GridContainer>
    );
}