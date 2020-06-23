import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable, { useTable } from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import MailOutline from "@material-ui/icons/MailOutline";

import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import InputLabel from "@material-ui/core/InputLabel";

// core components
import Check from "@material-ui/icons/Check";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import {CSVLink} from "react-csv";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';


import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, redirectToUnforbidden, postPay } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function PaymentTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  let filteredDataRef = React.useRef([]);
  let selectedReservationsRef = React.useRef([]);

  const [tableData, setTableData] = React.useState([]);

  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedReservations, setSelectedReservations] = React.useState([]);
  const [summary, setSummary] = React.useState([]);
 
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [showEdit, setShowEdit] = React.useState(false);

  const [payDate, setPayDate] = React.useState(new Date());
  const [transactionNumber, setTransactionNumber] = React.useState('');

  const [tableDataByUser, setTableDataByUser] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState();
  const [open, setOpen] = React.useState(false);
  const loading = open && users.length === 0;

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
      payDate: payDate,
      transactionNumber: transactionNumber,
      reservations: selectedReservations.map(prop => prop.rez.id)
    }

    postPay(data).then((response) => {
      console.log('res',response)
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
        confirmBtnText="Confirm pay"
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

    getRequest('pay').then(payResponse => {
      let payResponseData = payResponse.data;

      if(payResponseData.code === 403) {
        redirectToUnforbidden(props);
      }

      getRequest('users').then((usersResponse) => {
        let usersResponseData = usersResponse.data
        
        if(usersResponseData.code === 403) {
          redirectToUnforbidden(props);
        }

        let usersCombo = usersResponseData.data.map(prop => {
          return {
              id: prop.id,
              mail: prop.mail,
              fullname: prop.name + ' ' + prop.lastname
          }
        })

        setUsers(usersCombo);

        let tableData = payResponseData.data.map((prop, key) => {
          let user = usersResponseData.data.find(f => f.id === prop.rez.user);
          prop.user = user;

          let prepaidDate = prop.prepaidDate != null ? prop.prepaidDate.split('T')[0] : '';

          return {
            id: prop.id,
            rez_id: prop.rez.id,
            user: user.id,
            name: user.name,
            lastname: user.lastname,
            confirmationNumber: prop.rez.confirmationNumber,
            prepaidDate: prepaidDate,
            total: prop.rez.total,
            feeTotal: prop.rez.feeTotal,
            feeAgency: prop.rez.feeAgency,
            feeUser: prop.rez.feeUser,
            prepay: (
              <div>
                  <Checkbox
                      key={prop.id}
                      tabIndex={-1}
                      onClick={(event) => {
                          let existingRezIdx = selectedReservationsRef.current.map(function(item) { return item.id; }).indexOf(prop.id);
                          
                          if(existingRezIdx === -1) {
                              selectedReservationsRef.current.push(prop)
                          }
                          else {
                          selectedReservationsRef.current.splice(existingRezIdx, 1);
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

      setTableData(tableData);
      setTableDataByUser(tableData);
      removeProgressBar();      
    })
    })
  }

    const TAX_RATE = 0.07;

    function ccyFormat(num) {
    return `${num.toFixed(2)}`;
    }

    function priceRow(qty, unit) {
    return qty * unit;
    }

    function createRow(desc, qty, unit) {
    const price = priceRow(qty, unit);
    return { desc, qty, unit, price };
    }

  return (
    <GridContainer>
      {alert}
      { !showEdit ?
        <>
          <GridItem xs={12} sm={12} md={6}>
          <div className={classes.cardContentRight}>
            <Autocomplete
              id="customerMail-box"
              options={users}
              getOptionLabel={(option) => option.fullname}
              onChange={(event, newValue) => {
                  if(newValue !== null)
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

            <Button color="info"
                className={classes.marginRight}
                onClick={() => {
                    console.log('current', selectedReservationsRef.current);
                    setSelectedReservations(selectedReservationsRef.current);

                    let data = selectedReservationsRef.current.map(prop => {
                        return {
                            userId: prop.user.id,
                            user: prop.user.name + ' ' + prop.user.lastname,
                            total: Number(prop.rez.total),
                            feeTotal: Number(prop.rez.feeTotal),
                            feeAgency: Number(prop.rez.feeAgency),
                            feeUser: Number(prop.rez.feeUser),
                            qty: 1
                        }
                    });
                    
                    console.log('data',data)

                    var result = [];
                    data.reduce(function(res, value) {
                    if (!res[value.userId]) {
                        res[value.userId] = { 
                            userId: value.userId,
                            user: value.user,
                            total: value.total,
                            feeTotal: value.feeTotal,
                            feeAgency: value.feeAgency,
                            feeUser: value.feeUser,
                            qty: value.qty
                        };

                        result.push(res[value.userId])
                    }
                    else {
                        res[value.userId].total += value.total;
                        res[value.userId].feeTotal += value.feeTotal;
                        res[value.userId].feeAgency += value.feeAgency;
                        res[value.userId].feeUser += value.feeUser;
                        res[value.userId].qty += value.qty;
                    }
                    
                    return res;
                    }, {});

                    setSummary(result);
                    setShowEdit(true);
                }} >
                PAY checked reservations
            </Button>
            </div>
          </GridItem>
          <GridItem xs={12}>
            <Card>
            {bar}
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Prepaid Reservations to be paid</h4>
              </CardHeader>
              <CardBody>
              <CSVLink data={tableDataByUser} >Download Data</CSVLink>      
              <ReactTable
                  data={tableDataByUser}
                  filterable
                  defaultFilterMethod={(filter, row) =>{ return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                  ref={(r) => {
                      if(r !== null){
                        filteredDataRef = r;
                      }
                  }}
                  onFilteredChange={() => {
                      setFilteredData(filteredDataRef.getResolvedState().sortedData);
                  }}
                  columns={[
                    {
                      Header: "ID",
                      accessor: "id"
                    },
                    {
                      Header: "ID REZ",
                      accessor: "rez_id"
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
                        Header: "Confirmation Number",
                        accessor: "confirmationNumber"
                    },
                    {
                        Header: "Prepaid Date",
                        accessor: "prepaidDate"
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
                        Header: "Agemcy Fee",
                        accessor: "feeAgency"
                    },
                    {
                        Header: "User Fee",
                        accessor: "feeUser"
                    },
                    {
                        Header: "To be paid",
                        accessor: "prepay",
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
          </>
          : 
          <GridItem xs={12} sm={12} md={4}>
            {editBar}
            {alert}
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <LibraryBooks />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Pay</h4>
              </CardHeader>
              <CardBody>
              <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="spanning table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="left" colSpan={2}>
                            Details
                            </TableCell>
                            <TableCell align="right" colSpan={4}>Price</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Agent</TableCell>
                            <TableCell align="right">Qty.</TableCell>
                            <TableCell align="right">Total</TableCell>
                            <TableCell align="right">Total comision</TableCell>
                            <TableCell align="right">Total Vendedor</TableCell>
                            <TableCell align="right">Total Agencia</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {summary.map((row) => (
                            <TableRow key={row.userId}>
                            <TableCell>{row.user}</TableCell>
                            <TableCell align="right">{row.qty}</TableCell>
                            <TableCell align="right">{ccyFormat(row.total)}</TableCell>
                            <TableCell align="right">{ccyFormat(row.feeTotal)}</TableCell>
                            <TableCell align="right">{ccyFormat(row.feeUser)}</TableCell>
                            <TableCell align="right">{ccyFormat(row.feeAgency)}</TableCell>
                            </TableRow>
                        ))}

                        {/* <TableRow>
                            <TableCell rowSpan={3} />
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
                        </TableRow>*/}
                        </TableBody> 
                    </Table>
                    </TableContainer>
                    <CustomInput
                      labelText="Transaction Number *"
                      id="rezNumber"
                      formControlProps={{
                          fullWidth: true
                      }}
                      // success={registerProductDescriptionState === "success"}
                      // error={registerProductDescriptionState === "error"}
                      inputProps={{
                          type: "text",
                          onChange: event => {
                              setTransactionNumber(event.target.value)
                          },
                          value: transactionNumber
                      }}
                    />
                    <Datetime
                      timeFormat={false}
                      closeOnSelect={true}
                      inputProps={{ 
                          placeholder: "Pay Date",
                      }}
                      onChange={(event) => {
                          setPayDate(event._d)
                      }}
                      value={payDate}
                    />
                    <div className={classes.cardContentRight}>
                        <Button color="warning" className={classes.marginRight} onClick={() => {
                          selectedReservationsRef.current = [];
                          setShowEdit(false);
                          }}>
                            Return to table
                        </Button>
                        <Button color="primary" className={classes.marginRight} onClick={() => {
                          warningWithConfirmAndCancelMessage();
                        }}>
                            Set transaction number and pay date
                        </Button>
                    </div>
              </CardBody>
            </Card>
          </GridItem>
        }
    </GridContainer>
  );
}