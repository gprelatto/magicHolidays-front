import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import InputLabel from "@material-ui/core/InputLabel";
import { CSVLink } from "react-csv";

// core components
import Check from "@material-ui/icons/Check";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddAlert from "@material-ui/icons/AddAlert";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, redirectToUnforbidden, postPrepay } from 'common/Request/Requests.js'
import getTrProps from 'common/Styles/TableProps.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function PrepaidTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  let filteredDataRef = React.useRef([]);
  let selectedReservationsRef = React.useRef([]);
  let feeSumRef = React.useRef(0);

  const [tableData, setTableData] = React.useState([]);

  const [prepayDate, setPrepayDate] = React.useState(new Date());

  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedReservations, setSelectedReservations] = React.useState([]);

  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [showEdit, setShowEdit] = React.useState(false);
  const [tr, setTR] = React.useState(false);

  const [tableDataByUser, setTableDataByUser] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState();
  const [open, setOpen] = React.useState(false);
  const loading = open && users.length === 0;

  const [feeSum, setFeeSum] = React.useState(0);

  useEffect(() => {
    populateTable();
  }, [])

  useEffect(() => {
    let filteredData = tableData.filter(f => f.user === selectedUser.id)

    setTableDataByUser(filteredData);
  }, [selectedUser]);

  const submit = () => {
    submitProgressBar();

    let data = {
      prepaidDate: prepayDate,
      reservations: selectedReservations
    }

    postPrepay(data).then((response) => {
      populateTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Marked as prepaid!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
        </SweetAlert>
      );
      setShowEdit(false);
      selectedReservationsRef.current = [];
      setSelectedReservations([]);
      removeSubmitProgressBar();
    });
  }

  const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => submit()}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirm prepay"
        cancelBtnText="Cancel"
        showCancel
      >
        Please confirm.
      </SweetAlert>
    );
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
        Canceled.
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

  const submitProgressBar = () => {
    setEditBar(
      <CustomLinearProgress
        variant="indeterminate"
        color="primary"
        value={30}
      />
    );
  };

  const removeSubmitProgressBar = () => {
    setEditBar(null);
  };

  const populateTable = () => {
    progressBar();

    getRequest('prepay').then(prepayResponse => {
      let prepayResponseData = prepayResponse.data;

      if (prepayResponseData.code === 403) {
        redirectToUnforbidden(props);
      }

      getRequest('customers').then(customersResponse => {
        let customers = customersResponse.data;

        if (customers.code === 403) {
          redirectToUnforbidden(props);
        }

        getRequest('users').then((response) => {
          let users = response.data;

          if (users.code === 403) {
            redirectToUnforbidden(props);
          }

          let usersCombo = users.data.map(prop => {
            return {
              id: prop.id,
              mail: prop.mail,
              fullname: prop.name + ' ' + prop.lastname
            }
          })

          setUsers(usersCombo);

          let data = prepayResponseData.data.map((prop, key) => {
            let usr = users.data.find(f => f.id === prop.user);
            prop.user = usr;

            let cus = customers.data.find(f => f.id === prop.customer);
            prop.customer = cus;

            return {
              id: prop.id,
              user: usr.id,
              fullName: usr.name + ' ' + usr.lastname,
              customerFullName: cus.fullname,
              confirmationNumber: prop.confirmationNumber,
              total: prop.total,
              feeTotal: prop.feeTotal,
              feeAgency: prop.feeAgency,
              feeUser: prop.feeUser,
              prepay: (
                <div>
                  <Checkbox
                    key={prop.id}
                    tabIndex={-1}
                    onClick={(e) => {
                      let existingRezIdx = selectedReservationsRef.current.map(function (item) { return item.id; }).indexOf(prop.id);

                      if (existingRezIdx === -1) {
                        selectedReservationsRef.current.push(prop)
                        feeSumRef.current = feeSumRef.current + Number(prop.feeUser)
                        sumFees();
                      }
                      else {
                        selectedReservationsRef.current.splice(existingRezIdx, 1);
                        feeSumRef.current = feeSumRef.current - Number(prop.feeUser)
                        sumFees();
                      }
                    }}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                </div>
              )
            }
          });

          setTableDataByUser(data);
          setTableData(data);
          removeProgressBar();
        })
      });
    })

    // }).catch(e => {
    //   props.history.push('/auth/forbidden')
    // });
  }

  const sumFees = () => {
    setFeeSum(feeSumRef.current.toFixed(2));
  }

  return (
    <GridContainer>
      {alert}
      {!showEdit ?
        <>
          <GridItem xs={12} sm={12} md={12} lg={12}>
            {bar}
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Reservas Sin Pagar - Seleccionado: <b>$ {feeSum}</b></h4>
              </CardHeader>
              <CardBody>

                <GridContainer>
                  <GridItem xs={4} sm={4} md={4} lg={4}>
                    <Autocomplete
                      id="customerMail-box"
                      options={users}
                      getOptionLabel={(option) => option.fullname}
                      onChange={(event, newValue) => {
                        if (newValue !== null)
                          setSelectedUser(newValue);
                        else
                          setTableDataByUser(tableData)
                      }}
                      open={open}
                      onOpen={() => {
                        setOpen(true);
                      }}
                      onClose={(e) => {
                        setOpen(false);
                      }}
                      loading={loading}
                      style={{ width: 300 }}
                      renderInput={(params) => (<TextField {...params}
                        label="Seleccionar agente"
                        variant="outlined"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loading ? <CircularProgress color="inherit" size={20} /> : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />)}
                    />
                  </GridItem>

                  <GridItem xs={4} sm={4} md={4} lg={4}>
                    <Button color="info"
                      className={classes.marginRight}
                      onClick={() => {
                        let ids = selectedReservationsRef.current.map((i, k) => {
                          return i.id;
                        });

                        if (ids.length > 0) {
                          setSelectedReservations(ids);
                          setShowEdit(true);
                        }
                        else {
                          if (!tr) {
                            setTR(true);
                            setTimeout(function () {
                              setTR(false);
                            }, 3000);
                          }
                        }
                      }} >
                      Mark as prepaid checked reservations
                    </Button>
                  </GridItem>

                  <GridItem xs={4} sm={4} md={4} lg={4}>
                    <CSVLink data={tableDataByUser} >Download Data</CSVLink>
                  </GridItem>
                </GridContainer>

                <ReactTable
                  data={tableDataByUser}
                  filterable
                  defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                  ref={(r) => {
                    if (r !== null) {
                      filteredDataRef = r;
                    }
                  }}
                  onFilteredChange={() => {
                    setFilteredData(filteredDataRef.getResolvedState().sortedData);
                  }}
                  columns={[
                    {
                      Header: "Nombre Agente",
                      accessor: "fullName"
                    },
                    {
                      Header: "Cliente",
                      accessor: "customerFullName"
                    },
                    {
                      Header: "Confirmation Number",
                      accessor: "confirmationNumber"
                    },
                    {
                      Header: "Total",
                      accessor: "total"
                    },
                    {
                      Header: "Total Fee",
                      accessor: "feeTotal"
                    },
                    {
                      Header: "Agency Fee",
                      accessor: "feeAgency"
                    },
                    {
                      Header: "User Fee",
                      accessor: "feeUser"
                    },
                    {
                      Header: "Mark as Prepaid",
                      accessor: "prepay",
                      sortable: false,
                      filterable: false
                    }
                  ]}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  getTrProps={getTrProps}
                  className="-striped -highlight"
                />
              </CardBody>
            </Card>
            <Snackbar
              place="tr"
              color="danger"
              icon={AddAlert}
              message="Seleccione al menos una reserva."
              open={tr}
              closeNotification={() => setTR(false)}
              close
            />
          </GridItem></>
        :
        <GridItem xs={12} sm={12} md={4}>
          {editBar}
          {alert}
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <LibraryBooks />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Set Prepay date</h4>
            </CardHeader>
            <CardBody>
              <InputLabel className={classes.label}>Prepay date</InputLabel>
              <br />
              <FormControl fullWidth>
                <Datetime
                  timeFormat={false}
                  closeOnSelect={true}
                  inputProps={{
                    placeholder: "Prepay Date",
                  }}
                  onChange={(event) => {
                    setPrepayDate(event._d)
                  }}
                  value={prepayDate}
                />
              </FormControl>
              <div className={classes.cardContentRight}>
                <Button color="primary" className={classes.marginRight} onClick={warningWithConfirmAndCancelMessage}>
                  Submit
                  </Button>
                <Button color="primary" className={classes.marginRight} onClick={() => setShowEdit(false)}>
                  Return to table
                  </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      }
    </GridContainer>
  );
}