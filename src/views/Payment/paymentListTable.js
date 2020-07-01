import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Close from "@material-ui/icons/Close";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";
import { CSVLink } from "react-csv";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, redirectToUnforbidden, deletePayment } from 'common/Request/Requests.js'
import getTrProps from 'common/Styles/TableProps.js'

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

  const submit = (id) => {
    submitProgressBar();

    deletePayment(id).then((response) => {
      populateTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Pago eliminado."
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
        </SweetAlert>
      );

      removeSubmitProgressBar();
    });
  }

  const warningWithConfirmAndCancelMessage = (id) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Por favor confirme eliminar pago"
        onConfirm={() => submit(id)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Eliminar"
        cancelBtnText="Cancelar"
        showCancel
      >
        Confirme por favor.
      </SweetAlert>
    );
  };

  const cancelDetele = () => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelado"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
      >
        Cancelado.
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

          let payDate = prop.payDate != null ? prop.payDate.split('T')[0] : '';
          let prepaidDate = prop.prepaidDate != null ? prop.prepaidDate.split('T')[0] : '';
          let transactionNumber = prop.transactionNumber ?? '';

          return {
            id: prop.id,
            rez_id: prop.rez.id,
            user: prop.rez.user,
            fullname: user.name + ' ' + user.lastname,
            confirmationNumber: prop.rez.confirmationNumber,
            transactionNumber: transactionNumber,
            prepaidDate: prepaidDate,
            payDate: payDate,
            total: prop.rez.total,
            feeTotal: prop.rez.feeTotal,
            feeAgency: prop.rez.feeAgency,
            feeUser: prop.rez.feeUser,
            actions: (
              <div className="actions-right">
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => {
                    warningWithConfirmAndCancelMessage(prop.id);
                  }}
                  color="danger"
                  className="remove"
                >
                  <Close />
                </Button>
              </div>
            )
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
          <GridContainer>
            <GridItem xs={5} sm={5} md={5}>
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
            <GridItem xs={7} sm={7} md={7} lg={7}>
              <CSVLink data={tableDataByUser} >Download Data</CSVLink>
            </GridItem>
          </GridContainer>
          <GridItem xs={12}>
            <ReactTable
              data={tableDataByUser}
              filterable
              defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
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
                  Header: "C. Total",
                  accessor: "feeTotal"
                },
                {
                  Header: "C. Emp.",
                  accessor: "feeUser"
                },
                {
                  Header: "C. Agencia",
                  accessor: "feeAgency"
                },
                {
                  Header: "Eliminar",
                  accessor: "actions",
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
          </GridItem>
        </CardBody>
      </Card>
    </GridContainer>
  );
}