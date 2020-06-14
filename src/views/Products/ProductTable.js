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

import { getRequest, editProduct, deleteProduct, redirectToUnforbidden } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);
const useAlertStyles = makeStyles(alertStyles);

export default function ProductCategoryTable(props) {
  const classes = useStyles();
  const alertClasses = useAlertStyles();

  const [tableData, setTableData] = React.useState([]);
  const [suppliersData, setSuppliersData] = React.useState([]);
  const [productCategoriesData, setProductCategoriesData] = React.useState([]);
  const [productsData, setProductsData] = React.useState([]);

  const [productToEdit, setProductToEdit] = React.useState({});
  const [productCategoryId, setProductCategoryId] = React.useState('');
  const [supplierId, setSupplierId] = React.useState('');

  const [showEdit, setShowEdit] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [bar, setBar] = React.useState(null);
  const [editBar, setEditBar] = React.useState(null);

  useEffect(() => {
    populateProductsTable();
  }, [])

  const submitEditButton = () => {
    editProduct(productToEdit).then((response) => {
        if(response.data.code === 403) {
          redirectToUnforbidden(props);
        }

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
    deleteProduct(prod).then((response) => {
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
    getRequest('suppliers').then((suppliersResponse) => {
      if(suppliersResponse.data.code === 403) {
        redirectToUnforbidden(props);
      }

        let supplierResponseData = suppliersResponse.data.data;
        setSuppliersData(supplierResponseData);
        getRequest('productCategories').then((productCategoryResponse) => {
          if(productCategoryResponse.data.code === 403) {
            redirectToUnforbidden(props);
          }
            let productCategorieResponseData = productCategoryResponse.data.data;
            setProductCategoriesData(productCategorieResponseData)
            getRequest('products').then((productsResponse) => {
              if(productsResponse.data.code === 403) {
                redirectToUnforbidden(props);
              }
              let productsResponseData = productsResponse.data.data;
              let data = [];

              setProductsData(productsResponseData);

              productsResponseData.forEach(prod => {
                let prodCategory = productCategorieResponseData.find(pc => pc.id === prod.product_category);
                let sup = supplierResponseData.find(s => prodCategory.supplier === s.id);

                data.push(
                  {
                      id: prod.id,
                      description: prod.description,
                      supplierId: sup.id,
                      supplierDescription: sup.description,
                      prodCategoryId: prodCategory.id,
                      prodCategoryDesc: prodCategory.description
                  }
                );
              })
            
              let tableData = data.map((prop, key) => {
                  return {
                      id: prop.id,
                      supplier: prop.supplierDescription,
                      productCategory: prop.prodCategoryDesc,
                      description: prop.description,
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
                                      let prod = data.find(f => f.id === prop.id)
                                      if (prod != null) {
                                          setProductToEdit(prod);
                                          setProductCategoryId(prod.prodCategoryId);
                                          setSupplierId(prod.supplierId);
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
                                      let prod = data.find(p => p.id === prop.id);
                                      if (prod != null) {
                                        warningWithConfirmAndCancelMessage(prod);
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
              
              removeProgressBar();
              setTableData(tableData);
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
                        Header: "Supplier",
                        accessor: "supplier"
                    },
                    {
                        Header: "Product Category",
                        accessor: "productCategory"
                    },
                    {
                      Header: "Description",
                      accessor: "description"
                    },
                    {
                      Header: "Actions",
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
                <h4 className={classes.cardIconTitle}>Edit Product</h4>
              </CardHeader>
              <CardBody>
                <form>
                    <InputLabel htmlFor="supplier-select" className={classes.selectLabel}>
                        Product Category
                    </InputLabel>
                    <Select
                        MenuProps={{
                            className: classes.selectMenu
                        }}
                        classes={{
                            select: classes.select
                        }}
                        value={productCategoryId}
                        onChange={e => {
                            let id = e.target.value;
                            setProductCategoryId(id);

                            let prod = productCategoriesData.find(s => s.id === id);
                            setProductToEdit({
                                ...productToEdit,
                                prodCategoryId: prod.id,
                                prodCategoryDesc: prod.description
                            })
                        }}
                        inputProps={{
                            name: "prodCatSelect",
                            id: "prodCat-select"
                        }}  
                        >   
                        {productCategoriesData.filter(pc => pc.supplier === supplierId).map((prodCat, i) => {     
                            return (
                                <MenuItem
                                    key={i}
                                    classes={{
                                        root: classes.selectMenuItem,
                                        selected: classes.selectMenuItemSelected
                                    }}
                                    value={prodCat.id}
                                    >
                                    {prodCat.description}
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
                        inputProps={{
                        type: "text",
                        onChange: event => {
                            setProductToEdit({
                                ...productToEdit,
                                description: event.target.value
                            })
                        },
                        value: productToEdit.description
                        }}
                    />
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
                </form>
            </CardBody>
            </Card>
        </GridItem>
      }
    </GridContainer>
  );
}
