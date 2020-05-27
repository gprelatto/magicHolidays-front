import React, { useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable from "react-table";

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

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";

import { getRequest } from 'common/Request/Requests.js'

const useStyles = makeStyles(styles);

export default function SupplierTable() {
  const classes = useStyles();

  const [tableData, setTableData] = React.useState([]);
  const [suppliersData, setSuppliersData] = React.useState('');
  const [showEdit, setShowEdit] = React.useState(false);
  const [supplier, setSupplier] = React.useState({});

  const submitClick = () => {

  }

  useEffect(() => {
    getRequest('suppliers').then((response) => {
      let responseData = response.data.results;

      setSuppliersData(responseData);
      let data = response.data.results.map((prop, key) => {
        return {
            id: prop.id,
            description: prop.description,
            actions: (
                <>
                    <Button
                        round
                        justIcon
                        simple
                        color="success"
                        className={"edit " + classes.actionButtonRound}
                        key={key}
                        onClick={() => {
                            console.log('supdata', suppliersData);
                            let sup = responseData.find(f => f.id === prop.id)
                            if (sup != null) {
                              console.log(sup);
                              setSupplier({
                                id: sup.id,
                                description: sup.description
                              });
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
                            var newData = suppliersData;
                            newData.find((o, i) => {
                                if (o.id === prop.id) {
                                    console.log("found", o)
                                    return true;
                                }

                                return false;
                            });
                            
                            setSuppliersData([...newData]);
                            }
                        }
                        color="danger"
                        className="remove"
                    >
                        <Close />
                    </Button>
                    <>{" "}</>
                </>
            )
        }
    });

      setTableData(data);
    })
  }, [])

  return (
    <GridContainer>
      { !showEdit ?
          <GridItem xs={12}>
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
                  columns={[
                    {
                      Header: "ID",
                      accessor: "id"
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
                  customCellClasses={[classes.center, classes.right, classes.right]}
                  customClassesForCells={[0, 4, 5]}
                  customHeadCellClasses={[
                    classes.center,
                    classes.right,
                    classes.right
                  ]}
                  customHeadClassesForCells={[0, 4, 5]}
                />
              </CardBody>
            </Card>
          </GridItem>
          : 
          <GridItem xs={12} sm={12} md={6}>
            <Card>
              <CardHeader color="rose" icon>
                <CardIcon color="rose">
                  <MailOutline />
                </CardIcon>
                <h4 className={classes.cardIconTitle}>Edit Supplier</h4>
              </CardHeader>
              <CardBody>
                <form>
                  <CustomInput
                    labelText="Supplier Name"
                    id="description"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "text",
                      onChange: event => {
                        setSupplier({
                            id: supplier.id,
                            description: event.target.value
                        })
                      },
                      value: supplier.description
                    }}
                  />
                  <Button 
                    color="rose"
                    onClick={submitClick}
                  > Submit
                  </Button>
                </form>
              </CardBody>
            </Card>
        </GridItem>
      }
    </GridContainer>
  );
}
