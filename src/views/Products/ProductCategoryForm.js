import React from "react";
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

const useStyles = makeStyles(styles);

export default function ProductCategoryForm() {
    const [demoSuppliers, setDemoSuppliers] = React.useState([
        {
            "id": 1,
            "description": "Disney"
        },
        {
            "id": 2,
            "description": "World"
        },
        {
            "id": 3,
            "description": "Test"
        }
    ]);
    const [supplierId, setSupplierId] = React.useState(1);
    const [productDescription, setProductCategoryDescription] = React.useState("");
    const [registerProductCategoryDescriptionState, setRegisterProductCategoryDescriptionState] = React.useState("");
    
    const classes = useStyles();

    const submitClick = () => {
        if (productDescription === "") {
            setRegisterProductCategoryDescriptionState("error");
        }
        else {
            let productCategory = {
                supplier: supplierId,
                description: productDescription
            }
    
            console.log(productCategory);
        }
    };

    return (
        <GridItem xs={12} sm={12} md={6}>
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
                            MenuProps={{
                            className: classes.selectMenu
                            }}
                            classes={{
                            select: classes.select
                            }}
                            value={supplierId}
                            onChange={e => setSupplierId(e.target.value)}
                            inputProps={{
                                name: "simpleSelect",
                                id: "simple-select"
                            }}  
                            >   
                            {demoSuppliers.map((supplier, i) => {     
                                return (
                                    <MenuItem
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value = {supplier.id}
                                        >
                                        {supplier.description}
                                    </MenuItem>
                                ) 
                            })}
                        </Select>
                        <CustomInput
                            labelText="Product Category"
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