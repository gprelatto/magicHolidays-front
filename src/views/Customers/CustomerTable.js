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
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, editCustomer, deleteCustomer } from 'common/Request/Requests.js'
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function CustomerTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  const { t, i18n } = useTranslation();

  const [tableData, setTableData] = React.useState([]);
  const [customersData, setCustomersData] = React.useState('');
  const [countryData, setCountryData] = React.useState('');
  const [showEdit, setShowEdit] = React.useState(false);
  
  const [customerToEdit, setCustomerToEdit] = React.useState({});
  const [countryId, setCountryId] = React.useState('');
  
  
  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);

  useEffect(() => {
    populateCustomersTable();
  }, [])

  const submitEditButton = () => {
    editProgressBar();
    editCustomer(customerToEdit).then((response) => {
        populateCustomersTable();
        setShowEdit(false);
        removeEditProgressBar();
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });;
  }

  const warningWithConfirmAndCancelMessage = (cus) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title={t('common.alert.areUSure')}
        onConfirm={() => successDelete(cus)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText={t('common.alert.confirmDelete')}
        cancelBtnText={t('common.alert.cancel')}
        showCancel
      >
        {t('customer.list.alert.confirm')}
      </SweetAlert>
    );
  };

  const successDelete = (cus) => {
    deleteCustomer(cus).then((response) => {
        populateCustomersTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          {t('customer.list.alert.deleted')}
        </SweetAlert>
      );
    })
  };

  const cancelDetele = () => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title={t('common.alert.canceled')}
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
      >
        {t('customer.list.alert.canceled')}
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

  const populateCustomersTable = () => {
    progressBar();
    getRequest('customers').then((customersResponse) => {
        let customersResponseData = customersResponse.data.data;

        setCustomersData(customersResponseData);
        getRequest('countries').then((countriesResponse) => {
            let countriesResponseData = countriesResponse.data.data;
            let data = [];
            setCountryData(countriesResponseData);

            customersResponseData.forEach(element => {
                let country = countriesResponseData.find(c => c.id === element.country)

                if(country != null) {
                    data.push(
                        {
                            id: element.id,
                            fullname: element.fullname,
                            mail: element.mail,
                            phone: element.phone,
                            country: element.country,
                            countryDescription: country.description
                        }
                    );
                }
            });
            
            let tableData = data.map((prop, key) => {
                return {
                    id: prop.id,
                    fullname: prop.fullname,
                    mail: prop.mail,
                    phone: prop.phone,
                    countryDescription: prop.countryDescription,
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
                                    let cus = data.find(f => f.id === prop.id)
                                    if (cus != null) {
                                        setCustomerToEdit(cus);
                                        setCountryId(cus.country);
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
                                    let cus = data.find(f => f.id === prop.id);
                                    if (cus != null) {
                                      warningWithConfirmAndCancelMessage(cus);
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
            
            setTableData(tableData);
            removeProgressBar();
        }).catch(e => {
          props.history.push('/auth/forbidden')
        });
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
                <h4 className={classes.cardIconTitle}>{t('customer.list.title')}</h4>
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
                        Header: t('common.table.header.fullName'),
                        accessor: "fullname"
                    },
                    {
                        Header: t('common.table.header.mail'),
                        accessor: "mail"
                    },
                    {
                        Header: t('common.table.header.phone'),
                        accessor: "phone"
                    },
                    {
                        Header: t('common.table.header.country'),
                        accessor: "countryDescription"
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
                <h4 className={classes.cardIconTitle}>{t('customer.list.edit.title')}</h4>
              </CardHeader>
              <CardBody>
                <form>
                    <CustomInput
                        labelText={t('customers.add.fullName')}
                        id="fullname"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setCustomerToEdit({
                                ...customerToEdit,
                                fullname: event.target.value
                            })
                        },
                        value: customerToEdit.fullname
                        }}
                    />
                    <CustomInput
                        labelText={t('customers.add.mail')}
                        id="mail"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setCustomerToEdit({
                                ...customerToEdit,
                                mail: event.target.value
                            })
                        },
                        value: customerToEdit.mail
                        }}
                    />
                    <CustomInput
                        labelText={t('customers.add.phone')}
                        id="phone"
                        formControlProps={{
                        fullWidth: true
                        }}
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setCustomerToEdit({
                                ...customerToEdit,
                                phone: event.target.value
                            })
                        },
                        value: customerToEdit.phone
                        }}
                    />
                    <InputLabel htmlFor="country-select" className={classes.selectLabel}>
                        {t('common.country')}
                    </InputLabel>
                    <Select
                        MenuProps={{
                            className: classes.selectMenu
                        }}
                        classes={{
                            select: classes.select
                        }}
                        value={countryId}
                        onChange={e => {
                            let id = e.target.value;
                            setCountryId(id);

                            let c = countryData.find(s => s.id === id);
                            setCustomerToEdit({
                                ...customerToEdit,
                                country: c.id,
                                countryDescription: c.description
                            })
                        }}
                        inputProps={{
                            name: "countrySelect",
                            id: "country-select"
                        }}  
                        >   
                        {countryData.map((c, i) => {     
                            return (
                                <MenuItem
                                    key={i}
                                    classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                    }}
                                    value={c.id}
                                    >
                                    {c.description}
                                </MenuItem>
                            ) 
                        })}
                    </Select>
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
