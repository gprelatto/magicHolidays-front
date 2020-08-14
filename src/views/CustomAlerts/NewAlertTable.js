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
import FormLabel from "@material-ui/core/FormLabel";
import Datetime from "react-datetime";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, editNotification, deleteNotification, redirectToUnforbidden } from 'common/Request/Requests.js'
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function AlertsTable(props) {
    const { t, i18n } = useTranslation();

    const classes = useStyles();
    const alertClasses = useAlertStyles();

    const [tableData, setTableData] = React.useState([]);
    const [notificationsData, setNotificationsData] = React.useState('');
    const [showEdit, setShowEdit] = React.useState(false);
    const [notification, setNotification] = React.useState({});
    const [alert, setAlert] = React.useState(null);
    const [bar, setBar] = React.useState(null);
    const [editBar, setEditBar] = React.useState(null);

    useEffect(() => {
        populateTable();
    }, [])

    const submitEditButton = () => {
        editProgressBar();

        let data = {
            id: notification.id,
            message: notification.message,
            date_to: new Date(notification.date_to),
            date_from: new Date(notification.date_from),
        }

        editNotification(data).then((response) => {
            if (response.data.code === 403) {
                redirectToUnforbidden(props);
            }
            populateTable();
            setShowEdit(false);
            removeEditProgressBar();
        });
    }

    const warningWithConfirmAndCancelMessage = (not) => {
        setAlert(
            <SweetAlert
                warning
                style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
                title={t('common.alert.areUSure')}
                onConfirm={() => successDelete(not)}
                onCancel={() => cancelDetele()}
                confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
                cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
                confirmBtnText={t('common.alert.confirmDelete')}
                cancelBtnText={t('common.alert.cancel')}
                showCancel
            >
                Confirmar eliminar alerta
            </SweetAlert>
        );
    };

    const successDelete = (not) => {
        deleteNotification(not).then((response) => {
            populateTable();
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

    const populateTable = () => {
        progressBar();
        getRequest('notifications').then((response) => {
            if (response.data.code === 403) {
                redirectToUnforbidden(props);
            }
            let responseData = response.data.data.map(r => {
                return {
                    id: r.id,
                    message: r.message,
                    date_from: r.date_from != null ? r.date_from.split('T')[0] : '',
                    date_to: r.date_to != null ? r.date_to.split('T')[0] : ''
                }
            });

            setNotificationsData(responseData);
            let data = responseData.map((prop, key) => {
                return {
                    id: prop.id,
                    message: prop.message,
                    date_from: prop.date_from,
                    date_to: prop.date_to,
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
                                    let not = responseData.find(f => f.id === prop.id);
                                    if (not != null) {
                                        setNotification({
                                            id: not.id,
                                            message: not.message,
                                            date_from: not.date_from,
                                            date_to: not.date_to
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
                                    let not = responseData.find(f => f.id === prop.id);
                                    if (not != null) {
                                        warningWithConfirmAndCancelMessage(not);
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
            {!showEdit ?
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
                                defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                                columns={[
                                    {
                                        Header: t('common.table.header.message'),
                                        accessor: "message"
                                    },
                                    {
                                        Header: t('common.table.header.date_from'),
                                        accessor: "date_from"
                                    },
                                    {
                                        Header: t('common.table.header.date_to'),
                                        accessor: "date_to"
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
                            <h4 className={classes.cardIconTitle}>Editar Alerta</h4>
                        </CardHeader>
                        <CardBody>
                            <form>
                                <GridContainer>
                                    <GridItem xs={4} sm={4} md={4} lg={4}>
                                        <FormLabel className={classes.labelHorizontal}>
                                            Descripcion
                                </FormLabel>
                                    </GridItem>
                                    <GridItem xs={4} sm={4} md={4} lg={8}>
                                        <CustomInput
                                            id='description'
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                type: 'textarea',
                                                rows: 5,
                                                cols: 5,
                                                onChange: event => {
                                                    let input = event.target.value;
                                                    setNotification(prev => ({
                                                        ...prev,
                                                        message: input
                                                    }))
                                                },
                                                value: notification.message
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>
                                <GridContainer>
                                    <GridItem xs={4} sm={4} md={4} lg={4}>
                                        <FormLabel className={classes.labelHorizontal}>
                                            Fecha desde
                                </FormLabel>
                                    </GridItem>
                                    <GridItem xs={4} sm={4} md={4} lg={8}>
                                        <Datetime
                                            dateFormat="YYYY-MM-DD"
                                            timeFormat={false}
                                            closeOnSelect={true}
                                            inputProps={{
                                                placeholder: "Seleccione fecha desde",
                                            }}
                                            onChange={(event) => {
                                                let year = event._d.getFullYear().toString();
                                                let month = (event._d.getMonth()+1) < 10 ? '0' + (event._d.getMonth()+1) : (event._d.getMonth()+1).toString();
                                                let day = event._d.getDate();

                                                setNotification(prev => ({
                                                    ...prev,
                                                    date_from: year + '-' + month + '-' + day
                                                }))
                                            }}
                                            className={classes.select}
                                            value={notification.date_from}
                                        />
                                    </GridItem>
                                </GridContainer>

                                <GridContainer>
                                    <GridItem xs={4} sm={4} md={4} lg={4}>
                                        <FormLabel className={classes.labelHorizontal}>
                                            Fecha hasta
                                </FormLabel>
                                    </GridItem>
                                    <GridItem xs={4} sm={4} md={4} lg={8}>
                                        <Datetime
                                            dateFormat="YYYY-MM-DD"
                                            timeFormat={false}
                                            closeOnSelect={true}
                                            inputProps={{
                                                placeholder: "Seleccione fecha hasta",
                                            }}
                                            onChange={(event) => {
                                                let year = event._d.getFullYear().toString();
                                                let month = (event._d.getMonth()+1) < 10 ? '0' + (event._d.getMonth()+1) : (event._d.getMonth()+1).toString();
                                                let day = event._d.getDate();

                                                setNotification(prev => ({
                                                    ...prev,
                                                    date_to: year + '-' + month + '-' + day
                                                }))
                                            }}
                                            className={classes.select}
                                            value={notification.date_to}
                                        />
                                    </GridItem>
                                </GridContainer>

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