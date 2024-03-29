import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

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
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, editSupplier, deleteSupplier, redirectToUnforbidden } from 'common/Request/Requests.js'
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function SupplierTable(props) {
  const { t, i18n } = useTranslation();

  const classes = useStyles();
  const alertClasses = useAlertStyles();

  const [tableData, setTableData] = React.useState([]);
  const [suppliersData, setSuppliersData] = React.useState('');
  const [showEdit, setShowEdit] = React.useState(false);
  const [supplier, setSupplier] = React.useState({});
  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);

  useEffect(() => {
    populateSuppliersTable();
  }, [])

  const submitEditButton = () => {
    editProgressBar();
    editSupplier(supplier).then((response) => {
      if(response.data.code === 403) {
        redirectToUnforbidden(props);
      }
      populateSuppliersTable();
      setShowEdit(false);
      removeEditProgressBar();
    });
  }

  const warningWithConfirmAndCancelMessage = (sup) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
        title={t('common.alert.areUSure')}
        onConfirm={() => successDelete(sup)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText={t('common.alert.confirmDelete')}
        cancelBtnText={t('common.alert.cancel')}
        showCancel
      >
        {t('supplier.list.alert.confirmDelete')}
      </SweetAlert>
    );
  };

  const successDelete = (sup) => {
    deleteSupplier(sup).then((response) => {
      populateSuppliersTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
          title={t('common.alert.deleted')}
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          {t('common.alert.deleted')}
        </SweetAlert>
      );
    })
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
        {t('common.alert.canceled')}
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
  
  const populateSuppliersTable = () => {
    progressBar();
    getRequest('suppliers').then((response) => {
      if(response.data.code === 403) {
        redirectToUnforbidden(props);
      }
      let responseData = response.data.data;

      setSuppliersData(responseData);
      let data = response.data.data.map((prop, key) => {
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

    removeProgressBar();
    setTableData(data);

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
                <h4 className={classes.cardIconTitle}>{t('supplier.list.title')}</h4>
              </CardHeader>
              <CardBody>
              <ReactTable
                  data={tableData}
                  filterable
                  defaultFilterMethod={(filter, row) =>{ return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                  columns={[
                    {
                      Header: t('common.table.header.id'),
                      accessor: "id"
                    },
                    {
                      Header: t('common.table.header.description'),
                      accessor: "description"
                    },
                    {
                      Header: t('common.table.header.actions'),
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
                <h4 className={classes.cardIconTitle}>Edit Supplier</h4>
              </CardHeader>
              <CardBody>
                <form>
                  <CustomInput
                    labelText={t('supplier.form.name')}
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
                  <GridItem xs={12} sm={12} md={6}>
                      <div className={classes.cardContentRight}>
                        <Button color="primary" className={classes.marginRight} onClick={submitEditButton}>
                          {t('common.button.submit')}
                        </Button>
                        <Button color="primary" className={classes.marginRight} onClick={() => setShowEdit(false)}>
                          {t('common.button.returnToTable')}
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