import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

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

import { getRequest, editCustomer, deleteCustomer } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function CustomerTable() {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  const [tableData, setTableData] = React.useState([]);
  const [customersData, setCustomersData] = React.useState('');
  const [countryData, setCountryData] = React.useState('');
  const [showEdit, setShowEdit] = React.useState(false);
  
  const [customerToEdit, setCustomerToEdit] = React.useState({});
  const [countryId, setCountryId] = React.useState('');
  
  
  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);

  useEffect(() => {
    populateCustomersTable();
  }, [])

  const submitEditButton = () => {
    editProgressBar();
    editCustomer(customerToEdit).then((response) => {
        populateCustomersTable();
        setShowEdit(false);
        removeEditProgressBar();
    });
  }

  const warningWithConfirmAndCancelMessage = (prod) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(prod)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirm Delete"
        cancelBtnText="Cancel"
        showCancel
      >
        Please confirm deleting customer.
      </SweetAlert>
    );
  };

  const successDelete = (cus) => {
    deleteCustomer(cus).then((response) => {
        populateCustomersTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          Customer deleted.
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
        Canceled deleting customer.
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

  const populateCustomersTable = () => {
    progressBar();
    getRequest('customers').then((customersResponse) => {
        let customersResponseData = customersResponse.data.results;

        setCustomersData(customersResponseData);
        getRequest('countries').then((countriesResponse) => {
            let countriesResponseData = countriesResponse.data.results;
            let data = [];
            setCountryData(countriesResponseData);

            customersResponseData.forEach(element => {
                let country = countriesResponseData.find(c => c.id === element.country)

                if(country != null) {
                    data.push(
                        {
                            id: element.id,
                            fullname: element.fullname,
                            mail: element.mail,
                            phone: element.phone,
                            country: element.country,
                            countryDescription: country.description
                        }
                    );
                }
            });
            
            let tableData = data.map((prop, key) => {
                return {
                    id: prop.id,
                    fullname: prop.fullname,
                    mail: prop.mail,
                    phone: prop.phone,
                    countryDescription: prop.countryDescription,
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
                                    let cus = data.find(f => f.id === prop.id)
                                    if (cus != null) {
                                        setCustomerToEdit(cus);
                                        setCountryId(cus.country);
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
                                    let cus = data.find(f => f.id === prop.id);
                                    if (cus != null) {
                                      warningWithConfirmAndCancelMessage(cus);
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
        });
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
                        Header: "Full Name",
                        accessor: "fullname"
                    },
                    {
                        Header: "EMail",
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
                <h4 className={classes.cardIconTitle}>Edit Customer</h4>
              </CardHeader>
              <CardBody>
                <form>
                    <CustomInput
                        labelText="Full Name"
                        id="fullname"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setCustomerToEdit({
                                ...customerToEdit,
                                description: event.target.value
                            })
                        },
                        value: customerToEdit.fullname
                        }}
                    />
                    <CustomInput
                        labelText="EMail"
                        id="mail"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setCustomerToEdit({
                                ...customerToEdit,
                                mail: event.target.value
                            })
                        },
                        value: customerToEdit.mail
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
                            setCustomerToEdit({
                                ...customerToEdit,
                                phone: event.target.value
                            })
                        },
                        value: customerToEdit.phone
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
                            setCustomerToEdit({
                                ...customerToEdit,
                                countryId: c.id,
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
                    <Button 
                        color="rose"
                        onClick={submitEditButton}
                    > Submit
                    </Button>
                </form>
            </CardBody>
            </Card>
        </GridItem>
      }
    </GridContainer>
  );
}
