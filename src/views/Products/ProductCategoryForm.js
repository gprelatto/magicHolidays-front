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

import { getRequest, postProductCategory, redirectToUnforbidden } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function ProductCategoryForm(props) {
    const [suppliers, setSuppliers] = React.useState([]);
    const [supplierId, setSupplierId] = React.useState(0);
    const [selectedSupplier, setSelectedSupplier] = React.useState({});
    const [productDescription, setProductCategoryDescription] = React.useState("");
    const [registerProductCategoryDescriptionState, setRegisterProductCategoryDescriptionState] = React.useState("");
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
            let responseData = response.data

            if(responseData.code === 403) {
                redirectToUnforbidden(props);
            }

            responseData.data.unshift(
                {
                    id: 0,
                    description: 'Please select a supplier *'
                }
            )

            setSuppliers(responseData.data);
            removeProgressBar();
        }).catch(e => {
            props.history.push('/auth/forbidden')
        });
    }, [])

    useEffect(() => {
        supplierId === 0 ? setRegisterSupplierState("error") : setRegisterSupplierState("success");
    }, [supplierId]);

    useEffect(() => {
        productDescription === "" ? setRegisterProductCategoryDescriptionState("error") : setRegisterProductCategoryDescriptionState("success");
    }, [productDescription]);

    const submitClick = () => {
        if (registerProductCategoryDescriptionState !== "error"
            && registerSupplierState !== "error") {
            progressBar();
            let productCategory = {
                supplier: selectedSupplier,
                description: productDescription
            }
            
            postProductCategory(productCategory).then((response) => {
                if(response.data.code === 403) {
                    redirectToUnforbidden(props);
                }
    
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

      const successAlert = () => {
        setAlert(
          <SweetAlert
            success
            style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
            title="Product Category Added!"
            onConfirm={() => {
              setRedirect(<Redirect to='/admin/productCategoryTable' />);
            }}
            onCancel={() => {
              setSelectedSupplier({});
              setProductCategoryDescription("");
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
                    <h4 className={classes.cardIconTitle}>Product Category</h4>
                </CardHeader>
                <CardBody>
                    <form>
                        <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
                            Suppliers
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
                            onChange={e => {
                                let id = e.target.value;
                                setSupplierId(id);

                                let sup = suppliers.find(s => s.id === id);
                                setSelectedSupplier(sup);
                            }}
                            inputProps={{
                                name: "simpleSelect",
                                id: "simple-select"
                            }}  
                            >   
                            {suppliers.map((supplier, i) => {     
                                return (
                                    <MenuItem
                                        key={i}
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value={supplier.id}
                                        >
                                        {supplier.description}
                                    </MenuItem>
                                ) 
                            })}
                        </Select>
                        <CustomInput
                            labelText="Product Category *"
                            id="description"
                            formControlProps={{
                                fullWidth: true
                            }}
                            success={registerProductCategoryDescriptionState === "success"}
                            error={registerProductCategoryDescriptionState === "error"}
                            inputProps={{
                                type: "text",
                                onChange: event => {
                                    setProductCategoryDescription(event.target.value)
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