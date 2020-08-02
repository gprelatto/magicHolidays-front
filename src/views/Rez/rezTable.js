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
import AddAlert from "@material-ui/icons/AddAlert";

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

import FormLabel from "@material-ui/core/FormLabel";
import Snackbar from "components/Snackbar/Snackbar.js";

import Datetime from "react-datetime";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";
import formStyles from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

import { getRequest, editRez, deleteRez, redirectToUnforbidden } from 'common/Request/Requests.js'
import { useAuth } from "../../context/auth";

import { useTranslation } from 'react-i18next';

import { CSVLink } from "react-csv";

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);
const useFormStyles = makeStyles(formStyles);


export default function RezTable(props) {
  const { t, i18n } = useTranslation();
  const authData = useAuth();

  const classes = useStyles();
  const alertClasses = useAlertStyles();
  const formStyleClasses = useFormStyles();

  const columns = [
    {
      Header: t('rez.table.header.confirmDate'),
      accessor: "confirmationDate",
    },
    {
      Header: t('rez.table.header.fullname'),
      accessor: "customerFullName",
      width: 150
    },
    {
      Header: t('rez.table.header.arrivalDate'),
      accessor: "arrivalDate"
    },
    {
      Header: t('rez.table.header.supplier'),
      accessor: "supplier"
    },
    {
      Header: t('rez.table.header.category'),
      accessor: "productCategory",
      width: 200
    },
    {
      Header: t('rez.table.header.product'),
      accessor: "product"
    },
    {
      Header: t('rez.table.header.total'),
      accessor: "total"
    },
    {
      Header: t('rez.table.header.confirmNumber'),
      accessor: "confirmationNumber",
      width: 170
    },
    {
      Header: t('rez.table.header.feeTotal'),
      accessor: "feeTotal"
    },
    {
      Header: t('rez.table.header.feeUser'),
      accessor: "feeUser"
    },
    {
      Header: t('rez.table.header.feeAgency'),
      accessor: "feeAgency"
    },
    {
      Header: t('rez.table.header.deleted'),
      accessor: "deleted_at",
      id: "deleted_at",
      isVisible: false
    },
    {
      Header: t('rez.table.header.actions'),
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

  const [ticketsCount, setTicketsCount] = React.useState('');
  const [peopleClount, setPeopleCount] = React.useState('');

  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);

  const [rezEditId, setRezEditId] = React.useState(0);
  const [rezToEdit, setRezToEdit] = React.useState(null);
  const [showEdit, setShowEdit] = React.useState(false);

  const [confirmationNumberState, setConfirmationNumberState] = React.useState("");
  const [registerSupplierState, setRegisterSupplierState] = React.useState("");
  const [totalState, setTotalState] = React.useState("");
  const [totalFeeState, setTotalFeeState] = React.useState("");
  const [arrivalDateState, setArrivalDateState] = React.useState("error");
  const [registerProductCategoryState, setRegisterProductCategoryState] = React.useState("");

  const [confirmationDisplayDate, setConfirmationDisplayDate] = React.useState('');
  const [arrivalDisplayDate, setArrivalDisplayDate] = React.useState('');

  const [tr, setTR] = React.useState(false);
  const [redirect, setRedirect] = React.useState(false);

  const [feePercentage, setFeePercentage] = React.useState(null);

  const [open, setOpen] = React.useState(false);
  const loading = open && customers.length === 0;

  const [tableDataByUser, setTableDataByUser] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState();
  const [openAgent, setAgentOpen] = React.useState(false);
  const loadingAgent = openAgent && users.length === 0;

  useEffect(() => {
    populateProductsTable();
    setFeePercentage(authData.auth.feePercentage);
    setPermissions(JSON.parse(localStorage.getItem("auth")))
  }, [])

  useEffect(() => {
    let filteredData = tableData.filter(f => f.user === selectedUser.id)

    setTableDataByUser(filteredData);
  }, [selectedUser]);

  useEffect(() => {
    if (rezToEdit !== null) {
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

      setTicketsCount(rezToEdit.tickets_count);
      setPeopleCount(rezToEdit.people_count);

      setConfirmationNumber(rezToEdit.confirmationNumber);
      setConfirmationDate(rezToEdit.confirmationDate);
      setArrivalDate(rezToEdit.arrivalDate);

      setShowEdit(true);
    }
  }, [rezToEdit]);

  useEffect(() => {
    if (feeTotal !== 0 && !isNaN(feeTotal)) {
      let ft = Number(feeTotal);
      if (feePercentage !== null) {
        setFeeAgency((ft * ((100 - feePercentage) / 100)).toFixed(2));
        setFeeUser((ft * (feePercentage / 100)).toFixed(2));
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


  const submitEditButton = () => {
    if (registerProductCategoryState !== "error"
      && registerSupplierState !== "error"
      && confirmationNumberState !== "error"
      && totalState !== "error"
      && totalFeeState !== "error"
      && arrivalDateState !== "error") {
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
        populateProductsTable();
        setShowEdit(false);
        removeEditProgressBar();
      });
    }
    else {
      if (!tr) {
        setTR(true);
        setTimeout(function () {
          setTR(false);
        }, 3000);
      }
    }
  }

  const warningWithConfirmAndCancelMessage = (id) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
        title="Esta seguro que desea cancelar la reserva?"
        onConfirm={() => successDelete(id)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText="Confirmar"
        cancelBtnText="Volver atras"
        showCancel
      >
        Confirmar cancelar reserva
      </SweetAlert>
    );
  };

  const successDelete = (id) => {
    deleteRez(id).then((response) => {
      if (response.data.code === 403) {
        redirectToUnforbidden(props);
      }
      populateProductsTable();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
          title="Reserva cancelada!"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          Reserva cancelada.
        </SweetAlert>
      );
    })
  };

  const cancelDetele = () => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
        title="Operacion abortada."
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
      >
        La reserva NO fue cancelada.
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
      if (reservationsResponse.data.code === 403) {
        redirectToUnforbidden(props);
      }
      let reservationsResponseData = reservationsResponse.data.data;
      setReservationsData(reservationsResponseData);
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
            getRequest('customers').then((customersResponse) => {
              if (customersResponse.data.code === 403) {
                redirectToUnforbidden(props);
              }
              let customersResponseData = customersResponse.data.data;
              setCustomers(customersResponseData);
              getRequest('users').then((usersResponse) => {
                if (usersResponse.data.code === 403) {
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
                  let deleted_at = rez.deleted_at != null ? rez.deleted_at.split('T')[0] : '';

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
                      deleted_at: deleted_at,
                      tickets_count: rez.tickets_count ?? '',
                      people_count: rez.people_count ?? ''
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
                    user: prop.user,
                    tickets_count: prop.tickets_count,
                    people_count: prop.people_count,
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
                              let r = {
                                ...rez,
                                confirmationDate: rez.confirmationDate + 'T00:00:00Z',
                                arrivalDate: rez.arrivalDate + 'T00:00:00Z'
                              }
                              setRezToEdit(r);
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
          background: rowInfo.row.deleted_at.length === 0 ? '' : '#ff6666',
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
      {!showEdit ?
        <>
          <GridItem xs={12}>
            {bar}
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <Assignment />
                </CardIcon>
                <h4 className={formStyleClasses.cardIconTitle}>Reservaciones</h4>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={5} sm={5} md={5} lg={5}>
                    {permissions.user_type === 1 ?
                      <Autocomplete
                        id="agent-box"
                        options={users}
                        getOptionLabel={(option) => option.fullname}
                        onChange={(event, newValue) => {
                          if (newValue !== null)
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
                      : <></>
                    }
                  </GridItem>
                  <GridItem xs={7} sm={7} md={7} lg={7}>
                    <CSVLink data={tableDataByUser} >Exportar datos</CSVLink>
                  </GridItem>
                </GridContainer>
                <ReactTable
                  data={tableDataByUser}
                  filterable
                  defaultFilterMethod={(filter, row) => { return row[filter.id].toString().toLowerCase().includes(filter.value.toLowerCase()) }}
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
                        if (newValue !== null)
                        {
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
                        onClick={submitEditButton}
                      >
                        Enviar
                                </Button>
                      <Button
                        color="rose"
                        onClick={() => setShowEdit(false)}
                      >
                        Volver a la Tabla
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
              message="Complete todos los campos por favor."
              open={tr}
              closeNotification={() => setTR(false)}
              close
            />

          </Card>
        </GridItem>
      }
    </GridContainer >
  );
}
