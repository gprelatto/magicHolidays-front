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
    populateTable();
  }, [])
  
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
  
  const populateTable = () => {
    progressBar();
    getRequest('monthlyTotals').then((response) => {
      if(response.data.code === 403) {
        redirectToUnforbidden(props);
      }
      let responseData = response.data.data;

      setSuppliersData(responseData);
      let data = response.data.data.map((prop, key) => {
        return {
            year: prop.year,
            month: prop.month,
            totalsales: prop.totalsales,
            totalfees: prop.totalfees,
            totalfeeagency: prop.totalfeeagency,
            totalfeeuser: prop.totalfeeuser,
            totaltopay: prop.totaltopay,
            totalpaid: prop.totalpaid,
            totaltocollect: prop.totaltocollect,
            totalcancelled: prop.totalcancelled
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
      <GridItem xs={12}>
        {bar}
        <Card>
          <CardHeader color="rose" icon>
            <CardIcon color="rose">
              <Assignment />
            </CardIcon>
            <h4 className={classes.cardIconTitle}>{t('monthlyTotals.list.title')}</h4>
          </CardHeader>
          <CardBody>
          <ReactTable
              data={tableData}
              filterable
              defaultFilterMethod={(filter, row) =>{ return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
              columns={[
                {
                  Header: t('monthlyTotals.table.header.year'),
                  accessor: "year"
                },
                {
                  Header: t('monthlyTotals.table.header.month'),
                  accessor: "month"
                },
                {
                  Header: t('monthlyTotals.table.header.totalsales'),
                  accessor: "totalsales"
                },
                {
                  Header: t('monthlyTotals.table.header.totalfees'),
                  accessor: "totalfees"
                },
                {
                  Header: t('monthlyTotals.table.header.totalfeeagency'),
                  accessor: "totalfeeagency"
                },
                {
                  Header: t('monthlyTotals.table.header.totalfeeuser'),
                  accessor: "totalfeeuser"
                },
                {
                  Header: t('monthlyTotals.table.header.totaltopay'),
                  accessor: "totaltopay"
                },
                {
                  Header: t('monthlyTotals.table.header.totalpaid'),
                  accessor: "totalpaid"
                },
                {
                  Header: t('monthlyTotals.table.header.totaltocollect'),
                  accessor: "totaltocollect"
                },
                {
                  Header: t('monthlyTotals.table.header.totalcancelled'),
                  accessor: "totalcancelled"
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