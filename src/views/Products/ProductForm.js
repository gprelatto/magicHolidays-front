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

export default function ProductForm() {
    const [demoProductCategories, setDemoProductCategories] = React.useState([
        {
            "id": 1,
            "description": "Ticket"
        },
        {
            "id": 2,
            "description": "Hotel"
        },
        {
            "id": 3,
            "description": "Flight"
        }
    ]);
    const [productCategoryId, setProductCategoryId] = React.useState(1);
    const [productDescription, setProductDescription] = React.useState("");
    const [registerProductDescriptionState, setRegisterProductDescriptionState] = React.useState("");
    
    const classes = useStyles();

    const submitClick = () => {
        if (productDescription === "") {
            setRegisterProductDescriptionState("error");
        }
        else {
            let product = {
                product_category: productCategoryId,
                description: productDescription
            }
    
            console.log(product);
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
                        <InputLabel htmlFor="simple-select" className={classes.selectLabel}>
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
                            onChange={e => setProductCategoryId(e.target.value)}
                            inputProps={{
                                name: "simpleSelect",
                                id: "simple-select"
                            }}  
                            >   
                            {demoProductCategories.map((productCategory, i) => {     
                                return (
                                    <MenuItem
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