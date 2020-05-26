import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import ReactTable from "react-table";

// material-ui icons
import Assignment from "@material-ui/icons/Assignment";
import Person from "@material-ui/icons/Person";
import Edit from "@material-ui/icons/Edit";
import Close from "@material-ui/icons/Close";
import Check from "@material-ui/icons/Check";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import MailOutline from "@material-ui/icons/MailOutline";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardIcon from "components/Card/CardIcon.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.js";

import product1 from "assets/img/product1.jpg";
import product2 from "assets/img/product2.jpg";
import product3 from "assets/img/product3.jpg";

import Dvr from "@material-ui/icons/Dvr";
import Favorite from "@material-ui/icons/Favorite";
import { createImportSpecifier } from "typescript";
import { Hidden } from "@material-ui/core";

const useStyles = makeStyles(styles);

export default function SupplierTable() {
  const classes = useStyles();

  const [showEdit, setShowEdit] = React.useState(false);
  const [supplier, setSupplier] = React.useState({});

  const submitClick = () => {
    console.log(supplier);
  }

  const [demoData, setDemoData] = React.useState(
        [
            {
                id: 1,
                description: "Test"
            },
            {
                id: 2,
                description: "Test2"
            },
            {
                id: 3,
                description: "Test3"
            },
            {
                id: 4,
                description: "Test3"
            },
            {
                id: 5,
                description: "Test3"
            },
            {
                id: 6,
                description: "Test3"
            } 
        ].map((prop, key) => {
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
                                let sup = demoData.find(f => f.id === prop.id)
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
                                var newData = demoData;
                                newData.find((o, i) => {
                                    if (o.id === prop.id) {
                                        console.log("found", o)
                                        return true;
                                    }

                                    return false;
                                });
                                
                                setDemoData([...newData]);
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
        })
    );

  const roundButtons = [
    { color: "success", icon: Edit },
    { color: "danger", icon: Close }
  ].map((prop, key) => {
    return (
      <Button
        round
        color={prop.color}
        className={classes.actionButton + " " + classes.actionButtonRound}
        key={key}
        onClick={() => console.log("test")}
      >
        <prop.icon className={classes.icon} />
      </Button>
    );
  });

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
                  data={demoData}
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
