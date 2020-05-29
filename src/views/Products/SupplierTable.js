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

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, editSupplier, deleteSupplier } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function SupplierTable() {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  const [tableData, setTableData] = React.useState([]);
  const [suppliersData, setSuppliersData] = React.useState('');
  const [showEdit, setShowEdit] = React.useState(false);
  const [supplier, setSupplier] = React.useState({});
  const [alert, setAlert] = React.useState(null);

  useEffect(() => {
    populateSuppliersTable();
  }, [])

  const submitEditButton = () => {
    editSupplier(supplier).then((response) => {
      populateSuppliersTable();
      setShowEdit(false);
    });
  }

  const warningWithConfirmAndCancelMessage = (sup) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(sup)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirm Delete"
        cancelBtnText="Cancel"
        showCancel
      >
        Please confirm deleting supplier.
      </SweetAlert>
    );
  };

  const successDelete = (sup) => {
    deleteSupplier(sup).then((response) => {
      populateSuppliersTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          Supplier deleted.
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
        Canceled deleting supplier.
      </SweetAlert>
    );
  };
  
  const hideAlert = () => {
    setAlert(null);
  };

  const populateSuppliersTable = () => {
    getRequest('suppliers').then((response) => {
      let responseData = response.data.results;

      setSuppliersData(responseData);
      let data = response.data.results.map((prop, key) => {
        return {
            id: prop.id,
            description: prop.description,
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
                            let sup = responseData.find(f => f.id === prop.id);
                            if (sup != null) {
                              setSupplier({
                                id: sup.id,
                                description: sup.description
                              });
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
                            let sup = responseData.find(f => f.id === prop.id);
                            if (sup != null) {
                              warningWithConfirmAndCancelMessage(sup);
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

      setTableData(data);
    });
  }

  return (
    <GridContainer>
      {alert}
      { !showEdit ?
          <GridItem xs={12}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Suppliers</h4>
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
                      Header: "Description",
                      accessor: "description"
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
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <MailOutline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Edit Supplier</h4>
              </CardHeader>
              <CardBody>
                <form>
                  <CustomInput
                    labelText="Supplier Name"
                    id="description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "text",
                      onChange: event => {
                        setSupplier({
                            id: supplier.id,
                            description: event.target.value
                        })
                      },
                      value: supplier.description
                    }}
                  />
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
