import React, { useRef, useEffect } from "react";
import { Redirect } from 'react-router-dom'

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

// @material-ui/icons
import PermIdentity from "@material-ui/icons/PermIdentity";

import AddAlert from "@material-ui/icons/AddAlert";
import SweetAlert from "react-bootstrap-sweetalert";


// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Clearfix from "components/Clearfix/Clearfix.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Datetime from "react-datetime";

import { getRequest, editProfile } from "common/Request/Requests.js";
import { useTranslation } from 'react-i18next';

import styles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.js";
import selectStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const useStyles = makeStyles(styles);
const useSelectStyles = makeStyles(selectStyles);
const useAlertStyles = makeStyles(alertStyles);
const useFormStyle = makeStyles(formStyles);

export default function UserProfile(props) {
  const { t, i18n } = useTranslation();

  const [userProfile, setUserProfile] = React.useState({});
  const [countries, setCountries] = React.useState([]);
  const [userType, setUserType] = React.useState({});
  const [selectedCountryId, setSelectedCountryId] = React.useState(0);

  const [registerName, setRegisterName] = React.useState('');
  const [registerLastName, setRegisterLastName] = React.useState('');
  const [registerPhone, setRegisterPhone] = React.useState('');
  const [registerMail, setRegistermail] = React.useState('');

  const [displayDate, setDisplayDate] = React.useState('');

  const [redirect, setRedirect] = React.useState(false);

  const [bar, setBar] = React.useState(null);
  const [tr, setTR] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  const classes = useStyles();
  const selectClasses = useSelectStyles();
  const alertClasses = useAlertStyles();
  const formClasses = useFormStyle();

  useEffect(() => {
    let profile = {};
    let profileData = {};

    getRequest('getProfile').then(profileResponse => {
      profile = profileResponse.data;

      if (profile.code !== 403) {
        profileData = profileResponse.data.data[0];
        setUserProfile(profileData);
        setSelectedCountryId(profileData.country);

        if (profile.code != 200) {
          forbidden();
        }

        getRequest('countries').then(countryResponse => {
          if (countryResponse.data.code != 200) {
            forbidden();
          }

          setCountries(countryResponse.data.data);
        });

        getRequest('userTypes/' + profileData.user_type).then(userTypeResponse => {
          if (userTypeResponse.data.code !== 200) {
            forbidden();
          }

          setUserType(userTypeResponse.data.data);
        });
      }
      else {
        forbidden();
      }
    }).catch((e) => {
      forbidden();
    })
  }, []);

  useEffect(() => {
    if (typeof userProfile.birth_date === "string") {
      if (userProfile.birth_date.includes('T')) {
        setDisplayDate(userProfile.birth_date.split('T')[0]);
      }
      else {
        setDisplayDate(userProfile.birth_date);
      }
    }
    else {
      setDisplayDate(userProfile.birth_date)
    }
  }, [userProfile.birth_date]);

  const submitButton = () => {
    if (registerPhone !== "error"
      && registerLastName !== "error"
      && registerMail !== "error"
      && registerName !== "error") {
      progressBar();

      if (userProfile.birth_date !== '') {
        userProfile.birth_date = userProfile.birth_date.getFullYear() + '-' + (userProfile.birth_date.getMonth() + 1) + '-' + userProfile.birth_date.getDate() + 'T00:00:00Z'
      }

      editProfile(userProfile).then(response => {
        removeProgressBar();
        successAlert()
      })
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

  const verifyEmail = value => {
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  };

  function forbidden() {
    props.history.push('/auth/forbidden');
  }

  const successAlert = () => {
    setAlert(
      <SweetAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Perfil modificado"
        onConfirm={() => {
          setRedirect(<Redirect to='/admin/logout' />);
        }}
        onCancel={() => {
          setRedirect(<Redirect to='/admin/logout' />);
        }}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Aceptar"
        cancelBtnText="Cancelar"
        showCancel
      >
        Perfil modificado!
      </SweetAlert>
    );
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

  return (
    <div>
      {bar}
      {alert}
      {redirect}
      <GridContainer>
        <GridItem xs={12} sm={12} md={12} log={12}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <PermIdentity />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                {t('profile.title.edit')}
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="firstname" className={classes.description}>
                    {t('common.firstname')}
                  </InputLabel>
                  <CustomInput
                    id="first-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "text",
                      onChange: event => {
                        setUserProfile({
                          ...userProfile,
                          name: event.target.value
                        });
                      },
                      value: userProfile.name
                    }}
                  />
                </GridItem>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="lastname" className={classes.description}>
                    {t('common.lastname')}
                  </InputLabel>
                  <CustomInput
                    id="last-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "text",
                      onChange: event => {
                        setUserProfile({
                          ...userProfile,
                          lastname: event.target.value
                        });
                      },
                      value: userProfile.lastname
                    }}
                  />
                </GridItem>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="birthDate" className={classes.description}>
                    {t('common.birthDate')}
                  </InputLabel>
                  <Datetime
                    id="bd"
                    dateFormat="YYYY-MM-DD"
                    timeFormat={false}
                    closeOnSelect={true}
                    inputProps={{
                      autoComplete: "new-password"
                    }}
                    onChange={(event) => {
                      setUserProfile({
                        ...userProfile,
                        birth_date: event._d
                      })
                    }}
                    className={formClasses.select}
                    value={displayDate}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="mail" className={classes.description}>
                    {t('common.mail')}
                  </InputLabel>
                  <CustomInput
                    id="mail"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "mail",
                      onChange: event => {
                        setUserProfile({
                          ...userProfile,
                          mail: event.target.value
                        });
                      },
                      value: userProfile.mail
                    }}
                  />
                </GridItem>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="phone" className={classes.description}>
                    {t('common.phone')}
                  </InputLabel>
                  <CustomInput
                    id="phone"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "text",
                      onChange: event => {
                        setUserProfile({
                          ...userProfile,
                          phone: event.target.value
                        });
                      },
                      value: userProfile.phone
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="userType" className={classes.description}>
                    {t('common.user_type')}
                  </InputLabel>
                  <CustomInput
                    id="user-type"
                    formControlProps={{
                      fullWidth: true,
                      disabled: true
                    }}
                    inputProps={{
                      type: "text",
                      value: userType.description
                    }}
                  />
                </GridItem>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="country" className={classes.description}>
                    {t('common.country')}
                  </InputLabel>
                  <Select
                    // success={(registerCountryId === "success").toString()}
                    // error={registerCountryId === "error"}
                    MenuProps={{
                      className: selectClasses.selectMenu
                    }}
                    classes={{
                      select: selectClasses.select
                    }}
                    value={selectedCountryId}
                    onChange={e => {
                      let id = e.target.value;
                      setSelectedCountryId(id);
                      setUserProfile({
                        ...userProfile,
                        country: id
                      });
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
                            root: selectClasses.selectMenuItem,
                            selected: selectClasses.selectMenuItemSelected
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

              <Button color="rose" className={classes.updateProfileButton} onClick={submitButton}>
                {t('common.updateButton')}
              </Button>
              <Clearfix />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
