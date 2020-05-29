import React, { useEffect } from "react";
import { Redirect } from 'react-router-dom'

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";
import AddAlert from "@material-ui/icons/AddAlert";

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

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, postProduct } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function ProductForm() {
    const [suppliers, setSuppliers] = React.useState([]);
    const [supplierId, setSupplierId] = React.useState(0);

    const [productCategories, setProductCategories] = React.useState([]);
    const [filteredProductCategories, setFilteredProductCategories] = React.useState([]);
    const [productCategoryId, setProductCategoryId] = React.useState(0);
    const [productDescription, setProductDescription] = React.useState("");

    const [isProductCategoryEnabled, setIsProductCategoryEnabled] = React.useState(false);

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
            let responseData = response.data.results;
            responseData.unshift(
                {
                    id: 0,
                    description: 'Please select a supplier *'
                }
            )

            setSuppliers(responseData);
        });

        getRequest('productCategories').then((response) => {
            let responseData = response.data.results;
            responseData.unshift(
                {
                    id: 0,
                    supplier: 0,
                    description: 'Please select a Product Category *'
                }
            )

            setProductCategories(responseData);
            removeProgressBar();
        });
    }, []);

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
        if (productCategoryId === 0) {
            setRegisterProductCategorytionState("error");
        }
        else {
            setRegisterProductCategorytionState("success");
        }
    }, [productCategoryId]);

    useEffect(() => {
        if (productDescription === "") {
            setRegisterProductDescriptionState("error");
        }
        else {
            setRegisterProductDescriptionState("success");
        }
    }, [productDescription]);

    const submitClick = () => {
        if (registerProductCategoryState !== "error"
            && registerProductDescriptionState !== "error"
            && registerSupplierState !== "error") {
            progressBar();
            let product = {
                product_category: productCategoryId,
                description: productDescription
            }
    
            postProduct(product).then((response) => {
                removeProgressBar();
                successAlert()
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
                    <h4 className={classes.cardIconTitle}>Product</h4>
                </CardHeader>
                <CardBody>
                    <form>
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
                        <CustomInput
                            labelText="Product *"
                            id="description"
                            formControlProps={{
                                fullWidth: true
                            }}
                            success={registerProductDescriptionState === "success"}
                            error={registerProductDescriptionState === "error"}
                            inputProps={{
                                type: "text",
                                onChange: event => {
                                    setProductDescription(event.target.value)
                                },
                                value: productDescription
                            }}
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