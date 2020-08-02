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

import Datetime from "react-datetime";

import GridContainer from "components/Grid/GridContainer.js";
import FormLabel from "@material-ui/core/FormLabel";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, postUser } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function UserForm(props) {
    const [countries, setCountries] = React.useState([]);
    const [userTypes, setUserTypes] = React.useState([]);

    const [selectedCountryId, setSelectedCountryId] = React.useState(0);
    const [selectedUserTypeId, setSelectedUserTypeId] = React.useState(0);
    const [name, setName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [birthDate, setBirthDate] = React.useState('');

    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');

    const [registerName, setRegisterName] = React.useState('');
    const [registerCountryId, setRegisterCountryId] = React.useState('');
    const [registerUserTypeId, setRegisterUserTypeId] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
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
        progressBar();
        getRequest('countries').then((response) => {
            let responseData = response.data.data;
            responseData.unshift(
                {
                    id: 0,
                    description: 'Please select a country *',
                    lang: ''
                }
            )

            setCountries(responseData);
        }).then(() => {
            getRequest('userTypes').then((userTypesResponse) => {
                let userTypesData = userTypesResponse.data.data;
                userTypesData.unshift(
                    {
                        id: 0,
                        description: 'Please select a type *'
                    }
                );

                setUserTypes(userTypesData);
                removeProgressBar();
            });
        }).catch(e => {
            props.history.push('/auth/forbidden')
        });
    }, [])

    useEffect(() => {
        selectedCountryId === 0 ? setRegisterCountryId("error") : setRegisterCountryId("success");
    }, [selectedCountryId]);

    useEffect(() => {
        selectedUserTypeId === 0 ? setRegisterUserTypeId("error") : setRegisterUserTypeId("success");
    }, [selectedUserTypeId]);

    useEffect(() => {
        name === "" ? setRegisterName("error") : setRegisterName("success");
    }, [name]);

    useEffect(() => {
        password === "" ? setRegisterPassword("error") : setRegisterPassword("success");
    }, [password]);

    useEffect(() => {
        passwordConfirmation === "" ? setRegisterPasswordConfirmation("error") : setRegisterPasswordConfirmation("success");
    }, [passwordConfirmation]);

    useEffect(() => {
        if (email === "" || !verifyEmail(email)) {
            setRegisterEmail("error");
        }
        else {
            setRegisterEmail("success");
        }
    }, [email]);

    const submitClick = () => {
        if (registerName !== "error"
            && registerCountryId !== "error"
            && registerUserTypeId !== "error"
            && registerEmail !== "error"
            && registerPassword !== "error"
            && registerPasswordConfirmation !== "error") {

            if (password === passwordConfirmation) {
                progressBar();
                let birth = null;

                const bodyForm = new FormData();
                bodyForm.append('name', name);
                bodyForm.append('password', password);
                bodyForm.append('lastname', lastName);
                bodyForm.append('phone', phone);
                bodyForm.append('country', selectedCountryId);
                bodyForm.append('user_type', selectedUserTypeId);
                bodyForm.append('mail', email);

                if (birthDate !== '') {
                    birth = birthDate.getFullYear() + '-' + (birthDate.getMonth() + 1) + '-' + birthDate.getDate() + 'T00:00:00Z'
                    bodyForm.append('birth_date', birth);
                }

                let auth = JSON.parse(localStorage.getItem('auth'));

                axios({
                    method: 'post',
                    url: process.env.REACT_APP_API_URL + 'users/',
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
                    setTimeout(function () {
                        setTR(false);
                    }, 3000);
                }
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
                title="User Added!"
                onConfirm={() => {
                    setRedirect(<Redirect to='/admin/usersTable' />);
                }}
                onCancel={() => {
                    setName('');
                    setLastName('');
                    setSelectedCountryId(0);
                    setPhone('');
                    setEmail('');
                    hideAlert();
                }}
                confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
                cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
                confirmBtnText="Done"
                cancelBtnText="Add another"
                showCancel
            >
                Customer added!
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
                    <h4 className={classes.cardIconTitle}>User</h4>
                </CardHeader>
                <CardBody>
                    <form>
                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Nombre *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <CustomInput
                                    id="name"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    success={registerName === "success"}
                                    error={registerName === "error"}
                                    inputProps={{
                                        type: "text",
                                        autoComplete: "new-password",
                                        onChange: event => {
                                            setName(event.target.value)
                                        },
                                        value: name
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Apellido *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <CustomInput
                                    id="lastname"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "text",
                                        autoComplete: "new-password",
                                        onChange: event => {
                                            setLastName(event.target.value)
                                        },
                                        value: lastName
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Mail *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <CustomInput
                                    id="mail"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    success={registerEmail === "success"}
                                    error={registerEmail === "error"}
                                    inputProps={{
                                        type: "email",
                                        autoComplete: "new-password",
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
                                    Telefono
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <CustomInput
                                    id="phone"
                                    formControlProps={{
                                        fullWidth: true,
                                    }}
                                    inputProps={{
                                        type: "text",
                                        autoComplete: "new-password",
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
                                    Fecha de Nacimiento
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <Datetime
                                    id="bd"
                                    dateFormat="YYYY-MM-DD"
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    inputProps={{
                                        autoComplete: "new-password"
                                    }}
                                    onChange={(event) => {
                                        setBirthDate(event._d);
                                    }}
                                    className={classes.select}
                                    value={birthDate}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Pais
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
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
                                    Tipo de Usuario
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <Select
                                    success={(registerUserTypeId === "success").toString()}
                                    error={registerUserTypeId === "error"}
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select
                                    }}
                                    value={selectedUserTypeId}
                                    onChange={e => {
                                        let id = e.target.value;
                                        setSelectedUserTypeId(id);
                                    }}
                                    inputProps={{
                                        name: "userTypeSelect",
                                        id: "userType-select"
                                    }}
                                >
                                    {userTypes.map((c, i) => {
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
                                    Contraseña *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <CustomInput
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
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Repita la Contraseña *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <CustomInput
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
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={10} sm={10} md={10} lg={11}>
                                <FormLabel className={classes.labelHorizontal}>
                                    <small>*</small> Campos requeridos
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
                    message="Missing mandatory fields. Also check for a valid email input."
                    open={tr}
                    closeNotification={() => setTR(false)}
                    close
                />
                <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message="The passwords do not match, please re-enter."
                    open={pwTr}
                    closeNotification={() => setPwTr(false)}
                    close
                />
            </Card>
        </GridItem>
    );
}