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
                let user = {
                    name: name,
                    lastname: lastName,
                    mail: email,
                    phone: phone,
                    country: selectedCountryId,
                    user_type: selectedUserTypeId,
                    password: password
                }

                const bodyForm = new FormData();
                bodyForm.append('name', name);
                bodyForm.append('password', password);
                bodyForm.append('lastname', lastName);
                bodyForm.append('phone', phone);
                bodyForm.append('country', selectedCountryId);
                bodyForm.append('user_type', selectedUserTypeId);
                bodyForm.append('mail', email);

                let auth = JSON.parse(localStorage.getItem('auth'));
                
                axios({
                    method: 'post', 
                    url: 'https://mhtravelagency-api.herokuapp.com/users/',
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
              setRedirect(<Redirect to='/admin/userTable' />);
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
                        <CustomInput
                            labelText="Name *"
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
                        <CustomInput
                            labelText="Last Name"
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
                        <CustomInput
                            labelText="Mail *"
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
                        <CustomInput
                            labelText="Phone"
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
                        <InputLabel htmlFor="country-select" className={classes.selectLabel}>
                            Country
                        </InputLabel>
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
                        <InputLabel htmlFor="usert-select" className={classes.selectLabel}>
                            User Type
                        </InputLabel>
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
                        <CustomInput
                            labelText="Password *"
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
                            labelText="Repeat Password *"
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
                            <small>*</small> Required fields
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