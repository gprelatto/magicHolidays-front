import React, { useEffect, useCallback } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";
import Checkbox from "@material-ui/core/Checkbox";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

import Datetime from "react-datetime";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import AddAlert from "@material-ui/icons/AddAlert";

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
import Snackbar from "components/Snackbar/Snackbar.js";

import { CSVLink } from "react-csv";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormLabel from "@material-ui/core/FormLabel";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { getRequest, redirectToUnforbidden, postPay } from 'common/Request/Requests.js'
import getTrProps from 'common/Styles/TableProps.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);
const useFormStyles = makeStyles(formStyles);

export default function PaymentTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();
  const formStylesClasses = useFormStyles();

  let filteredDataRef = React.useRef([]);
  let selectedReservationsRef = React.useRef([]);
  let feeSumRef = React.useRef(0);

  const [tableData, setTableData] = React.useState([]);

  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedReservations, setSelectedReservations] = React.useState([]);
  const [summary, setSummary] = React.useState([]);

  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [showEdit, setShowEdit] = React.useState(false);
  const [tr, setTR] = React.useState(false);

  const [payDate, setPayDate] = React.useState(new Date());
  const [transactionNumber, setTransactionNumber] = React.useState('');

  const [transactionNumberConfirmation, setTransactionNumberConfirmation] = React.useState('error');
  const [trTransactionNumber, setTrTransactionNumber] = React.useState(false);

  const [feeSum, setFeeSum] = React.useState(0);

  const [tableDataByUser, setTableDataByUser] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState();
  const [open, setOpen] = React.useState(false);
  const loading = open && users.length === 0;

  useEffect(() => {
    populateTable();
  }, [])

  useEffect(() => {
    if (transactionNumber.length === 0) {
      setTransactionNumberConfirmation("error");
    }
    else {
      setTransactionNumberConfirmation("success");
    }
  }, [transactionNumber]);

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
      populateTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
          title="Marked as prepaid!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
        </SweetAlert>
      );
      setShowEdit(false);
      selectedReservationsRef.current= [];
      setSelectedReservations([]);
      removeSubmitProgressBar();
    });
  }

  const warningWithConfirmAndCancelMessage = () => {
    if (transactionNumberConfirmation !== 'error') {
      setAlert(
        <SweetAlert
          warning
          style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
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
    }
    else {
      if (!trTransactionNumber) {
        setTrTransactionNumber(true);
        setTimeout(function () {
          setTrTransactionNumber(false);
        }, 3000);
      }
    }
  };

  const cancelDetele = () => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
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

  const sumFees = () => {
    setFeeSum(feeSumRef.current.toFixed(2));
  }

  const populateTable = () => {
    progressBar();

    getRequest('pay').then(payResponse => {
      let payResponseData = payResponse.data;

      if (payResponseData.code === 403) {
        redirectToUnforbidden(props);
      }

      getRequest('users').then((usersResponse) => {
        let usersResponseData = usersResponse.data

        if (usersResponseData.code === 403) {
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
                    let existingRezIdx = selectedReservationsRef.current.map(function (item) { return item.id; }).indexOf(prop.id);

                    if (existingRezIdx === -1) {
                      selectedReservationsRef.current.push(prop)
                      feeSumRef.current = feeSumRef.current + Number(prop.rez.feeUser)
                      sumFees();
                    }
                    else {
                      selectedReservationsRef.current.splice(existingRezIdx, 1);
                      feeSumRef.current = feeSumRef.current - Number(prop.rez.feeUser)
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

        setTableData(tableData);
        setTableDataByUser(tableData);
        removeProgressBar();
      })
    })
  }

  function ccyFormat(num) {
    return `${num.toFixed(2)}`;
  }

  return (
    <GridContainer>
      {alert}
      {!showEdit ?
        <>
          <GridItem xxs={12} sm={12} md={12} lg={12}>
            <Card>
              {bar}
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Reservas Pre Pagadas a Pagar: <b>$ {feeSum}</b></h4>
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
                        if (selectedReservationsRef.current.length > 0) {
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

                          var result = [];
                          data.reduce(function (res, value) {
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
                      Pagar Reservas Seleccionadas
                    </Button>
                  </GridItem>
                  <GridItem xs={4} sm={4} md={4} lg={4}>
                    <CSVLink data={tableDataByUser} >Descargar Datos</CSVLink>
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
                      Header: "ID Pago",
                      accessor: "id"
                    },
                    {
                      Header: "ID Reserva",
                      accessor: "rez_id"
                    },
                    {
                      Header: "Nombre",
                      accessor: "name"
                    },
                    {
                      Header: "Apellido",
                      accessor: "lastname"
                    },
                    {
                      Header: "Num. Confirmacion",
                      accessor: "confirmationNumber"
                    },
                    {
                      Header: "Fec. Pre-Pago",
                      accessor: "prepaidDate"
                    },
                    {
                      Header: "Total",
                      accessor: "total"
                    },
                    {
                      Header: "Com. Total",
                      accessor: "feeTotal"
                    },
                    {
                      Header: "Com. Agencia",
                      accessor: "feeAgency"
                    },
                    {
                      Header: "Com. Agente",
                      accessor: "feeUser"
                    },
                    {
                      Header: "Marcar para Pagar",
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
          </GridItem>
        </>
        :
        <GridItem xs={7} sm={7} md={7} lg={7}>
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
              <GridItem xs={8} sm={8} md={8} lg={8}>
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
                    </TableBody>
                  </Table>
                </TableContainer>
              </GridItem>


              <GridContainer>
                <GridItem xs={2} sm={2} md={2} lg={2}>
                  <FormLabel className={formStylesClasses.labelHorizontal}>
                    Numero de Transaccion *
                  </FormLabel>
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3}>
                  <CustomInput
                    id="rezNumber"
                    formControlProps={{
                      fullWidth: true
                    }}
                    success={transactionNumberConfirmation === "success"}
                    error={transactionNumberConfirmation === "error"}
                    inputProps={{
                      type: "text",
                      onChange: event => {
                        setTransactionNumber(event.target.value)
                      },
                      value: transactionNumber
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={2} sm={2} md={2} lg={2}>
                  <FormLabel className={formStylesClasses.labelHorizontal}>
                    Fecha de la Transaccion
                  </FormLabel>
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3}>
                  <Datetime
                    dateFormat="YYYY-MM-DD"
                    timeFormat={false}
                    closeOnSelect={true}
                    inputProps={{
                      placeholder: "",
                    }}
                    onChange={(event) => {
                      setPayDate(event._d)
                    }}
                    className={formStylesClasses.select}
                    value={payDate}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={4} sm={4} md={4} lg={4}>
                  <br />
                </GridItem>
              </GridContainer>

              <GridContainer>
                <GridItem xs={3} sm={3} md={3} lg={3}>
                  <Button color="warning" className={formStylesClasses.marginRight} onClick={() => {
                    selectedReservationsRef.current = [];
                    setShowEdit(false);
                  }}>
                    Volver a la Tabla
                        </Button>
                </GridItem>
                <GridItem xs={3} sm={3} md={3} lg={3}>
                  <Button color="primary" className={formStylesClasses.marginRight} onClick={() => {
                    warningWithConfirmAndCancelMessage();
                  }}>
                    Marcar Reservas como Pagas
                        </Button>
                </GridItem>
              </GridContainer>
            </CardBody>
            <Snackbar
              place="tr"
              color="danger"
              icon={AddAlert}
              message="Ingrese numero de transaccion."
              open={trTransactionNumber}
              closeNotification={() => setTR(false)}
              close
            />
          </Card>
        </GridItem >
      }
    </GridContainer >
  );
}