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

import { getRequest, editRez } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function RezTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  const [customers, setCustomers] = React.useState();
  const [selectedCustomer, setSelectedCustomer] = React.useState({
    mail: '',
    fullname: '',
    phone: ''
  });

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

  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);

  const [rezEditId, setRezEditId] = React.useState(0);
  const [rezToEdit, setRezToEdit] = React.useState(null);
  const [showEdit, setShowEdit] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const loading = open && customers.length === 0;

  useEffect(() => {
    populateProductsTable();
  }, [])

  useEffect(() => {
    if(rezToEdit !== null) {
      let cus = customers.find(c => c.id === rezToEdit.customer);

      setSelectedCustomer({
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
      confirmationDate: confirmationDate,
      arrivalDate: arrivalDate,
      total: total,
      feeTotal: feeTotal,
      feeAgency: feeAgency,
      feeUser: feeUser,
      product: productId,
      customer: selectedCustomer.id
    }

    editRez(rez).then((response) => {
        populateProductsTable();
        setShowEdit(false);
    });
  }

  const warningWithConfirmAndCancelMessage = (prod) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(prod)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirm Delete"
        cancelBtnText="Cancel"
        showCancel
      >
        Please confirm deleting product.
      </SweetAlert>
    );
  };

  const successDelete = (prod) => {
    getRequest(prod).then((response) => {
        populateProductsTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Deleted!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          Product deleted.
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
        let reservationsResponseData = reservationsResponse.data.data;
        setReservationsData(reservationsResponseData);
        getRequest('productCategories').then((productCategoryResponse) => {
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
                    let suppliersResponseData = suppliersResponse.data.data;
                    setSuppliers(suppliersResponseData);
                    getRequest('customers').then((customersResponse) => {
                        let customersResponseData = customersResponse.data.data;
                        setCustomers(customersResponseData);
                        getRequest('users').then((usersResponse) => {
                            let usersResponseData = usersResponse.data.data;

                            let data = [];

                            reservationsResponseData.forEach(rez => {
                                let product = productsResponseData.find(p => p.id === rez.product);
                                let prodCategory = productCategorieResponseData.find(pc => pc.id === product.product_category);
                                let sup = suppliersResponseData.find(s => prodCategory.supplier === s.id);
                                let cus = customersResponseData.find(c => c.id === rez.customer);
                                let user = usersResponseData.find(u => u.id === rez.user);
        
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
                                    arrivalDate: rez.arrivalDate,
                                    confirmationNumber: rez.confirmationNumber,
                                    confirmationDate: rez.confirmationDate,
                                    total: rez.total,
                                    feeTotal: rez.feeTotal,
                                    feeAgency: rez.feeAgency,
                                    feeUser: rez.feeUser
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
                                    total: prop.total,
                                    feeTotal: prop.feeTotal,
                                    feeAgency: prop.feeAgency,
                                    feeUser: prop.feeUser,
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
                                                    let rez = data.find(f => f.id === prop.id)
                                                    if (rez != null) {
                                                        setRezToEdit(rez);
                                                        setRezEditId(rez.id);
                                                    }
                                                }}
                                            >
                                                <Edit />
                                            </Button>
                                            <>{" "}</>
                                        </div>
                                    )
                                }
                            });

                            removeProgressBar();
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
                      Header: "Product",
                      accessor: "product"
                    },
                    {
                        Header: "Supplier",
                        accessor: "supplier"
                    },
                    {
                        Header: "Product Category",
                        accessor: "productCategory"
                    },
                    {
                        Header: "Confirmation Number",
                        accessor: "confirmationNumber"
                    },
                    {
                        Header: "Confirmation Date",
                        accessor: "confirmationDate"
                    },
                    {
                        Header: "Arrival Date",
                        accessor: "arrivalDate"
                    },
                    {
                        Header: "Customer Mail",
                        accessor: "customer"
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
                        Header: "Agency Fee",
                        accessor: "feeAgency"
                    },
                    {
                        Header: "User Fee",
                        accessor: "feeUser"
                    },
                    {
                      Header: "Action",
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
                        }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        value={customers.find(f => f.id === rezToEdit.customer)}
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
