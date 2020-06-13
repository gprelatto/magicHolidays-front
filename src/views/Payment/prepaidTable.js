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

export default function PrepaidTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  let filteredDataRef = React.useRef([]);
  let selectedReservationsRef = React.useRef([]);

  const [tableData, setTableData] = React.useState([]);

  const [prepayDate, setPrepayDate] = React.useState(new Date());

  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedReservations, setSelectedReservations] = React.useState([]);
 
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
      prepaidDate: prepayDate,
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

    getRequest('prepay').then(prepayResponse => {
      let prepayResponseData = prepayResponse.data;

      if(prepayResponseData.code === 403) {
        redirectToUnforbidden(props);
      }
      
      getRequest('users').then((response) => {
        let users = response.data;
        
        if (users.code === 403) {
          redirectToUnforbidden(props);
        }

        let data = prepayResponseData.data.map((prop, key) => {
            let usr = users.data.find(f => f.id === prop.user);
            prop.user = usr;

            return {
                id: prop.id,
                name: usr.name,
                lastname: usr.lastname,
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

        setTableData(data);
        removeProgressBar();
      });
    })

    // }).catch(e => {
    //   props.history.push('/auth/forbidden')
    // });
    }


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
                Mark as prepaid all filtered reservations
            </Button>
            <Button color="info"
                className={classes.marginRight}
                onClick={() => {
                  let ids = selectedReservationsRef.current.map((i, k) => {
                    return i.id;
                  });
                  setSelectedReservations(ids);
                  setShowEdit(true);
                }} >
                Mark as prepaid checked reservations
            </Button>
            {bar}
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Reservations unpaid</h4>
              </CardHeader>
              <CardBody>
              <ReactTable
                  data={tableData}
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
                        Header: "Mark as Prepaid",
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