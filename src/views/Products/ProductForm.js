import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import MailOutline from "@material-ui/icons/MailOutline";

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

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { getRequest, postProduct } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);

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
    
    const classes = useStyles();

    useEffect(() => {
        getRequest('suppliers').then((response) => {
            let responseData = response.data.results;
            responseData.unshift(
                {
                    id: 0,
                    description: 'Please select a supplier'
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
                    description: 'Please select a Product Category'
                }
            )

            setProductCategories(responseData);
        });
    }, []);

    useEffect(() => {
        if(supplierId === 0) {
            setRegisterSupplierState("error");
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
            let product = {
                product_category: productCategoryId,
                description: productDescription
            }
    
            postProduct(product);
        }
    };

    return (
        <GridItem xs={12} sm={12} md={6}>
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
                            labelText="Product"
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
                                }
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
            </Card>
      </GridItem>
    );
}