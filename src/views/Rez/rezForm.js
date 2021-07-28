import React, { useEffect, useRef } from "react";
import { Redirect } from 'react-router-dom'

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import SweetAlert from "react-bootstrap-sweetalert";

// @material-ui/icons
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';
import AddAlert from "@material-ui/icons/AddAlert";

import Datetime from "react-datetime";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';

// core components
import GridContainer from "components/Grid/GridContainer.js";
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

import FormLabel from "@material-ui/core/FormLabel";

import FormControlLabel from "@material-ui/core/FormControlLabel";

import styles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, postRez, redirectToUnforbidden } from 'common/Request/Requests.js'
import { useAuth } from "../../context/auth";

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function RezForm(props) {
    const authData = useAuth();

    const [customers, setCustomers] = React.useState([]);
    const [selectedCustomer, setSelectedCustomer] = React.useState({
        mail: '',
        fullname: '',
        phone: ''
    });
    const [open, setOpen] = React.useState(false);
    const loading = open && customers.length === 0;

    const [disabledButton, setDisabledButton] = React.useState(false);

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
    const [total, setTotal] = React.useState('');
    const [feeTotal, setFeeTotal] = React.useState('');
    const [feeAgency, setFeeAgency] = React.useState(0);
    const [feeUser, setFeeUser] = React.useState(0);

    const [confirmationNumber, setConfirmationNumber] = React.useState('');
    const [confirmationDate, setConfirmationDate] = React.useState(new Date());
    const [arrivalDate, setArrivalDate] = React.useState('');

    const [ticketsCount, setTicketsCount] = React.useState('');
    const [peopleClount, setPeopleCount] = React.useState('');

    const [registerProductDescriptionState, setRegisterProductDescriptionState] = React.useState("");
    const [registerProductCategoryState, setRegisterProductCategoryState] = React.useState("");
    const [confirmationNumberState, setConfirmationNumberState] = React.useState("");
    const [registerSupplierState, setRegisterSupplierState] = React.useState("");
    const [totalState, setTotalState] = React.useState("");
    const [totalFeeState, setTotalFeeState] = React.useState("");
    const [arrivalDateState, setArrivalDateState] = React.useState("error");

    const [bar, setBar] = React.useState(null);
    const [tr, setTR] = React.useState(false);
    const [alert, setAlert] = React.useState(null);
    const [redirect, setRedirect] = React.useState(false);

    const [feePercentage, setFeePercentage] = React.useState(null);

    const classes = useStyles();
    const alertClasses = useAlertStyles();

    useEffect(() => {
        progressBar();

        setFeePercentage(authData.auth.feePercentage);

        getRequest('suppliers').then((response) => {
            if (response.data.code === 403) {
                redirectToUnforbidden(props);
            }
            let responseData = response.data.data;
            responseData.unshift(
                {
                    id: 0,
                    description: 'Seleccione un Proovedor *'
                }
            )

            setSuppliers(responseData);
        }).catch(e => {
            props.history.push('/auth/forbidden')
        });

        getRequest('productCategories').then((response) => {
            if (response.data.code === 403) {
                redirectToUnforbidden(props);
            }
            let responseData = response.data.data;
            responseData.unshift(
                {
                    id: 0,
                    supplier: 0,
                    description: 'Seleccione Categoria de Producto *'
                }
            )

            setProductCategories(responseData);
            removeProgressBar();
        }).catch(e => {
            props.history.push('/auth/forbidden')
        });

        getRequest('products').then((response) => {
            if (response.data.code === 403) {
                redirectToUnforbidden(props);
            }
            let responseData = response.data.data;
            responseData.unshift(
                {
                    id: 0,
                    supplier: 0,
                    description: 'Seleccione Producto *'
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
            if (customerResponse.data.code === 403) {
                redirectToUnforbidden(props);
            }
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
        if (supplierId === 0) {
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
        if (feeTotal !== 0 && !isNaN(feeTotal)) {
            let ft = Number(feeTotal);

            if(feePercentage !== null) {
                setFeeAgency((ft * ((100-feePercentage) / 100)).toFixed(2));
                setFeeUser((ft * (feePercentage/100)).toFixed(2));    
            }
            else {
                setFeeAgency((ft * 0.3).toFixed(2));
                setFeeUser((ft * 0.7).toFixed(2));
            }
        }
    }, [feeTotal]);

    useEffect(() => {
        if (confirmationNumber.length == 0) {
            setConfirmationNumberState("error");
        }
        else {
            setConfirmationNumberState("success");
        }
    }, [confirmationNumber]);

    useEffect(() => {
        if (total.toString().length == 0) {
            setTotalState("error");
        }
        else {
            setTotalState("success");
        }
    }, [total]);

    useEffect(() => {
        if (feeTotal.toString().length == 0) {
            setTotalFeeState("error");
        }
        else {
            setTotalFeeState("success");
        }
    }, [feeTotal]);

    useEffect(() => {
        if (arrivalDate == "") {
            setArrivalDateState("error");
        }
        else {
            setArrivalDateState("success");
        }
    }, [arrivalDate]);

    const submitClick = () => {
        if (registerProductCategoryState !== "error"
            && registerProductDescriptionState !== "error"
            && registerSupplierState !== "error"
            && confirmationNumberState !== "error"
            && totalState !== "error"
            && totalFeeState !== "error"
            && arrivalDateState !== "error"
            && !disabledButton) {
            setDisabledButton(true);
            progressBar();

            let rez = {
                confirmationNumber: confirmationNumber,
                confirmationDate: confirmationDate.getFullYear() + '-' + (confirmationDate.getMonth() + 1) + '-' + confirmationDate.getDate() + 'T00:00:00Z',
                arrivalDate: arrivalDate.getFullYear() + '-' + (arrivalDate.getMonth() + 1) + '-' + arrivalDate.getDate() + 'T00:00:00Z',
                total: Number(total),
                feeTotal: Number(feeTotal),
                feeAgency: feeAgency,
                feeUser: feeUser,
                product: productId,
                customer: selectedCustomer.id,
                tickets_count: ticketsCount.length > 0 ? Number(ticketsCount) : null,
                people_count: peopleClount.length > 0 ? Number(peopleClount): null
            }

            postRez(rez).then((response) => {
                if (response.data.code === 403) {
                    redirectToUnforbidden(props);
                }
                removeProgressBar();
                successAlert()
            }).catch(e => {
                props.history.push('/auth/forbidden')
            }).finally(() => setDisabledButton(false));;
        }
        else {
            if (!tr) {
                setTR(true);
                setTimeout(function () {
                    setTR(false);
                }, 3000);
            }
        }
    };

    const successAlert = () => {
        setAlert(
            <SweetAlert
                success
                style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
                title="Reserva Creada!"
                onConfirm={() => {
                    setRedirect(<Redirect to='/admin/rezTable' />);
                }}
                onCancel={() => {
                    setProductDescription("");
                    setProductCategoryId(0);
                    setSupplierId(0);
                    setArrivalDate('');
                    setConfirmationDate(new Date());
                    setTotal(0);
                    setFeeTotal('0');
                    setConfirmationNumber('');
                    setSelectedCustomer({
                        mail: '',
                        fullname: '',
                        phone: ''
                    });
                    hideAlert();
                }}
                confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
                cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
                confirmBtnText="Aceptar"
                cancelBtnText="Agregar Otra"
                showCancel
            >
                Reserva Agregada!
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
        <GridItem xs={12} sm={12} md={12} lg={12}>
            {bar}
            {alert}
            {redirect}
            <Card>
                <CardHeader color="rose" icon>
                    <CardIcon color="rose">
                        <FlightTakeoffIcon />
                    </CardIcon>
                    <h4 className={classes.cardIconTitle}>Generar nueva reserva</h4>
                </CardHeader>
                <CardBody>
                    <form>
                        <GridContainer>
                            <GridItem xs={12} sm={12} md={2} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>

                                </FormLabel>
                            </GridItem>
                            <GridItem xs={12} sm={12} md={6} lg={6}>
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
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Nombre Completo *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="fullname"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "text",
                                        disabled: true,
                                        value: selectedCustomer.fullname ?? ''
                                    }}
                                />
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Telefono *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
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
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Fecha de Confirmacion *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <Datetime
                                    dateFormat="YYYY-MM-DD"
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    inputProps={{
                                    }}
                                    onChange={(event) => {
                                        setConfirmationDate(event._d);
                                    }}
                                    className={classes.select}
                                    value={confirmationDate}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Fecha de Llegada *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <Datetime
                                    dateFormat="YYYY-MM-DD"
                                    timeFormat={false}
                                    closeOnSelect={true}
                                    inputProps={{
                                        placeholder: "Seleccione fecha de llegada",
                                    }}
                                    onChange={(event) => {
                                        setArrivalDate(event._d);
                                        setArrivalDateState("success");
                                    }}
                                    className={classes.select}
                                    value={arrivalDate}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Cantidad de Pasajeros
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="peopleCount"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "text",
                                        onChange: event => {
                                            let input = event.target.value;

                                            if (input.length > 0) {
                                                input = input.replace(',', '.')
                                            }

                                            if (!isNaN(input)) {
                                                setPeopleCount(input)
                                            }
                                        },
                                        value: peopleClount
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Cantidad Tickets de la Reserva
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="ticketCount"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "text",
                                        onChange: event => {
                                            let input = event.target.value;

                                            if (input.length > 0) {
                                                input = input.replace(',', '.')
                                            }

                                            if (!isNaN(input)) {
                                                setTicketsCount(input)
                                            }
                                        },
                                        value: ticketsCount
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Proveedor
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
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
                                                value={sup.id}
                                            >
                                                {sup.description}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Categoria de Producto
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
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
                                                value={productCategory.id}
                                            >
                                                {productCategory.description}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Productos
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
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
                                                value={product.id}
                                            >
                                                {product.description}
                                            </MenuItem>
                                        )
                                    })}
                                </Select>
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Importe Total de la Reserva *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="rezTotal"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    success={totalState === "success"}
                                    error={totalState === "error"}
                                    inputProps={{
                                        type: "text",
                                        onChange: event => {
                                            let input = event.target.value;

                                            if (input.length > 0) {
                                                input = input.replace(',', '.')
                                            }

                                            if (!isNaN(input)) {
                                                let nums = input.split(".");

                                                if(nums.length > 1)
                                                    input = nums[0].toString() + '.' + nums[1].substr(0,2)

                                                setTotal(input)
                                            }
                                        },
                                        value: total
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Importe Total de la Comision *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="rezTotalFee"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    success={totalFeeState === "success"}
                                    error={totalFeeState === "error"}
                                    inputProps={{
                                        type: "text",
                                        onChange: event => {
                                            let input = event.target.value;

                                            if (input.length > 0) {
                                                input = input.replace(',', '.')
                                            }

                                            if (!isNaN(input)) {
                                                let nums = input.split(".");

                                                if(nums.length > 1)
                                                    input = nums[0].toString() + '.' + nums[1].substr(0,2)
                                                
                                                setFeeTotal(input)
                                            }
                                        },
                                        value: feeTotal
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Comision de la Agencia *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="agencyFee"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "number",
                                        value: feeAgency,
                                        disabled: true,
                                        onChange: event => {
                                            setFeeAgency(event.target.value)
                                        }
                                    }}
                                />
                            </GridItem>
                        </GridContainer>


                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Comision del Agente *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="agentFee"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        type: "number",
                                        value: feeUser,
                                        disabled: true,
                                        onChange: event => {
                                            setFeeUser(event.target.value)
                                        }
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={4} sm={4} md={4} lg={4}>
                                <FormLabel className={classes.labelHorizontal}>
                                    Numero de Reserva *
                                </FormLabel>
                            </GridItem>
                            <GridItem xs={4} sm={4} md={4} lg={8}>
                                <CustomInput
                                    id="rezNumber"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    success={confirmationNumberState === "success"}
                                    error={confirmationNumberState === "error"}
                                    inputProps={{
                                        type: "text",
                                        onChange: event => {
                                            setConfirmationNumber(event.target.value)
                                        },
                                        value: confirmationNumber
                                    }}
                                />
                            </GridItem>
                        </GridContainer>

                        <GridContainer>
                            <GridItem xs={10} sm={10} md={10} lg={11}>
                                <FormLabel className={classes.labelHorizontal}>
                                    <small>*</small> Campos Requeridos
                                </FormLabel>
                            </GridItem>
                        </GridContainer>
                        <GridContainer>
                            <GridItem xs={10} sm={10} md={10} lg={11}>
                                <FormLabel className={classes.labelHorizontal}>
                                    <Button
                                        color="rose"
                                        onClick={submitClick}
                                        disabled={disabledButton}
                                    >
                                        Enviar
                                </Button>
                                </FormLabel>
                            </GridItem>
                        </GridContainer>
                    </form>
                </CardBody>
                <Snackbar
                    place="tr"
                    color="danger"
                    icon={AddAlert}
                    message="Complete todos los campos obligatorios."
                    open={tr}
                    closeNotification={() => setTR(false)}
                    close
                />
            </Card>
        </GridItem>
    );
}