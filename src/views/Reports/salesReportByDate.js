import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable from "react-table";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import AddAlert from "@material-ui/icons/AddAlert";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import Datetime from "react-datetime";

import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { postDetailedSales } from 'common/Request/Requests.js'
import getTrProps from 'common/Styles/TableProps.js'

import { useTranslation } from 'react-i18next';

import { CSVLink } from "react-csv";

const useStyles = makeStyles(styles);
const useFormStyles = makeStyles(formStyles);


export default function SalesReportByDate(props) {
    const { t, i18n } = useTranslation();

    const classes = useStyles();
    const formStyleClasses = useFormStyles();

    const [tableData, setTableData] = React.useState([]);
    const [bar, setBar] = React.useState(null);
    const [tr, setTR] = React.useState(false);

    const [dateFrom, setDateFrom] = React.useState('');
    const [dateTo, setDateTo] = React.useState('');

    const columns = [
        {
            Header: t('salesReport.table.header.name'),
            accessor: "name",
            width: 150
        },
        {
            Header: t('salesReport.table.header.lastname'),
            accessor: "lastname",
            width: 150
        },
        {
            Header: t('salesReport.table.header.confirmDate'),
            accessor: "confirmationDate",
        },
        {
            Header: t('salesReport.table.header.arrivalDate'),
            accessor: "arrivalDate"
        },
        {
            Header: t('salesReport.table.header.confirmNumber'),
            accessor: "confirmationNumber",
            width: 170
        },
        {
            Header: t('salesReport.table.header.supplier'),
            accessor: "supplier"
        },
        {
            Header: t('salesReport.table.header.category'),
            accessor: "category",
            width: 200
        },
        {
            Header: t('salesReport.table.header.product'),
            accessor: "product"
        },
        {
            Header: t('salesReport.table.header.total'),
            accessor: "total"
        },
        {
            Header: t('salesReport.table.header.feeTotal'),
            accessor: "totalfees"
        },
        {
            Header: t('salesReport.table.header.totalFeeAgency'),
            accessor: "totalfeeagency"
        },
        {
            Header: t('salesReport.table.header.feeUser'),
            accessor: "totalfeeuser"
        },
        {
            Header: t('salesReport.table.header.totalToPay'),
            accessor: "totaltopay"
        },
        {
            Header: t('salesReport.table.header.totalPaid'),
            accessor: "totalpaid"
        },
        {
            Header: t('salesReport.table.header.totalToCollect'),
            accessor: "totaltocollect"
        },
        {
            Header: t('salesReport.table.header.totalCancelled'),
            accessor: "totalcancelled"
        },
        {
            Header: t('salesReport.table.header.transactionNumber'),
            accessor: "transactionNumber"
        }

    ];

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
        if (dateFrom === ''
            || dateTo === '') {
            if (!tr) {
                setTR(true);
                setTimeout(function () {
                    setTR(false);
                }, 5000);
            }
        }
        else {
            if (dateFrom > dateTo) {
                if (!tr) {
                    setTR(true);
                    setTimeout(function () {
                        setTR(false);
                    }, 5000);
                }
            }
            else {
                progressBar();
                let data = {
                    dateFrom: dateFrom,
                    dateTo: dateTo
                }

                postDetailedSales(data).then((response) => {
                    let responseData = response.data.data;

                    let tableData = responseData.map((prop, key) => {
                        return {
                            name: prop.name,
                            lastname: prop.lastname,
                            confirmationDate: prop.confirmationDate ? prop.confirmationDate.split('T')[0] : '',
                            arrivalDate: prop.arrivalDate ? prop.arrivalDate.split('T')[0] : '',
                            confirmationNumber: prop.confirmationNumber,
                            supplier: prop.supplier,
                            category: prop.category,
                            product: prop.product,
                            total: prop.total,
                            totalfees: prop.totalfees,
                            totalfeeagency: prop.totalfeeagency,
                            totalfeeuser: prop.totalfeeuser,
                            totaltopay: prop.totaltopay,
                            totalpaid: prop.totalpaid,
                            totaltocollect: prop.totaltocollect,
                            totalcancelled: prop.totalcancelled,
                            transactionNumber: prop.transactionNumber ?? ''
                        }
                    });

                    removeProgressBar();
                    setTableData(tableData);
                });
            }
        }
    };

    return (
        <GridContainer>
            {
                <GridItem xs={12} sm={12} md={12} lg={12}>
                    {bar}
                    <Card>
                        <CardHeader color="rose" icon>
                            <CardIcon color="rose">
                                <Assignment />
                            </CardIcon>
                            <h4 className={classes.cardIconTitle}> {t('salesReport.table.title')}</h4>
                        </CardHeader>
                        <CardBody>
                            <GridContainer>
                                <GridItem xs={2} sm={2} md={2}>
                                    <Datetime
                                        dateFormat="YYYY-MM-DD"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        inputProps={{
                                            placeholder: "Fecha Desde"
                                        }}
                                        onChange={(event) => {
                                            setDateFrom(event._d);
                                        }}
                                        className={formStyleClasses.select}
                                        value={dateFrom}
                                    />
                                </GridItem>
                                <GridItem xs={1} sm={1} md={1}>
                                    <></>
                                </GridItem>
                                <GridItem xs={2} sm={2} md={2}>
                                    <Datetime
                                        dateFormat="YYYY-MM-DD"
                                        timeFormat={false}
                                        closeOnSelect={true}
                                        inputProps={{
                                            placeholder: "Fecha Hasta"
                                        }}
                                        onChange={(event) => {
                                            setDateTo(event._d);
                                        }}
                                        className={formStyleClasses.select}
                                        value={dateTo}
                                    />
                                </GridItem>
                                <GridItem xs={1} sm={1} md={1}>
                                    <></>
                                </GridItem>
                                <GridItem xs={2} sm={2} md={2}>
                                    <Button
                                        color="rose"
                                        onClick={() => populateTable()}
                                    >
                                        {t('common.button.submit')}
                                    </Button>
                                </GridItem>
                                <GridItem xs={1} sm={1} md={1}>
                                    <></>
                                </GridItem>
                                <GridItem xs={1} sm={1} md={1} lg={1}>
                                    <CSVLink data={tableData} >{t('common.download')}</CSVLink>
                                </GridItem>
                            </GridContainer>
                            <GridContainer>
                                <GridItem xs={5} sm={5} md={5}>
                                    <br />
                                </GridItem>
                            </GridContainer>
                            <ReactTable
                                data={tableData}
                                filterable
                                defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                                columns={columns}
                                defaultPageSize={10}
                                showPaginationTop
                                showPaginationBottom={false}
                                getTrProps={getTrProps}
                                className="-striped -highlight" S
                            />
                        </CardBody>
                        <Snackbar
                            place="tr"
                            color="danger"
                            icon={AddAlert}
                            message={t('salesReport.table.alert')}
                            open={tr}
                            closeNotification={() => setTR(false)}
                            close
                        />
                    </Card>
                </GridItem>
            }
        </GridContainer>
    );
}