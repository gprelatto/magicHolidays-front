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

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';




import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, redirectToUnforbidden, postPay } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function PaymentListTable(props) {
    const classes = useStyles();
    const alertClasses = useAlertStyles();

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

    getRequest('payments').then(payResponse => {
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

            let payDate = prop.payDate != null ? prop.payDate.split('T')[0] : '';
            let prepaidDate = prop.prepaidDate != null ? prop.prepaidDate.split('T')[0] : '';
            let transactionNumber = prop.transactionNumber ?? '';

            return {
                id: prop.id,
                rez_id: prop.rez.id,
                user: prop.rez.user,
                fullname: user.name + ' ' +user.lastname,
                confirmationNumber: prop.rez.confirmationNumber,
                transactionNumber: transactionNumber,
                prepaidDate: prepaidDate,
                payDate: payDate,
                total: prop.rez.total,
                feeTotal: prop.rez.feeTotal,
                feeAgency: prop.rez.feeAgency,
                feeUser: prop.rez.feeUser,
                actions: ''
            }
      });

      setTableDataByUser(tableData);
      setTableData(tableData);
      removeProgressBar();      
    })
    })
  }

  return (
    <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
            <Autocomplete
                id="customerMail-box"
                options={users}
                getOptionLabel={(option) => option.fullname}
                onChange={(event, newValue) => {
                    if(newValue !== null)
                        setSelectedUser(newValue);
                }}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
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
          <GridItem xs={12}>
          {alert}
            <Card>
            {bar}
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Listado completo de pagos</h4>
              </CardHeader>
              <CardBody>
              <CSVLink data={tableDataByUser} >Download Data</CSVLink>              
              <ReactTable
                  data={tableDataByUser}
                  filterable
                  defaultFilterMethod={(filter, row) =>{ return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                  columns={[
                    {
                        Header: "Nombre Completo",
                        accessor: "fullname"
                    },
                    {
                        Header: "Confirmation Number",
                        accessor: "confirmationNumber"
                    },
                    {
                        Header: "Transaccion",
                        accessor: "transactionNumber"
                    },
                    {
                        Header: "Prepaid Date",
                        accessor: "prepaidDate"
                    },
                    {
                        Header: "Fecha de pago",
                        accessor: "payDate"
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
    </GridContainer>
  );
}