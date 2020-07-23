import React, { useEffect } from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable from "react-table";
import SweetAlert from "react-bootstrap-sweetalert";
import Checkbox from "@material-ui/core/Checkbox";
import Edit from "@material-ui/icons/Edit";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";

import Datetime from "react-datetime";
import FormControl from "@material-ui/core/FormControl";
import LibraryBooks from "@material-ui/icons/LibraryBooks";
import InputLabel from "@material-ui/core/InputLabel";
import { CSVLink } from "react-csv";

// core components
import Check from "@material-ui/icons/Check";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";
import Snackbar from "components/Snackbar/Snackbar.js";

import FormLabel from "@material-ui/core/FormLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddAlert from "@material-ui/icons/AddAlert";
import MailOutline from "@material-ui/icons/MailOutline";

import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { getRequest, redirectToUnforbidden, postPrepay, editRez } from 'common/Request/Requests.js'
import getTrProps from 'common/Styles/TableProps.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);
const useFormStyles = makeStyles(formStyles);

export default function PrepaidTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();
  const formStyleClasses = useFormStyles();

  let filteredDataRef = React.useRef([]);
  let selectedReservationsRef = React.useRef([]);
  let feeSumRef = React.useRef(0);

  const [tableData, setTableData] = React.useState([]);

  const [prepayDate, setPrepayDate] = React.useState(new Date());

  const [filteredData, setFilteredData] = React.useState([]);
  const [selectedReservations, setSelectedReservations] = React.useState([]);

  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);
  const [alert, setAlert] = React.useState(null);
  const [showPrepay, setShowPrepay] = React.useState(false);
  const [tr, setTR] = React.useState(false);

  const [tableDataByUser, setTableDataByUser] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState();
  const [open, setOpen] = React.useState(false);
  const loading = open && users.length === 0;

  const [feeSum, setFeeSum] = React.useState(0);

  // EDIT CONST //

  const [showEdit, setShowEdit] = React.useState(false);
  const [suppliers, setSuppliers] = React.useState([]);
  const [supplierId, setSupplierId] = React.useState(0);
  const [productToEdit, setProductToEdit] = React.useState({});
  const [productCategoryId, setProductCategoryId] = React.useState('');

  const [productsData, setProductsData] = React.useState([]);
  const [productCategoriesData, setProductCategoriesData] = React.useState([]);

  const [customers, setCustomers] = React.useState();
  const [selectedCustomerId, setSelectedCustomerId] = React.useState('');
  const [selectedCustomer, setSelectedCustomer] = React.useState({
    mail: '',
    fullname: '',
    phone: ''
  });

  const [confirmationNumber, setConfirmationNumber] = React.useState('');
  const [confirmationDate, setConfirmationDate] = React.useState('');
  const [arrivalDate, setArrivalDate] = React.useState('');
  const [confirmationDisplayDate, setConfirmationDisplayDate] = React.useState('');
  const [arrivalDisplayDate, setArrivalDisplayDate] = React.useState('');
  const [ticketsCount, setTicketsCount] = React.useState('');
  const [peopleClount, setPeopleCount] = React.useState('');

  const [confirmationNumberState, setConfirmationNumberState] = React.useState("");
  const [registerSupplierState, setRegisterSupplierState] = React.useState("");
  const [totalState, setTotalState] = React.useState("");
  const [totalFeeState, setTotalFeeState] = React.useState("");
  const [arrivalDateState, setArrivalDateState] = React.useState("error");
  const [registerProductCategoryState, setRegisterProductCategoryState] = React.useState("");

  const [filteredProductCategories, setFilteredProductCategories] = React.useState([]);
  const [productId, setProductId] = React.useState();
  const [isProductCategoryEnabled, setIsProductCategoryEnabled] = React.useState(true);
  const [isProductEnabled, setIsProductEnabled] = React.useState(true);
  const [filteredProducts, setFilteredProducts] = React.useState([]);

  const [total, setTotal] = React.useState(0);
  const [feeTotal, setFeeTotal] = React.useState(0);
  const [feeAgency, setFeeAgency] = React.useState(0);
  const [feeUser, setFeeUser] = React.useState(0);

  const [rezEditId, setRezEditId] = React.useState(0);
  const [rezToEdit, setRezToEdit] = React.useState({});
  const [feePercentage, setFeePercentage] = React.useState(null);

  const [editAlert, setEditAlert] = React.useState(null);
  // END EDIT CONST //

  useEffect(() => {
    populateTable();
  }, [])

  useEffect(() => {
    let filteredData = tableData.filter(f => f.user === selectedUser.id)

    setTableDataByUser(filteredData);
  }, [selectedUser]);

  useEffect(() => {
    if (rezToEdit !== null && Object.keys(rezToEdit).length !== 0) {
      let cus = customers.find(c => c.id === rezToEdit.customer);

      setSelectedCustomer({
        id: cus.id,
        mail: cus.mail,
        fullname: cus.fullname,
        phone: cus.phone
      });

      setFeePercentage((rezToEdit.feeUser / rezToEdit.feeTotal).toFixed(2));

      let product = productsData.find(p => p.id === rezToEdit.product);
      let prodCategory = productCategoriesData.find(pc => pc.id === product.product_category);
      let sup = suppliers.find(s => prodCategory.supplier === s.id);

      setSupplierId(sup.id);

      let productCategoriesLocal = productCategoriesData.filter(p => p.supplier == sup.id || p.supplier === 0);
      setFilteredProductCategories(productCategoriesLocal);
      setProductCategoryId(prodCategory.id);

      let productsFiltered = productsData.filter(p => p.product_category == prodCategory.id || p.id === 0);
      setFilteredProducts(productsFiltered);
      setProductId(rezToEdit.product)

      setTotal(rezToEdit.total);
      setFeeTotal(rezToEdit.feeTotal);

      setTicketsCount(rezToEdit.tickets_count ?? '0');
      setPeopleCount(rezToEdit.people_count ?? '0');

      setConfirmationNumber(rezToEdit.confirmationNumber);
      setConfirmationDate(rezToEdit.confirmationDate);
      setArrivalDate(rezToEdit.arrivalDate);
    }
  }, [rezToEdit]);

  useEffect(() => {
    if (typeof confirmationDate === "string") {
      if (confirmationDate.includes('T')) {
        setConfirmationDisplayDate(confirmationDate.toString().split('T')[0]);
      }
      else {
        setConfirmationDisplayDate(confirmationDate);
      }
    }
    else {
      setConfirmationDisplayDate(confirmationDate)
    }
  }, [confirmationDate]);

  useEffect(() => {
    if (typeof arrivalDate === "string") {
      if (arrivalDate.includes('T')) {
        setArrivalDisplayDate(arrivalDate.split('T')[0]);
      }
      else {
        setArrivalDisplayDate(arrivalDate);
      }
    }
    else {
      setArrivalDisplayDate(arrivalDate)
    }
  }, [arrivalDate]);

  useEffect(() => {
    if (feeTotal !== 0 && !isNaN(feeTotal)) {
      let ft = Number(feeTotal);
      setFeeAgency((ft * ((1 - feePercentage))).toFixed(2));
      setFeeUser((ft * feePercentage).toFixed(2));
    }
  }, [feeTotal]);

  const submit = () => {
    submitProgressBar();

    let data = {
      prepaidDate: prepayDate,
      reservations: selectedReservations
    }

    postPrepay(data).then((response) => {
      populateTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Marked as prepaid!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
        </SweetAlert>
      );
      setShowPrepay(false);
      selectedReservationsRef.current = [];
      setSelectedReservations([]);
      removeSubmitProgressBar();
    });
  }

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


  const warningWithConfirmAndCancelMessage = () => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => submit()}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirm prepay"
        cancelBtnText="Cancel"
        showCancel
      >
        Please confirm.
      </SweetAlert>
    );
  };

  const confirmEdit = () => {
    setEditAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Desea confirmar la edicion?"
        onConfirm={() => submitEditButton()}
        onCancel={() => cancelEdit()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirmar"
        cancelBtnText="Cancelar"
        showCancel
      >
        Favor de confirmar.
      </SweetAlert>
    );
  };

  const cancelEdit = () => {
    setEditAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelado"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
      >
        Cancelado.
      </SweetAlert>
    );
  };

  const cancelDetele = () => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelado"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
      >
        Cancelado.
      </SweetAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
    setEditAlert(null);
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

  const submitProgressBar = () => {
    setEditBar(
      <CustomLinearProgress
        variant="indeterminate"
        color="primary"
        value={30}
      />
    );
  };

  const removeSubmitProgressBar = () => {
    setEditBar(null);
  };

  const getRezData = (id) => {
    progressBar();
    getRequest('reservations/' + id).then(reservationsResponse => {
      if (reservationsResponse.data.code === 403) {
        redirectToUnforbidden(props);
      }

      let reservationsResponseData = reservationsResponse.data.data;
      setSelectedCustomerId(reservationsResponseData.customer);
      getRequest('productCategories').then((productCategoryResponse) => {
        if (productCategoryResponse.data.code === 403) {
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
          if (productsResponse.data.code === 403) {
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
            if (suppliersResponse.data.code === 403) {
              redirectToUnforbidden(props);
            }
            let suppliersResponseData = suppliersResponse.data.data;
            setSuppliers(suppliersResponseData);
            setRezToEdit(reservationsResponseData);
            removeProgressBar();
          });
        });
      });
    })
  };

  const submitEditButton = () => {
    editProgressBar();

    let rez = {
      id: rezEditId,
      confirmationNumber: confirmationNumber,
      confirmationDate: confirmationDate,
      arrivalDate: arrivalDate,
      total: Number(total),
      feeTotal: Number(feeTotal),
      feeAgency: feeAgency,
      feeUser: feeUser,
      product: productId,
      customer: selectedCustomer.id,
      user: rezToEdit.user,
      tickets_count: Number(ticketsCount),
      people_count: Number(peopleClount)
    }

    editRez(rez).then((response) => {
      populateTable();
      setShowEdit(false);
      hideAlert();
      removeEditProgressBar();
    });
  }

  const populateTable = () => {
    progressBar();

    getRequest('prepay').then(prepayResponse => {
      let prepayResponseData = prepayResponse.data;

      if (prepayResponseData.code === 403) {
        redirectToUnforbidden(props);
      }

      getRequest('customers').then(customersResponse => {
        let customers = customersResponse.data;
        setCustomers(customers.data);

        if (customers.code === 403) {
          redirectToUnforbidden(props);
        }

        getRequest('users').then((response) => {
          let users = response.data;

          if (users.code === 403) {
            redirectToUnforbidden(props);
          }

          let usersCombo = users.data.map(prop => {
            return {
              id: prop.id,
              mail: prop.mail,
              fullname: prop.name + ' ' + prop.lastname
            }
          })

          setUsers(usersCombo);

          let data = prepayResponseData.data.map((prop, key) => {
            let usr = users.data.find(f => f.id === prop.user);
            prop.user = usr;

            let cus = customers.data.find(f => f.id === prop.customer);
            prop.customer = cus;

            return {
              id: prop.id,
              user: usr.id,
              fullName: usr.name + ' ' + usr.lastname,
              customerFullName: cus.fullname,
              confirmationNumber: prop.confirmationNumber,
              total: prop.total,
              feeTotal: prop.feeTotal,
              feeAgency: prop.feeAgency,
              feeUser: prop.feeUser,
              prepay: (
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
                        getRezData(rez.id);
                        setShowEdit(true);
                        setRezEditId(rez.id);
                      }
                    }}
                  >
                    <Edit />
                  </Button>
                  <>{" "}</>
                  <Checkbox
                    key={prop.id}
                    tabIndex={-1}
                    onClick={(e) => {
                      let existingRezIdx = selectedReservationsRef.current.map(function (item) { return item.id; }).indexOf(prop.id);

                      if (existingRezIdx === -1) {
                        selectedReservationsRef.current.push(prop)
                        feeSumRef.current = feeSumRef.current + Number(prop.feeUser)
                        sumFees();
                      }
                      else {
                        selectedReservationsRef.current.splice(existingRezIdx, 1);
                        feeSumRef.current = feeSumRef.current - Number(prop.feeUser)
                        sumFees();
                      }
                    }}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{
                      checked: classes.checked,
                      root: classes.checkRoot
                    }}
                  />
                </div>
              )
            }
          });

          setTableDataByUser(data);
          setTableData(data);
          removeProgressBar();
        })
      });
    })

    // }).catch(e => {
    //   props.history.push('/auth/forbidden')
    // });
  }

  const sumFees = () => {
    setFeeSum(feeSumRef.current.toFixed(2));
  }

  return (
    <GridContainer>
      {alert}
      {!showPrepay ?
        !showEdit ?
          <>
            <GridItem xs={12} sm={12} md={12} lg={12}>
              {bar}
              <Card>
                <CardHeader color="rose" icon>
                  <CardIcon color="rose">
                    <Assignment />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>Reservas Sin Pagar - Seleccionado: <b>$ {feeSum}</b></h4>
                </CardHeader>
                <CardBody>

                  <GridContainer>
                    <GridItem xs={4} sm={4} md={4} lg={4}>
                      <Autocomplete
                        id="customerMail-box"
                        options={users}
                        getOptionLabel={(option) => option.fullname}
                        onChange={(event, newValue) => {
                          if (newValue !== null)
                            setSelectedUser(newValue);
                          else
                            setTableDataByUser(tableData)
                        }}
                        open={open}
                        onOpen={() => {
                          setOpen(true);
                        }}
                        onClose={(e) => {
                          setOpen(false);
                        }}
                        loading={loading}
                        style={{ width: 300 }}
                        renderInput={(params) => (<TextField {...params}
                          label="Seleccionar agente"
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

                    <GridItem xs={4} sm={4} md={4} lg={4}>
                      <Button color="info"
                        className={classes.marginRight}
                        onClick={() => {
                          let ids = selectedReservationsRef.current.map((i, k) => {
                            return i.id;
                          });

                          if (ids.length > 0) {
                            setSelectedReservations(ids);
                            setShowPrepay(true);
                          }
                          else {
                            if (!tr) {
                              setTR(true);
                              setTimeout(function () {
                                setTR(false);
                              }, 3000);
                            }
                          }
                        }} >
                        Mark as prepaid checked reservations
                    </Button>
                    </GridItem>

                    <GridItem xs={4} sm={4} md={4} lg={4}>
                      <CSVLink data={tableDataByUser} >Download Data</CSVLink>
                    </GridItem>
                  </GridContainer>

                  <ReactTable
                    data={tableDataByUser}
                    filterable
                    defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
                    ref={(r) => {
                      if (r !== null) {
                        filteredDataRef = r;
                      }
                    }}
                    onFilteredChange={() => {
                      setFilteredData(filteredDataRef.getResolvedState().sortedData);
                    }}
                    columns={[
                      {
                        Header: "Nombre Agente",
                        accessor: "fullName"
                      },
                      {
                        Header: "Cliente",
                        accessor: "customerFullName"
                      },
                      {
                        Header: "Confirmation Number",
                        accessor: "confirmationNumber"
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
                        Header: "Mark as Prepaid",
                        accessor: "prepay",
                        sortable: false,
                        filterable: false
                      }
                    ]}
                    defaultPageSize={10}
                    showPaginationTop
                    showPaginationBottom={false}
                    getTrProps={getTrProps}
                    className="-striped -highlight"
                  />
                </CardBody>
              </Card>
              <Snackbar
                place="tr"
                color="danger"
                icon={AddAlert}
                message="Seleccione al menos una reserva."
                open={tr}
                closeNotification={() => setTR(false)}
                close
              />
            </GridItem>
          </>
          :
          <>
            <GridItem xs={12} sm={12} md={6}>
              {bar}
              {editAlert}
              <Card>
                <CardHeader color="rose" icon>
                  <CardIcon color="rose">
                    <MailOutline />
                  </CardIcon>
                  <h4 className={formStyleClasses.cardIconTitle}>Numero de Confirmacion: {rezToEdit.confirmationNumber}</h4>
                </CardHeader>
                <CardBody>
                  <form>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={2} lg={4}>
                        <FormLabel className={formStyleClasses.labelHorizontal}>

                        </FormLabel>
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6} lg={6}>
                        <Autocomplete
                          id="customerMail-box"
                          options={customers}
                          getOptionLabel={(option) => option.mail}
                          onChange={(event, newValue) => {
                            if (newValue !== null) {
                              setSelectedCustomer(newValue);
                              setSelectedCustomerId(newValue.id);
                            }
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
                          Telefono *
                                </FormLabel>
                      </GridItem>
                      <GridItem xs={4} sm={4} md={4} lg={8}>
                        <CustomInput
                          id="phone"
                          formControlProps={{
                            fullWidth: true
                          }}
                          inputProps={{
                            type: "text",
                            disabled: true,
                            value: selectedCustomer.phone ?? ''
                          }}
                        />
                      </GridItem>
                    </GridContainer>


                    <GridContainer>
                      <GridItem xs={4} sm={4} md={4} lg={4}>
                        <FormLabel className={formStyleClasses.labelHorizontal}>
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
                          className={formStyleClasses.select}
                          value={confirmationDisplayDate}
                        />
                      </GridItem>
                    </GridContainer>


                    <GridContainer>
                      <GridItem xs={4} sm={4} md={4} lg={4}>
                        <FormLabel className={formStyleClasses.labelHorizontal}>
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
                          className={formStyleClasses.select}
                          value={arrivalDisplayDate}
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
                            value: peopleClount.includes('.') ? peopleClount.split('.')[0] : peopleClount
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
                            value: ticketsCount.includes('.') ? ticketsCount.split('.')[0] : ticketsCount
                          }}
                        />
                      </GridItem>
                    </GridContainer>

                    <GridContainer>
                      <GridItem xs={4} sm={4} md={4} lg={4}>
                        <FormLabel className={formStyleClasses.labelHorizontal}>
                          Proveedor
                                </FormLabel>
                      </GridItem>
                      <GridItem xs={4} sm={4} md={4} lg={8}>
                        <Select
                          success={(registerSupplierState === "success").toString()}
                          error={registerSupplierState === "error"}
                          MenuProps={{
                            className: formStyleClasses.selectMenu
                          }}
                          classes={{
                            select: formStyleClasses.select
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
                                  root: formStyleClasses.selectMenuItem,
                                  selected: formStyleClasses.selectMenuItemSelected
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
                          Categoria de Producto
                                </FormLabel>
                      </GridItem>
                      <GridItem xs={4} sm={4} md={4} lg={8}>
                        <Select
                          disabled={!isProductCategoryEnabled}
                          success={(registerProductCategoryState === "success").toString()}
                          error={registerProductCategoryState === "error"}
                          MenuProps={{
                            className: formStyleClasses.selectMenu
                          }}
                          classes={{
                            select: formStyleClasses.select
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
                                  root: formStyleClasses.selectMenuItem,
                                  selected: formStyleClasses.selectMenuItemSelected
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
                          Productos
                                </FormLabel>
                      </GridItem>
                      <GridItem xs={4} sm={4} md={4} lg={8}>
                        <Select
                          disabled={!isProductEnabled}
                          // success={(registerProductState === "success").toString()}
                          // error={registerProductState === "error"}
                          MenuProps={{
                            className: formStyleClasses.selectMenu
                          }}
                          classes={{
                            select: formStyleClasses.select
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
                                  root: formStyleClasses.selectMenuItem,
                                  selected: formStyleClasses.selectMenuItemSelected
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
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
                        <FormLabel className={formStyleClasses.labelHorizontal}>
                          <small>*</small> Campos Requeridos
                                </FormLabel>
                      </GridItem>
                    </GridContainer>
                    <GridContainer>
                      <GridItem xs={10} sm={10} md={10} lg={11}>
                        <FormLabel className={formStyleClasses.labelHorizontal}>
                          <Button
                            color="rose"
                            onClick={confirmEdit}
                          >
                            Enviar
                                </Button>
                          <Button
                            color="rose"
                            onClick={() => {setShowEdit(false); setRezToEdit({})}}
                          >
                            Volver a la Tabla
                                </Button>
                        </FormLabel>
                      </GridItem>
                    </GridContainer>
                  </form>
                </CardBody>
              </Card>
            </GridItem>
          </>
        :
        <GridItem xs={12} sm={12} md={4}>
          {editBar}
          {alert}
          <Card>
            <CardHeader color="rose" icon>
              <CardIcon color="rose">
                <LibraryBooks />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>Set Prepay date</h4>
            </CardHeader>
            <CardBody>
              <InputLabel className={classes.label}>Prepay date</InputLabel>
              <br />
              <FormControl fullWidth>
                <Datetime
                  timeFormat={false}
                  closeOnSelect={true}
                  inputProps={{
                    placeholder: "Prepay Date",
                  }}
                  onChange={(event) => {
                    setPrepayDate(event._d)
                  }}
                  value={prepayDate}
                />
              </FormControl>
              <div className={classes.cardContentRight}>
                <Button color="primary" className={classes.marginRight} onClick={warningWithConfirmAndCancelMessage}>
                  Submit
                  </Button>
                <Button color="primary" className={classes.marginRight} onClick={() => setShowPrepay(false)}>
                  Return to table
                  </Button>
              </div>
            </CardBody>
          </Card>
        </GridItem>
      }
    </GridContainer>
  );
}