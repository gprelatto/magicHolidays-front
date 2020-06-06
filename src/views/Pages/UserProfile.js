import React, { useRef, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";

// @material-ui/icons
import PermIdentity from "@material-ui/icons/PermIdentity";

import AddAlert from "@material-ui/icons/AddAlert";

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

import { getRequest, editProfile } from "common/Request/Requests.js";

import styles from "assets/jss/material-dashboard-pro-react/views/userProfileStyles.js";
import selectStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

const useStyles = makeStyles(styles);
const useSelectStyles = makeStyles(selectStyles);
const useAlertStyles = makeStyles(alertStyles);

export default function UserProfile(props) {
  const [userProfile, setUserProfile] = React.useState({});
  const [countries, setCountries] = React.useState([]);
  const [userType, setUserType] = React.useState({});
  const [selectedCountryId, setSelectedCountryId] = React.useState(0);

  const [registerName, setRegisterName] = React.useState('');
  const [registerLastName, setRegisterLastName] = React.useState('');
  const [registerPhone, setRegisterPhone] = React.useState('');
  const [registerMail, setRegistermail] = React.useState('');

  const [bar, setBar] = React.useState(null);
  const [tr, setTR] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  const classes = useStyles();
  const selectClasses = useSelectStyles();
  const alertClasses = useAlertStyles();

  useEffect(() => {
    let profile = {};
    let profileData = {};

    getRequest('getProfile').then(profileResponse => {
      profile = profileResponse.data;
      
      if(profile.code !== 403) {
        profileData = profileResponse.data.data[0];
        setUserProfile(profileData);
        setSelectedCountryId(profileData.country);
  
        if(profile.code != 200) {
          forbidden();
        }
  
        getRequest('countries').then(countryResponse => {
          if(countryResponse.data.code != 200) {
            forbidden();
          }
  
          setCountries(countryResponse.data.data);
        });
  
        getRequest('userTypes/' + profileData.user_type).then(userTypeResponse => {
          if(userTypeResponse.data.code !== 200) {
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

  const submitButton = () => {
    if(registerPhone !== "error"
      && registerLastName !== "error"
      && registerMail !== "error"
      && registerName !== "error") {
        editProfile(userProfile).then(response => {
          setUserProfile(response.data.data);
        })
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

  return (
    <div>
      {bar}
      {alert}
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <PermIdentity />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Edit Profile
              </h4>
            </CardHeader>
            <CardBody>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <InputLabel htmlFor="firstname" className={classes.description}>
                    First Name
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
                <GridItem xs={12} sm={12} md={4}>
                  <InputLabel htmlFor="lastname" className={classes.description}>
                    Last Name
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
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                <InputLabel htmlFor="mail" className={classes.description}>
                    Mail
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
                <GridItem xs={12} sm={12} md={4}>
                  <InputLabel htmlFor="phone" className={classes.description}>
                    Phone
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
                <GridItem xs={12} sm={12} md={4}>
                  <InputLabel htmlFor="userType" className={classes.description}>
                    User Type
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
                <GridItem xs={12} sm={12} md={4}>
                  <InputLabel htmlFor="country" className={classes.description}>
                    Country
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
                Update Profile
              </Button>
              <Clearfix />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
