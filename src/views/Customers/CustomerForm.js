import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom'

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

import GridContainer from "components/Grid/GridContainer.js";
import FormLabel from "@material-ui/core/FormLabel";


import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, postCustomer } from 'common/Request/Requests.js'
import sourceContactList from 'common/Variables/ContactSourceList.js'
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function CustomerForm(props) {
    const { t, i18n } = useTranslation();

    const [countries, setCountries] = React.useState([]);

    const [selectedCountryId, setSelectedCountryId] = React.useState(0);
    const [fullName, setFullName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [selectedSourceContact, setSelectedSourceContact] = React.useState(sourceContactList[0]);

    const [registerFullName, setRegisterFullName] = React.useState('');
    const [registerCountryId, setRegisterCountryId] = React.useState('');
    const [registerPhone, setRegisterPhone] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');

    const [bar, setBar] = React.useState(null);
    const [tr, setTR] = React.useState(false);
    const [alert, setAlert] = React.useState(null);
    const [redirect, setRedirect] = React.useState(false);

    const classes = useStyles();
    const alertClasses = useAlertStyles();

    useEffect(() => {
        progressBar();
        getRequest('countries').then((response) => {
            let responseData = response.data.data;
            let desc = t('common.dropdown.pleaseSelectCountry')
            responseData.unshift(
                {
                    id: 0,
                    description: desc,
                    lang: ''
                }
            )

            setCountries(responseData);
            removeProgressBar();
        }).catch(e => {
            props.history.push('/auth/forbidden')
        });
    }, [])

    useEffect(() => {
        selectedCountryId === 0 ? setRegisterCountryId("error") : setRegisterCountryId("success");
    }, [selectedCountryId]);

    useEffect(() => {
        fullName === "" ? setRegisterFullName("error") : setRegisterFullName("success");
    }, [fullName]);

    useEffect(() => {
        if (email === "" || !verifyEmail(email)) {
            setRegisterEmail("error");
        }
        else {
            setRegisterEmail("success");
        }

    }, [email]);

    useEffect(() => {
        phone === "" ? setRegisterPhone("error") : setRegisterPhone("success");
    }, [phone]);

    const submitClick = () => {
        if (registerFullName !== "error"
            && registerCountryId !== "error"
            && registerPhone !== "error"
            && registerEmail !== "error") {
            progressBar();

            let sourceContact = '';

            if(selectedSourceContact !== 'Seleccione fuente de contacto') {
                sourceContact = selectedSourceContact;
            }

            let customer = {
                fullname: fullName,
                mail: email,
                phone: phone,
                country: selectedCountryId,
                created_by: 0,
                contact_source: sourceContact
            }

            postCustomer(customer).then((response) => {
                removeProgressBar();
                successAlert()
            }).catch(e => {
                props.history.push('/auth/forbidden')
            });
        }
        else {
            if (!tr) {
                setTR(true);
                setTimeout(function () {
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
                style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
                title={t('customers.add.alert.added')}
                onConfirm={() => {
                    setRedirect(<Redirect to='/admin/customerTable' />);
                }}
                onCancel={() => {
                    setFullName('');
                    setSelectedCountryId(0);
                    setPhone('');
                    setEmail('')
                    hideAlert();
                }}
                confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
                cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
                confirmBtnText={t('common.alert.done')}
                cancelBtnText={t('common.alert.addAnother')}
                showCancel
            >
                {t('customers.add.alert.added')}
            </SweetAlert>
        );
    };

    const hideAlert = () => {
        setAlert(null);
    };

    const verifyEmail = value => {
        var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (emailRex.test(value)) {
            return true;
        }
        return false;
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
                    <h4 className={classes.cardIconTitle}>{t('customers.add.title')}</h4>
                </CardHeader>
                <CardBody>
                    <form>
                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t('customers.add.fullName')}
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="fullname"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    success={registerFullName === "success"}
                                    error={registerFullName === "error"}
                                    inputProps={{
                                        type: "text",
                                        onChange: event => {
                                            setFullName(event.target.value)
                                        },
                                        value: fullName
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t('customers.add.mail')}
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="email"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    success={registerEmail === "success"}
                                    error={registerEmail === "error"}
                                    inputProps={{
                                        type: "email",
                                        onChange: event => {
                                            setEmail(event.target.value)
                                        },
                                        value: email
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t('customers.add.phone')}
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="phone"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    success={registerPhone === "success"}
                                    error={registerPhone === "error"}
                                    inputProps={{
                                        type: "text",
                                        onChange: event => {
                                            setPhone(event.target.value)
                                        },
                                        value: phone
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t('common.country')}
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <Select
                                    success={(registerCountryId === "success").toString()}
                                    error={registerCountryId === "error"}
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    value={selectedCountryId}
                                    onChange={e => {
                                        let id = e.target.value;
                                        setSelectedCountryId(id);
                                    }}
                                    inputProps={{
                                        name: "countrySelect",
                                        id: "country-select"
                                    }}
                                >
                                    {countries.map((c, i) => {
                                        return (
                                            <MenuItem
                                                key={i}
                                                classes={{
                                                    root: classes.selectMenuItem,
                                                    selected: classes.selectMenuItemSelected
                                                }}
                                                value={c.id}
                                            >
                                                {c.description}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    {t('customer.add.sourceContactSelectLabel')}
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <Select
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    value={selectedSourceContact}
                                    onChange={e => {
                                        setSelectedSourceContact(e.target.value);
                                    }}
                                    inputProps={{
                                        name: "countrySelect",
                                        id: "country-select"
                                    }}
                                >
                                    {sourceContactList.map((c, i) => {
                                        return (
                                            <MenuItem
                                                key={i}
                                                classes={{
                                                    root: classes.selectMenuItem,
                                                    selected: classes.selectMenuItemSelected
                                                }}
                                                value={c}
                                            >
                                                {c}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={10} sm={10} md={10} lg={11}>
                                <FormLabel className={classes.labelHorizontal}>
                                    <small>*</small> {t('common.requiredFields')}
                                </FormLabel>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={10} sm={10} md={10} lg={11}>
                                <FormLabel className={classes.labelHorizontal}>
                                    <Button
                                        color="rose"
                                        onClick={submitClick}
                                    >
                                        Enviar
                                </Button>
                                </FormLabel>
                            </GridItem>
                        </GridContainer>
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
            </Card>
        </GridItem>
    );
}