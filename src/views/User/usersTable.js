import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import axios from 'axios';

import ReactTable from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import MailOutline from "@material-ui/icons/MailOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, editUser, deleteUser } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function UsersTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  const [tableData, setTableData] = React.useState([]);
  const [userData, setUseData] = React.useState('');
  const [userTypeData, setUserTypeData] = React.useState('');
  const [countryData, setCountryData] = React.useState('');
  const [countryId, setCountryId] = React.useState('');
  const [showEdit, setShowEdit] = React.useState(false);
  
  const [userToEdit, setUserToEdit] = React.useState({});
  const [userTypeId, setUserTypeId] = React.useState('');

  const [password, setPassword] = React.useState('');
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('');  
  
  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);

  useEffect(() => {
    populateUsersTable();
  }, [])

  const submitEditButton = () => {
    editProgressBar();

    const bodyForm = new FormData();
    bodyForm.append('id', userToEdit.id);
    bodyForm.append('name', userToEdit.name);
    bodyForm.append('password', password);
    bodyForm.append('lastname', userToEdit.lastname);
    bodyForm.append('phone', userToEdit.phone);
    bodyForm.append('country', userToEdit.country);
    bodyForm.append('user_type', userToEdit.user_type);
    bodyForm.append('mail', userToEdit.mail);

    let auth = JSON.parse(localStorage.getItem('auth'));

    axios({
      method: 'put',
      url: process.env.REACT_APP_API_URL + 'users/' + userToEdit.id  + '/',
      data: bodyForm,
      headers: { 
          'Content-Type': 'multipart/form-data',
          'mail': auth.mail,
          'token': auth.token
      }
      }).then((response) => {
          removeProgressBar();
          populateUsersTable();
          setShowEdit(false);
      }).catch(e => {
          props.history.push('/auth/forbidden')
      });
  }

  const warningWithConfirmAndCancelMessage = (cus) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(cus)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirm Delete"
        cancelBtnText="Cancel"
        showCancel
      >
        Please confirm deleting user.
      </SweetAlert>
    );
  };

  const successDelete = (usr) => {
    deleteUser(usr).then((response) => {
        populateUsersTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          User deleted.
        </SweetAlert>
      );
    })
  };

  const cancelDetele = () => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
      >
        Canceled deleting user.
      </SweetAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
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

  const editProgressBar = () => {
    setEditBar(
      <CustomLinearProgress
        variant="indeterminate"
        color="primary"
        value={30}
      />
    );
  };

  const removeEditProgressBar = () => {
    setEditBar(null);
  };

  const populateUsersTable = () => {
    progressBar();
    getRequest('users').then((usersResponse) => {
        let userDataResponse = usersResponse.data.data;

        setUseData(userDataResponse);
        getRequest('userTypes').then((userTypeResponse) => {
            let userTypeDataResponse = userTypeResponse.data.data;
            setUserTypeData(userTypeDataResponse);

            getRequest('countries').then((countryResponse) => {
                let countriesDataResponse = countryResponse.data.data;
                setCountryData(countriesDataResponse);
                let data = [];

                userDataResponse.forEach(element => {
                    let userType = userTypeDataResponse.find(c => c.id === element.user_type);
                    let country = countriesDataResponse.find(c => c.id === element.country);
    
                    if(userType != null) {
                        data.push(
                            {
                                id: element.id,
                                name: element.name,
                                lastname: element.lastname,
                                mail: element.mail,
                                phone: element.phone,
                                country: element.country,
                                countryDescription: country.description,
                                user_type: userType.id,
                                user_typeDescription: userType.description,
                                created_at: element.created_at,
                                updated_at: element.updated_at,
                                deleted_at: element.deleted_at
                            }
                        );
                    }
                });
                
                let tableData = data.map((prop, key) => {
                    return {
                        id: prop.id,
                        name: prop.name,
                        lastname: prop.lastname,
                        mail: prop.mail,
                        phone: prop.phone,
                        countryDescription: prop.countryDescription,
                        userTypeDescription: prop.user_typeDescription,
                        actions: (
                          <div className="actions-right">
                                <Button
                                    round
                                    justIcon
                                    simple
                                    color="success"
                                    className={"edit " + classes.actionButtonRound}
                                    key={key}
                                    onClick={() => {
                                        let usr = data.find(f => f.id === prop.id)
                                        if (usr != null) {
                                            setUserToEdit(usr);
                                            setCountryId(usr.country);
                                            setUserTypeId(usr.user_type);
                                            setShowEdit(true);
                                        }
                                    }}
                                >
                                    <Edit />
                                </Button>
                                <>{" "}</>
                                <Button
                                    justIcon
                                    round
                                    simple
                                    onClick={() => {
                                        let usr = data.find(f => f.id === prop.id);
                                        if (usr != null) {
                                          warningWithConfirmAndCancelMessage(usr);
                                        }
                                    }}
                                    color="danger"
                                    className="remove"
                                >
                                    <Close />
                                </Button>
                                <>{" "}</>
                            </div>
                        )
                    }
                });
                
                setTableData(tableData);
                removeProgressBar();  
            })
        }).catch(e => {
          props.history.push('/auth/forbidden')
        });
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });
  }

  return (
    <GridContainer>
      {alert}
      { !showEdit ?
          <GridItem xs={12}>
            {bar}
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Customers</h4>
              </CardHeader>
              <CardBody>
              <ReactTable
                  data={tableData}
                  filterable
                  defaultFilterMethod={(filter, row) =>{ return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                  columns={[
                    {
                        Header: "ID",
                        accessor: "id"
                    },
                    {
                        Header: "Name",
                        accessor: "name"
                    },
                    {
                        Header: "Last Name",
                        accessor: "lastname"
                    },
                    {
                        Header: "Mail",
                        accessor: "mail"
                    },
                    {
                        Header: "Phone",
                        accessor: "phone"
                    },
                    {
                        Header: "Country",
                        accessor: "countryDescription"
                    },
                    {
                        Header: "User Type",
                        accessor: "userTypeDescription"
                    },
                    {
                        Header: "Actions",
                        accessor: "actions",
                        sortable: false,
                        filterable: false
                    }
                  ]}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"
                />
              </CardBody>
            </Card>
          </GridItem>
          : 
          <GridItem xs={12} sm={12} md={6}>
            {editBar}
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <MailOutline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Edit User</h4>
              </CardHeader>
              <CardBody>
                <form>
                    <CustomInput
                        labelText="Name"
                        id="fullname"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setUserToEdit({
                                ...userToEdit,
                                name: event.target.value
                            })
                        },
                        value: userToEdit.name
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
                        onChange: event => {
                            setUserToEdit({
                                ...userToEdit,
                                lastname: event.target.value
                            })
                        },
                        value: userToEdit.lastname
                        }}
                    />
                    <CustomInput
                        labelText="Mail"
                        id="mail"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setUserToEdit({
                                ...userToEdit,
                                mail: event.target.value
                            })
                        },
                        value: userToEdit.mail
                        }}
                    />
                    <CustomInput
                        labelText="Phone"
                        id="phone"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setUserToEdit({
                                ...userToEdit,
                                phone: event.target.value
                            })
                        },
                        value: userToEdit.phone
                        }}
                    />
                    <InputLabel htmlFor="country-select" className={classes.selectLabel}>
                        Country
                    </InputLabel>
                    <Select
                        MenuProps={{
                            className: classes.selectMenu
                        }}
                        classes={{
                            select: classes.select
                        }}
                        value={countryId}
                        onChange={e => {
                            let id = e.target.value;
                            setCountryId(id);

                            let c = countryData.find(s => s.id === id);
                            setUserToEdit({
                                ...userToEdit,
                                country: c.id,
                                countryDescription: c.description
                            })
                        }}
                        inputProps={{
                            name: "countrySelect",
                            id: "country-select"
                        }}  
                        >   
                        {countryData.map((c, i) => {     
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
                    <InputLabel htmlFor="userType-select" className={classes.selectLabel}>
                        User Type
                    </InputLabel>
                    <Select
                        MenuProps={{
                            className: classes.selectMenu
                        }}
                        classes={{
                            select: classes.select
                        }}
                        value={userTypeId}
                        onChange={e => {
                            let id = e.target.value;
                            setUserTypeId(id);

                            let c = userTypeData.find(s => s.id === id);
                            setUserToEdit({
                                ...userToEdit,
                                user_type: c.id,
                                user_typeDescription: c.description
                            })
                        }}
                        inputProps={{
                            name: "userTypeSelect",
                            id: "usert-select"
                        }}  
                        >   
                        {userTypeData.map((c, i) => {     
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
                    <GridItem xs={12} sm={12} md={6}>
                      <div className={classes.cardContentRight}>
                        <Button color="primary" className={classes.marginRight} onClick={submitEditButton}>
                          Submit
                        </Button>
                        <Button color="primary" className={classes.marginRight} onClick={() => setShowEdit(false)}>
                          Return to table
                        </Button>
                      </div>
                    </GridItem>
                </form>
            </CardBody>
            </Card>
        </GridItem>
      }
    </GridContainer>
  );
}
