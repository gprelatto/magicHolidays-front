import React from "react";
import PropTypes from "prop-types";
// @material-ui/icons
import Face from "@material-ui/icons/Face";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import Email from "@material-ui/icons/Email";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ImageUpload from "components/CustomUpload/ImageUpload";
import CustomInput from "components/CustomInput/CustomInput.js";

import { Button } from "@material-ui/core";

const style = {
    infoText: {
        fontWeight: "300",
        margin: "10px 0 30px",
        textAlign: "center"
    },
    inputAdornmentIcon: {
        color: "#555"
    },
    inputAdornment: {
        position: "relative"
    }
};

class UniversalHotel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            grupoViajero: "",
            image: "",
            vasoRefillPrecio: "",
            diningPrecio: "",
            fotoPrecio: "",
            precioTotal: "",
            checkIn: "",
            checkOut: "",
            hotel: "",
            habitacion: "",
            tickets: ""
        };
    }

    sendState() {
        return this.state;
    }

    getImageBase64 = (base64) => {
        this.setState({
            image: base64
        })
    }

    change(event, stateName, type, stateNameEqualTo) {
        this.setState({ [stateName]: event.target.value });
    }

    isValidated() {
        return true;
    }

    render() {
        const { classes } = this.props;
        return (
            <GridContainer justify="center">
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText="Check In"
                        id="checkIn"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    checkIn: event.target.value
                                })
                            },
                            value: this.state.checkIn
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText="Check Out"
                        id="checkOut"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    checkOut: event.target.value
                                })
                            },
                            value: this.state.checkOut
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText="Grupo Viajero"
                        id="grupoViajero"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    grupoViajero: event.target.value
                                })
                            },
                            value: this.state.grupoViajero
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText="Hotel"
                        id="hotel"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    hotel: event.target.value
                                })
                            },
                            value: this.state.hotel
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText="Habitacion"
                        id="habitacion"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    habitacion: event.target.value
                                })
                            },
                            value: this.state.habitacion
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={3}>
                    <CustomInput
                        labelText="Tickets"
                        id="tickets"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    tickets: event.target.value
                                })
                            },
                            value: this.state.tickets
                        }}
                    />
                </GridItem>
                <GridItem xs={12} sm={3}>
                    <CustomInput
                        labelText="Precio Total"
                        id="precio"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    precioTotal: event.target.value
                                })
                            },
                            value: this.state.precioTotal
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText="Precio de comidas Quick Service CON VASO REFILL"
                        id="vasoRefill"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    vasoRefillPrecio: event.target.value
                                })
                            },
                            value: this.state.vasoRefillPrecio
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText="Precio de comidas Universal Dining Plan"
                        id="dinningPlan"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    diningPrecio: event.target.value
                                })
                            },
                            value: this.state.diningPrecio
                        }}
                    />
                </GridItem>
                <GridItem xs={12} sm={4}>
                    <CustomInput
                        labelText="Precio Paquete de Fotos"
                        id="precioFoto"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    fotoPrecio: event.target.value
                                })
                            },
                            value: this.state.fotoPrecio
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={5}></GridItem>
                <GridItem xs={4} sm={5}></GridItem>
                <GridItem xs={12} sm={5}>
                    <ImageUpload base64={this.getImageBase64} />
                </GridItem>
            </GridContainer>
        );
    }
}

UniversalHotel.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(UniversalHotel);
