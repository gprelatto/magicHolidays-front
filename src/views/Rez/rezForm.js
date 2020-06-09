import React, { useEffect, useRef } from "react";
import { Redirect } from 'react-router-dom'

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import AddAlert from "@material-ui/icons/AddAlert";

import Datetime from "react-datetime";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from "components/Snackbar/Snackbar.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";

import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, postRez } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function RezForm(props) {
    
    const [customers, setCustomers] = React.useState([]);
    const [selectedCustomer, setSelectedCustomer] = React.useState({
        mail: '',
        fullname: '',
        phone: ''
    });
    const [open, setOpen] = React.useState(false);
    const loading = open && customers.length === 0;

    const [tripDateTime, setTripDateTime] = React.useState(null);

    const [suppliers, setSuppliers] = React.useState([]);
    const [supplierId, setSupplierId] = React.useState(0);

    const [productCategories, setProductCategories] = React.useState([]);
    const [filteredProductCategories, setFilteredProductCategories] = React.useState([]);
    const [productCategoryId, setProductCategoryId] = React.useState(0);
    const [productDescription, setProductDescription] = React.useState("");

    const [products, setProducts] = React.useState([]);
    const [filteredProducts, setFilteredProducts] = React.useState([]);
    const [productId, setProductId] = React.useState(0);
    
    const [isProductCategoryEnabled, setIsProductCategoryEnabled] = React.useState(false);
    const [isProductEnabled, setIsProductEnabled] = React.useState(false);

    const [selectedDate, setSelectedDate] = React.useState('');
    const [total, setTotal] = React.useState(0);
    const [feeTotal, setFeeTotal] = React.useState(0);
    const [feeAgency, setFeeAgency] = React.useState(0);
    const [feeUser, setFeeUser] = React.useState(0);

    const [confirmationNumber, setConfirmationNumber] = React.useState('');
    const [confirmationDate, setConfirmationDate] = React.useState(new Date());
    const [arrivalDate, setArrivalDate] = React.useState('');

    const [registerProductDescriptionState, setRegisterProductDescriptionState] = React.useState("");
    const [registerProductCategoryState, setRegisterProductCategorytionState] = React.useState("");
    const [registerSupplierState, setRegisterSupplierState] = React.useState("");

    const [bar, setBar] = React.useState(null);
    const [tr, setTR] = React.useState(false);
    const [alert, setAlert] = React.useState(null);
    const [redirect, setRedirect] = React.useState(false);
    
    const classes = useStyles();
    const alertClasses = useAlertStyles();

    useEffect(() => {
        progressBar();

        getRequest('suppliers').then((response) => {
            let responseData = response.data.data;
            responseData.unshift(
                {
                    id: 0,
                    description: 'Please select a supplier *'
                }
            )

            setSuppliers(responseData);
        }).catch(e => {
            props.history.push('/auth/forbidden')
        });

        getRequest('productCategories').then((response) => {
            let responseData = response.data.data;
            responseData.unshift(
                {
                    id: 0,
                    supplier: 0,
                    description: 'Please select a Product Category *'
                }
            )

            setProductCategories(responseData);
            removeProgressBar();
        }).catch(e => {
            props.history.push('/auth/forbidden')
        });

        getRequest('products').then((response) => {
            let responseData = response.data.data;
            responseData.unshift(
                {
                    id: 0,
                    supplier: 0,
                    description: 'Please select a Product *'
                }
            )

            setProducts(responseData);
            removeProgressBar();
        }).catch(e => {
            props.history.push('/auth/forbidden')
        });
    }, []);

    useEffect(() => {
        let active = true;
    
        if (!loading) {
          return undefined;
        }

        getRequest('customers').then((customerResponse) => {
            setCustomers(customerResponse.data.data);
        });
    
        return () => {
          active = false;
        };
      }, [loading]);

    useEffect(() => {
        if (!open) {
          setCustomers([]);
        }
    }, [open]);

    useEffect(() => {
        if(supplierId === 0) {
            setRegisterSupplierState("error");
            setFilteredProductCategories(productCategories.filter(p => p.id === 0));
        } 
        else {
            setRegisterSupplierState("success");
            setIsProductCategoryEnabled(true);
            setProductCategoryId(0);
            setFilteredProductCategories(productCategories.filter(p => p.supplier == supplierId || p.id === 0));
        }
    }, [supplierId]);

    useEffect(() => {
        if(productCategoryId === 0) {
            setRegisterSupplierState("error");
            setFilteredProducts(products.filter(p => p.id === 0));
        } 
        else {
            setRegisterSupplierState("success");
            setIsProductEnabled(true);
            setProductId(0);
            setFilteredProducts(products.filter(p => p.product_category == productCategoryId || p.id === 0));
        }
    }, [productCategoryId]);

    useEffect(() => {
        if(feeTotal !== 0) {
            setFeeAgency(feeTotal * 0.3);
            setFeeUser(feeTotal * 0.7);
        }
    }, [feeTotal]);

    // useEffect(() => {
    //     if (productCategoryId === 0) {
    //         setRegisterProductCategorytionState("error");
    //     }
    //     else {
    //         setRegisterProductCategorytionState("success");
    //     }
    // }, [productCategoryId]);

    // useEffect(() => {
    //     if (productDescription === "") {
    //         setRegisterProductDescriptionState("error");
    //     }
    //     else {
    //         setRegisterProductDescriptionState("success");
    //     }
    // }, [productDescription]);

    const submitClick = () => {
        if (registerProductCategoryState !== "error"
            && registerProductDescriptionState !== "error"
            && registerSupplierState !== "error") {
            progressBar();
            let rez = {
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

            console.log('rez',rez)
    
            postRez(rez).then((response) => {
                console.log('res', response)
                removeProgressBar();
                successAlert()
            }).catch(e => {
                props.history.push('/auth/forbidden')
            });
        }
        else {
            if (!tr) {
                setTR(true);
                setTimeout(function() {
                  setTR(false);
                }, 3000);
              }
        }
    };

    const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Product Added!"
            onConfirm={() => {
              setRedirect(<Redirect to='/admin/productTable' />);
            }}
            onCancel={() => {
              setProductDescription("");
              setProductCategoryId(0);
              setSupplierId(0);
              hideAlert();
            }}
            confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
            cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
            confirmBtnText="Done"
            cancelBtnText="Add another"
            showCancel
          >
            Product Category added!
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


    return (
        <GridItem xs={12} sm={12} md={6}>
            {bar}
            {alert}
            {redirect}


                <Card>
                <CardHeader color="rose" icon>
                    <CardIcon color="rose">
                    <MailOutline />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>Reservation</h4>
                </CardHeader>
                <CardBody>
                    <form>
                    <Autocomplete
                        id="customerMail-box"
                        options={customers}
                        getOptionLabel={(option) => option.mail}
                        onChange={(event, newValue) => {
                            if(newValue !== null)
                                setSelectedCustomer(newValue);
                        }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
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
                            success={(registerSupplierState === "success").toString()}
                            error={registerSupplierState === "error"}
                            MenuProps={{
                                className: classes.selectMenu
                            }}
                            classes={{
                                select: classes.select
                            }}
                            value={supplierId}
                            onChange={e => setSupplierId(e.target.value)}
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
                            success={(registerProductCategoryState === "success").toString()}
                            error={registerProductCategoryState === "error"}
                            MenuProps={{
                                className: classes.selectMenu
                            }}
                            classes={{
                                select: classes.select
                            }}
                            value={productCategoryId}
                            onChange={e => setProductCategoryId(e.target.value)}
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


                        <InputLabel htmlFor="product-category-select" className={classes.selectLabel}>
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
                        <Button 
                            color="rose"
                            onClick={submitClick}
                        >
                            Submit
                        </Button>
                    </form>
                </CardBody>
                <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message="Missing mandatory fields."
                    open={tr}
                    closeNotification={() => setTR(false)}
                    close
                />
            </Card>
      </GridItem>
    );
}