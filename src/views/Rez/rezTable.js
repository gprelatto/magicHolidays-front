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

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

import Datetime from "react-datetime";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, editRez, deleteRez, redirectToUnforbidden } from 'common/Request/Requests.js'


import { useTranslation } from 'react-i18next';

import {CSVLink} from "react-csv";

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);


export default function RezTable(props) {
  const { t, i18n } = useTranslation();

  const classes = useStyles();
  const alertClasses = useAlertStyles();
  
  const columns = [
    {
      Header:  t('rez.table.header.confirmDate'),
      accessor: "confirmationDate",
    },
    {
      Header:  t('rez.table.header.fullname'),
      accessor: "customerFullName",
      width: 150
    },
    {
      Header:  t('rez.table.header.arrivalDate'),
      accessor: "arrivalDate"
    },    
    {
      Header:  t('rez.table.header.supplier'),
      accessor: "supplier"
    },
    {
      Header:  t('rez.table.header.category'),
      accessor: "productCategory",
      width: 200
    },
    {
      Header:  t('rez.table.header.product'),
      accessor: "product"
    },
    {
      Header:  t('rez.table.header.total'),
      accessor: "total"
    },    
    {
      Header:  t('rez.table.header.confirmNumber'),
      accessor: "confirmationNumber",
      width: 170
    }, 
    {
      Header:  t('rez.table.header.feeTotal'),
      accessor: "feeTotal"
    },
    {
      Header:  t('rez.table.header.feeUser'),
      accessor: "feeUser"
    },
    {
      Header:  t('rez.table.header.feeAgency'),
      accessor: "feeAgency"
    },
    {
      Header:  t('rez.table.header.deleted'),
      accessor: "deleted_at",
      id: "deleted_at",
      isVisible: false
    },
    {
      Header:  t('rez.table.header.actions'),
      accessor: "actions",
      sortable: false,
      filterable: false
    }
  ];

  const [customers, setCustomers] = React.useState();
  const [selectedCustomer, setSelectedCustomer] = React.useState({
    mail: '',
    fullname: '',
    phone: ''
  });

  const [permissions, setPermissions] = React.useState({})

  const [suppliers, setSuppliers] = React.useState([]);
  const [supplierId, setSupplierId] = React.useState(0);

  const [isProductCategoryEnabled, setIsProductCategoryEnabled] = React.useState(true);
  const [isProductEnabled, setIsProductEnabled] = React.useState(true);
  const [filteredProductCategories, setFilteredProductCategories] = React.useState([]);

  const [rezData, setRezData] = React.useState();
  const [tableData, setTableData] = React.useState([]);
  const [reservationsData, setReservationsData] = React.useState([]);
  const [productCategoriesData, setProductCategoriesData] = React.useState([]);
  const [productsData, setProductsData] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [productId, setProductId] = React.useState();

  const [total, setTotal] = React.useState(0);
  const [feeTotal, setFeeTotal] = React.useState(0);
  const [feeAgency, setFeeAgency] = React.useState(0);
  const [feeUser, setFeeUser] = React.useState(0);

  const [confirmationNumber, setConfirmationNumber] = React.useState('');
  const [confirmationDate, setConfirmationDate] = React.useState('');
  const [arrivalDate, setArrivalDate] = React.useState('');

  const [productToEdit, setProductToEdit] = React.useState({});
  const [productCategoryId, setProductCategoryId] = React.useState('');

  const [selectedCustomerId, setSelectedCustomerId] = React.useState('');

  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);

  const [rezEditId, setRezEditId] = React.useState(0);
  const [rezToEdit, setRezToEdit] = React.useState(null);
  const [showEdit, setShowEdit] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const loading = open && customers.length === 0;

  const [tableDataByUser, setTableDataByUser] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState();
  const [openAgent, setAgentOpen] = React.useState(false);
  const loadingAgent = openAgent && users.length === 0;

  useEffect(() => {
    populateProductsTable();

    setPermissions(JSON.parse(localStorage.getItem("auth")))
  }, [])

  useEffect(() => {
    let filteredData = tableData.filter(f => f.user === selectedUser.id)
    
    setTableDataByUser(filteredData);
  }, [selectedUser]);

  useEffect(() => {
    if(rezToEdit !== null) {
      let cus = customers.find(c => c.id === rezToEdit.customer);

      setSelectedCustomer({
        id: cus.id,
        mail: cus.mail,
        fullname: cus.fullname,
        phone: cus.phone
      });

      setSupplierId(rezToEdit.supplierId);

      let productCategories = productCategoriesData.filter(p => p.supplier == rezToEdit.supplierId || p.supplier === 0);
      setFilteredProductCategories(productCategories);
      setProductCategoryId(rezToEdit.prodCategoryId);

      let products = productsData.filter(p => p.product_category == rezToEdit.prodCategoryId || p.id === 0);
      setFilteredProducts(products);
      setProductId(rezToEdit.product)

      setTotal(rezToEdit.total);
      setFeeTotal(rezToEdit.feeTotal);

      setConfirmationNumber(rezToEdit.confirmationNumber);
      setConfirmationDate(rezToEdit.confirmationDate);
      setArrivalDate(rezToEdit.arrivalDate);

      setShowEdit(true);
    }
  }, [rezToEdit]);

  useEffect(() => {
    if(feeTotal !== 0) {
        setFeeAgency((feeTotal * 0.3).toFixed(2));
        setFeeUser((feeTotal * 0.7).toFixed(2));
    }
  }, [feeTotal]);

  const submitEditButton = () => {
    let rez = {
      id: rezEditId,
      confirmationNumber: confirmationNumber,
      confirmationDate: confirmationDate + 'T03:00:00Z',
      arrivalDate: arrivalDate + 'T03:00:00Z',
      total: total,
      feeTotal: feeTotal,
      feeAgency: feeAgency,
      feeUser: feeUser,
      product: productId,
      customer: selectedCustomer.id,
      user: rezToEdit.user
    }

    editRez(rez).then((response) => {
        populateProductsTable();
        setShowEdit(false);
    });
  }

  const warningWithConfirmAndCancelMessage = (id) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(id)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirm Cancelation"
        cancelBtnText="Cancel"
        showCancel
      >
        Please confirm deleting product.
      </SweetAlert>
    );
  };

  const successDelete = (id) => {
    deleteRez(id).then((response) => {
        if(response.data.code === 403) {
          redirectToUnforbidden(props);
        }
        populateProductsTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Reservation Canceled!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          Reservation canceled.
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
        Canceled deleting product.
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

  const populateProductsTable = () => {
    progressBar();
    getRequest('reservations').then((reservationsResponse) => {
        if(reservationsResponse.data.code === 403) {
          redirectToUnforbidden(props);
        }
        let reservationsResponseData = reservationsResponse.data.data;
        setReservationsData(reservationsResponseData);
        getRequest('productCategories').then((productCategoryResponse) => {
          if(productCategoryResponse.data.code === 403) {
            redirectToUnforbidden(props);
          }
            let productCategorieResponseData = productCategoryResponse.data.data;
            productCategorieResponseData.unshift(
              {
                  id: 0,
                  supplier: 0,
                  description: 'Please select a Product Category *'
              }
            );
            setProductCategoriesData(productCategorieResponseData);

            getRequest('products').then((productsResponse) => {
              if(productsResponse.data.code === 403) {
                redirectToUnforbidden(props);
              }
                let productsResponseData = productsResponse.data.data;
                productsResponseData.unshift(
                  {
                      id: 0,
                      product_category: 0,
                      description: 'Please select a Product *'
                  }
                );
                setProductsData(productsResponseData);

                getRequest('suppliers').then((suppliersResponse) => {
                  if(suppliersResponse.data.code === 403) {
                    redirectToUnforbidden(props);
                  }
                    let suppliersResponseData = suppliersResponse.data.data;
                    setSuppliers(suppliersResponseData);
                    getRequest('customers').then((customersResponse) => {
                      if(customersResponse.data.code === 403) {
                        redirectToUnforbidden(props);
                      }
                        let customersResponseData = customersResponse.data.data;
                        setCustomers(customersResponseData);
                        getRequest('users').then((usersResponse) => {
                          if(usersResponse.data.code === 403) {
                            redirectToUnforbidden(props);
                          }
                            let usersResponseData = usersResponse.data.data;

                            let agents = usersResponseData.map(prop => {
                              return {
                                id: prop.id,
                                fullname: prop.name + ' ' + prop.lastname
                              }
                            })

                            setUsers(agents);
                            let data = [];

                            reservationsResponseData.forEach(rez => {
                                let product = productsResponseData.find(p => p.id === rez.product);
                                let prodCategory = productCategorieResponseData.find(pc => pc.id === product.product_category);
                                let sup = suppliersResponseData.find(s => prodCategory.supplier === s.id);
                                let cus = customersResponseData.find(c => c.id === rez.customer);
                                let user = usersResponseData.find(u => u.id === rez.user);
                                let confirmationDate = rez.confirmationDate != null ? rez.confirmationDate.split('T')[0] : '';
                                let arrivalDate = rez.arrivalDate != null ? rez.arrivalDate.split('T')[0] : '';
        
                                data.push(
                                {
                                    id: rez.id,
                                    product: rez.product,
                                    prodDescription: product.description,
                                    prodCategoryId: prodCategory.id,
                                    prodCategoryDesc: prodCategory.description,
                                    supplierId: sup.id,
                                    supplierDescription: sup.description,
                                    customer: rez.customer,
                                    customerFullName: cus.fullname,
                                    customerMail: cus.mail,
                                    user: rez.user,
                                    userFullName: user.name + ' ' + user.lastname,
                                    arrivalDate: arrivalDate,
                                    confirmationNumber: rez.confirmationNumber,
                                    confirmationDate: confirmationDate,
                                    total: rez.total,
                                    feeTotal: rez.feeTotal,
                                    feeAgency: rez.feeAgency,
                                    feeUser: rez.feeUser,
                                    deleted_at: rez.deleted_at
                                });
                            })

                            setRezData(data);
        
                            let tableData = data.map((prop, key) => {
                                return {
                                    id: prop.id,
                                    product: prop.prodDescription,
                                    productCategory: prop.prodCategoryDesc,
                                    supplier: prop.supplierDescription,
                                    confirmationNumber: prop.confirmationNumber,
                                    confirmationDate: prop.confirmationDate,
                                    arrivalDate: prop.arrivalDate,
                                    customer: prop.customerMail,
                                    customerFullName: prop.customerFullName,
                                    total: prop.total,
                                    feeTotal: prop.feeTotal,
                                    feeAgency: prop.feeAgency,
                                    feeUser: prop.feeUser,
                                    deleted_at: prop.deleted_at,
                                    user: prop.user.id,
                                    actions: (
                                      <div className="actions-right">
                                            <Button
                                                round
                                                justIcon
                                                simple
                                                color="success"
                                                className="edit"
                                                key={key}
                                                onClick={() => {
                                                    let rez = data.find(f => f.id === prop.id)
                                                    if (rez != null) {
                                                        setRezToEdit(rez);
                                                        setSelectedCustomerId(rez.customer);
                                                        setRezEditId(rez.id);
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
                                                    warningWithConfirmAndCancelMessage(prop.id);
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
                            setTableDataByUser(tableData);
                            setTableData(tableData);
                        })
                    })
                })
          }).catch(e => {
            props.history.push('/auth/forbidden')
          });
      }).catch(e => {
        props.history.push('/auth/forbidden')
      });
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });
  }

  const getTrProps = (state, rowInfo, instance) => {
    if (rowInfo) {
      return {
        style: {
          background: rowInfo.row.deleted_at === null ? '' : '#ff6666',
          border: "solid 1px black",
          width: '100%',
          height: '100%',
        }
      }
    }
    return {};
  }

  return (
    <GridContainer>
      {alert}
      { !showEdit ?
        <>
          { permissions.user_type === 1 ?
          <GridItem xs={12} sm={12} md={6}>
            <Autocomplete
                id="agent-box"
                options={users}
                getOptionLabel={(option) => option.fullname}
                onChange={(event, newValue) => {
                    if(newValue !== null)
                        setSelectedUser(newValue);
                    else
                      setTableDataByUser(tableData)
                }}
                open={openAgent}
                onOpen={() => {
                    setAgentOpen(true);
                }}
                onClose={() => {
                    setAgentOpen(false);
                }}
                loading={loadingAgent}
                style={{ width: 300 }}
                renderInput={(params) => (<TextField {...params} 
                    label="Seleccionar agente"
                    variant="outlined" 
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                            {loadingAgent ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                        }}
                    />)}
            />
            </GridItem> : <></> }
            <GridItem xs={12}>
              {bar}
              <Card>
                <CardHeader color="rose" icon>
                  <CardIcon color="rose">
                    <Assignment />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Reservaciones</h4>
                </CardHeader>
                <CardBody>
                <CSVLink data={tableDataByUser} >Download Data</CSVLink>              
                <ReactTable
                    data={tableDataByUser}
                    filterable
                    defaultFilterMethod={(filter, row) =>{ return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                    columns={columns}
                    defaultPageSize={10}
                    showPaginationTop
                    showPaginationBottom={false}
                    className="-striped -highlight"
                    getTrProps={getTrProps}
                    getTdProps={(state, row, col, instance) => ({
                      
                  })}
                    initialState={{
                      hiddenColumns: ["deleted_at"]
                    }}
                  />
                </CardBody>
              </Card>
            </GridItem>
          </>
          : 
          <GridItem xs={12} sm={12} md={6}>
            {bar}
            {alert}
            {/* {redirect} */}
                <Card>
                <CardHeader color="rose" icon>
                    <CardIcon color="rose">
                    <MailOutline />
                    </CardIcon>
                <h4 className={classes.cardIconTitle}>Reservation ID: {rezToEdit.id}</h4>
                </CardHeader>
                <CardBody>
                    <form>
                    <Autocomplete
                        id="customerMail-box"
                        options={customers}
                        getOptionLabel={(option) => option.mail}
                        onChange={(event, newValue) => {
                          if (newValue !== null)
                            setSelectedCustomer(newValue);
                            setSelectedCustomerId(newValue.id)
                        }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        value={customers.find(f => f.id === selectedCustomerId)}
                        loading={loading}
                        style={{ width: 300 }}
                        renderInput={(params) => (<TextField {...params} 
                            label="Select customer mail *"
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

                        <CustomInput
                            labelText="Full name *"
                            id="fullname"
                            formControlProps={{
                                fullWidth: true
                            }}
                            // success={registerPhone === "success"}
                            // error={registerPhone === "error"}
                            inputProps={{
                                type: "text",
                                // onChange: event => {
                                //     setPhone(event.target.value)
                                // },
                                disabled: true,
                                value: selectedCustomer.fullname ?? ''
                            }}
                        />

                        <CustomInput
                            labelText="Phone *"
                            id="phone"
                            formControlProps={{
                                fullWidth: true
                            }}
                            // success={registerPhone === "success"}
                            // error={registerPhone === "error"}
                            inputProps={{
                                type: "text",
                                // onChange: event => {
                                //     setPhone(event.target.value)
                                // },
                                disabled: true,
                                value: selectedCustomer.phone ?? ''
                            }}
                        />

                        <InputLabel htmlFor="supplier-select" className={classes.selectLabel}>
                            Supplier
                        </InputLabel>
                        <Select
                            // success={(registerSupplierState === "success").toString()}
                            // error={registerSupplierState === "error"}
                            MenuProps={{
                                className: classes.selectMenu
                            }}
                            classes={{
                                select: classes.select
                            }}
                            value={supplierId}
                            onChange={e => {
                              setSupplierId(e.target.value);
                              setFilteredProductCategories(productCategoriesData.filter(p => p.supplier == e.target.value || p.supplier === 0));
                              setProductCategoryId(0);
                              setProductId(0);
                              setIsProductEnabled(false);

                            }}
                            inputProps={{
                                name: "supplierSelect",
                                id: "supplierSelect"
                            }}  
                            >   
                            {suppliers.map((sup, i) => {     
                                return (
                                    <MenuItem
                                        key={i}
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value = {sup.id}
                                        >
                                        {sup.description}
                                    </MenuItem>
                                ) 
                            })}
                        </Select>

                        <InputLabel htmlFor="product-category-select" className={classes.selectLabel}>
                            Product Category
                        </InputLabel>
                        <Select
                            disabled={!isProductCategoryEnabled}
                            // success={(registerProductCategoryState === "success").toString()}
                            // error={registerProductCategoryState === "error"}
                            MenuProps={{
                                className: classes.selectMenu
                            }}
                            classes={{
                                select: classes.select
                            }}
                            value={productCategoryId}
                            onChange={e => {
                              setProductCategoryId(e.target.value);
                              setFilteredProducts(productsData.filter(p => p.product_category == e.target.value || p.id === 0));
                              setIsProductEnabled(true);
                            }}
                            inputProps={{
                                name: "productCategorySelect",
                                id: "productCategorySelect"
                            }}
                            >   
                            {filteredProductCategories.map((productCategory, i) => {     
                                return (
                                    <MenuItem
                                        key={i}
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value = {productCategory.id}
                                        >
                                        {productCategory.description}
                                    </MenuItem>
                                ) 
                            })}
                        </Select>


                        <InputLabel htmlFor="product-select" className={classes.selectLabel}>
                            Product
                        </InputLabel>
                        <Select
                            disabled={!isProductEnabled}
                            // success={(registerProductState === "success").toString()}
                            // error={registerProductState === "error"}
                            MenuProps={{
                                className: classes.selectMenu
                            }}
                            classes={{
                                select: classes.select
                            }}
                            value={productId}
                            onChange={e => setProductId(e.target.value)}
                            inputProps={{
                                name: "productSelect",
                                id: "productSelect"
                            }}
                            >   
                            {filteredProducts.map((product, i) => {     
                                return (
                                    <MenuItem
                                        key={i}
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value = {product.id}
                                        >
                                        {product.description}
                                    </MenuItem>
                                ) 
                            })}
                        </Select>

                        <CustomInput
                            labelText="Total Reservation *"
                            id="rezTotal"
                            formControlProps={{
                                fullWidth: true
                            }}
                            // success={registerProductDescriptionState === "success"}
                            // error={registerProductDescriptionState === "error"}
                            inputProps={{
                                type: "number",
                                onChange: event => {
                                    setTotal(Number(event.target.value))
                                },
                                value: total
                            }}
                        />

                        <CustomInput
                            labelText="Total Comission *"
                            id="commisionTotal"
                            formControlProps={{
                                fullWidth: true
                            }}
                            // success={registerProductDescriptionState === "success"}
                            // error={registerProductDescriptionState === "error"}
                            inputProps={{
                                type: "number",
                                onChange: event => {
                                    setFeeTotal(Number(event.target.value))
                                },
                                value: feeTotal
                            }}
                        />

                        <CustomInput
                            labelText="Agency Fee *"
                            id="agencyFee"
                            formControlProps={{
                                fullWidth: true
                            }}
                            // success={registerProductDescriptionState === "success"}
                            // error={registerProductDescriptionState === "error"}
                            inputProps={{
                                type: "number",
                                value: feeAgency,
                                onChange: event => {
                                    setFeeAgency(event.target.value)
                                }
                            }}
                        />

                        <CustomInput
                            labelText="User Fee *"
                            id="feeUser"
                            formControlProps={{
                                fullWidth: true
                            }}
                            // success={registerProductDescriptionState === "success"}
                            // error={registerProductDescriptionState === "error"}
                            inputProps={{
                                type: "number",
                                value: feeUser,
                                onChange: event => {
                                    setFeeUser(event.target.value)
                                }
                            }}
                        />

                        <CustomInput
                            labelText="Reservation Number *"
                            id="rezNumber"
                            formControlProps={{
                                fullWidth: true
                            }}
                            // success={registerProductDescriptionState === "success"}
                            // error={registerProductDescriptionState === "error"}
                            inputProps={{
                                type: "text",
                                onChange: event => {
                                    setConfirmationNumber(event.target.value)
                                },
                                value: confirmationNumber
                            }}
                        />

                        <br />
                            <Datetime
                            timeFormat={false}
                            closeOnSelect={true}
                            inputProps={{ 
                                placeholder: "Confirmation Date",
                            }}
                            onChange={(event) => {
                                setConfirmationDate(event._d)
                            }}
                            value={confirmationDate}
                        />

                        <br />
                            <Datetime
                            timeFormat={false}
                            closeOnSelect={true}
                            inputProps={{ 
                                placeholder: "Arrival Date",
                            }}
                            onChange={(event) => {
                                setArrivalDate(event._d)
                            }}
                            value={arrivalDate}
                        />

                        <div className={classes.formCategory}>
                            <small>*</small> Required fields
                        </div>
                    </form>
                </CardBody>
                {/* <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message="Missing mandatory fields."
                    open={tr}
                    closeNotification={() => setTR(false)}
                    close
                />  */}
                <GridItem xs={12} sm={12} md={6}>
                      <div className={classes.cardContentRight}>
                        <Button color="primary" className={classes.marginRight} onClick={submitEditButton}>
                          Submit
                        </Button>
                        <Button color="primary" className={classes.marginRight} onClick={() => setShowEdit(false)}>
                          Return to table
                        </Button>
                      </div>
                    </GridItem>
            </Card>
      </GridItem>
      }
    </GridContainer>
  );
}
