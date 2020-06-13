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



import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';




import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, redirectToUnforbidden, postPrepay } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function PaymentTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  let filteredDataRef = React.useRef([]);
  let selectedReservationsRef = React.useRef([]);

  const [tableData, setTableData] = React.useState([]);

  const [payDate, setPayDate] = React.useState(new Date());

  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedReservations, setSelectedReservations] = React.useState([]);
  const [summary, setSummary] = React.useState([]);
 
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [showEdit, setShowEdit] = React.useState(false);

  useEffect(() => {
    populateTable();
  }, [])

  const submit = () => {
    submitProgressBar();

    let data = {
      paidDate: payDate,
      prepaidDate: new Date(),
      reservations: selectedReservations
    }

    postPrepay(data).then((response) => {
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

    getRequest('pay').then(payResponse => {
      let payResponseData = payResponse.data;

      if(payResponseData.code === 403) {
        redirectToUnforbidden(props);
      }

      let customData = [];

      for (var i = 0, len = payResponseData.data.length; i < len; i++) {
        let e = payResponseData.data[i];
        getRequest('reservations/' + e.rez).then(rez => {
            getRequest('users/' + rez.data.data.user).then((response) => {
                let user = response.data;
                
                if (user.code === 403) {
                  redirectToUnforbidden(props);
                }

                customData.push({
                    id: e.id,
                    name: user.data.name,
                    lastname: user.data.lastname,
                    confirmationNumber: rez.data.data.confirmationNumber,
                    prepaidDate: e.prepaidDate,
                    total: rez.data.data.total,
                    feeTotal: rez.data.data.feeTotal,
                    feeAgency: rez.data.data.feeAgency,
                    feeUser: rez.data.data.feeUser,
                    prepay: (
                        <div>
                            <Checkbox
                                key={rez.data.data.id}
                                tabIndex={-1}
                                onClick={(event) => {
                                    console.log('cc', selectedReservationsRef.current)
                                    let existingRezIdx = selectedReservationsRef.current.map(function(item) { return item.pay.id; }).indexOf(e.id);
                                    
                                    if(existingRezIdx === -1) {
                                        selectedReservationsRef.current.push({
                                            pay: e,
                                            rez: rez.data.data,
                                            user: response.data.data
                                        })
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
                })
                });
            })
      }

    setTableData(customData);
    removeProgressBar();      
    })
    }

    const [dataProvisory, setDataProvisory] = React.useState([]);

    useEffect(() => {
        console.log('prov',tableData)
        setDataProvisory(tableData)
    }, [tableData]);


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

    function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
    }

    const rows = [
    createRow('Paperclips (Box)', 100, 1.15),
    createRow('Paper (Case)', 10, 45.99),
    createRow('Waste Basket', 2, 17.99),
    ];

    const invoiceSubtotal = subtotal(rows);
    const invoiceTaxes = TAX_RATE * invoiceSubtotal;
    const invoiceTotal = invoiceTaxes + invoiceSubtotal;


  return (
    <GridContainer>
      {alert}
      { !showEdit ?
          <GridItem xs={12}>
            <Button color="warning"
                className={classes.marginRight}
                onClick={() => {
                  let ids = filteredDataRef.getResolvedState().sortedData.map((i, k) => {
                    return i.id;
                  });

                  setSelectedReservations(ids);
                  setShowEdit(true);
                }} >
                PAY all filtered reservations
            </Button>
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
            <Card>
            {bar}
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Prepaid Reservations to be paid</h4>
              </CardHeader>
              <CardBody>
              <ReactTable
                  data={dataProvisory}
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
                            <TableCell align="center" colSpan={3}>
                            Details
                            </TableCell>
                            <TableCell align="right">Price</TableCell>
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
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell align="right">{ccyFormat(row.feeTotal)}</TableCell>
                            <TableCell align="right">{ccyFormat(row.feeUser)}</TableCell>
                            <TableCell align="right">{ccyFormat(row.feeAgency)}</TableCell>
                            </TableRow>
                        ))}

                        <TableRow>
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
                        </TableRow>
                        </TableBody>
                    </Table>
                    </TableContainer>
                    <div className={classes.cardContentRight}>
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