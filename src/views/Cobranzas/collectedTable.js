import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable from "react-table";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, redirectToUnforbidden } from 'common/Request/Requests.js'


import { useTranslation } from 'react-i18next';

import {CSVLink} from "react-csv";

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);


export default function RezTable(props) {
  const { t, i18n } = useTranslation();
  
  const [reservationsData, setReservationsData] = React.useState([]);
  const [toCollectTotal, setToCollect] = React.useState(0);

  const classes = useStyles();
  const alertClasses = useAlertStyles();
  
  const columns = [
    {
      Header:  t('cobranzas.table.header.fullname'),
      accessor: "userFullName",
      width: 150
    },
    {
      Header:  t('cobranzas.table.header.confirmDate'),
      accessor: "confirmationDate",
    },
    {
      Header:  t('cobranzas.table.header.arrivalDate'),
      accessor: "arrivalDate"
    },    
    {
      Header:  t('cobranzas.table.header.supplier'),
      accessor: "supplier"
    },
    {
      Header:  t('cobranzas.table.header.category'),
      accessor: "category",
      width: 200
    },
    {
      Header:  t('cobranzas.table.header.product'),
      accessor: "product"
    },
    {
      Header:  t('cobranzas.table.header.total'),
      accessor: "total"
    },    
    {
      Header:  t('cobranzas.table.header.confirmNumber'),
      accessor: "confirmationNumber",
      width: 170
    }, 
    {
      Header:  t('cobranzas.table.header.feeTotal'),
      accessor: "feeTotal"
    },
    {
      Header:  t('cobranzas.table.header.feeUser'),
      accessor: "feeUser"
    },
    {
      Header:  t('cobranzas.table.pago.header.payDate'),
      accessor: "payDate"
    },
    {
      Header:  t('cobranzas.table.pago.header.transactionNumber'),
      accessor: "transactionNumber"
    }

  ];

  const [tableData, setTableData] = React.useState([]);

  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);

  useEffect(() => {
    populateTable();
  }, [])

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

  const populateTable = () => {
    progressBar();
    getRequest('userPaid').then((reservationsResponse) => {
        if(reservationsResponse.data.code === 403) {
          redirectToUnforbidden(props);
        }
        let reservationsResponseData = reservationsResponse.data.data;
        setReservationsData(reservationsResponseData);
        
        let data = [];
        let totalToCollect = 0 ;

        reservationsResponseData.forEach(rez => {
          let confirmationDate = rez.confirmationDate != null ? rez.confirmationDate.split('T')[0] : '';
          let arrivalDate = rez.arrivalDate != null ? rez.arrivalDate.split('T')[0] : '';
          let payDate = rez.payDate != null ? rez.payDate.split('T')[0] : '';
          totalToCollect = totalToCollect + rez.feeUser;
          data.push(
          {
              id: rez.id,
              userFullName: rez.name + ' ' + rez.lastname,
              supplier: rez.supplier,
              category: rez.category,
              product: rez.product,
              arrivalDate: arrivalDate,
              confirmationNumber: rez.confirmationNumber,
              confirmationDate: confirmationDate,
              total: rez.total,
              feeTotal: rez.feeTotal,
              feeUser: rez.feeUser,
              payDate: payDate,
              transactionNumber: rez.transactionNumber
          });
      })

      let tableData = data.map((prop, key) => {
          return {
              id: prop.id,
              supplier: prop.supplier,
              category: prop.category,
              product: prop.product,
              confirmationNumber: prop.confirmationNumber,
              confirmationDate: prop.confirmationDate,
              arrivalDate: prop.arrivalDate,
              userFullName: prop.userFullName,
              total: prop.total,
              feeTotal: prop.feeTotal,
              feeUser: prop.feeUser,
              payDate: prop.payDate,
              transactionNumber: prop.transactionNumber
          }
      });

      removeProgressBar();
      setTableData(tableData);
      setToCollect(totalToCollect);
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });
  }

  return (
    <GridContainer>
      {alert}
      {
          <GridItem xs={12}>
            {bar}
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={classes.cardIconTitle}> {t('cobranzas.table.title')} {Math.round(toCollectTotal,2)}</h4>
              </CardHeader>
              <CardBody>
              <CSVLink data={tableData} >Download Data</CSVLink>              
              <ReactTable
                  data={tableData}
                  filterable
                  defaultFilterMethod={(filter, row) =>{ return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                  columns={columns}
                  defaultPageSize={10}
                  showPaginationTop
                  showPaginationBottom={false}
                  className="-striped -highlight"S
                />
              </CardBody>
            </Card>
          </GridItem>
      }
    </GridContainer>
  );
}
