import React from "react";
import PropTypes from "prop-types";

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

class OtrosDestinos extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            destino: "",
            grupoViajero: "",
            image: "",
            precioTotal: "",
            checkIn: "",
            checkOut: "",
            hotel: "",
            habitacion: "",
            formaDePago: "",
            actividad: "",
            precio: "",
            actividadesExtra: []
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

    agregarActividadExtra = () => {
        let actividades = this.state.actividadesExtra;

        actividades.push(
            {
                actividad: this.state.actividad,
                precio: this.state.precio
            }
        );

        this.setState({
            actividad: "",
            precio: ""
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <GridContainer justify="center">
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText="Destino"
                        id="destino"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    destino: event.target.value
                                })
                            },
                            value: this.state.destino
                        }}
                    />
                </GridItem>
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
                <GridItem xs={12} sm={3}>
                    <CustomInput
                        labelText="Forma de Pago"
                        id="formaPago"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    formaDePago: event.target.value
                                })
                            },
                            value: this.state.formaDePago
                        }}
                    />
                </GridItem>
                <GridItem xs={12} sm={5}>
                    <CustomInput
                        labelText="Actividad Extra"
                        id="actividadExtra"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    actividad: event.target.value
                                })
                            },
                            value: this.state.actividad
                        }}
                    />
                    <CustomInput
                        labelText="Importe de la Actividad"
                        id="importe"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    precio: event.target.value
                                })
                            },
                            value: this.state.precio
                        }}
                    />
                    <Button onClick={this.agregarActividadExtra}>Agregar Actividad</Button>
                </GridItem>
                <GridItem xs={12} sm={4}>
                    <ImageUpload base64={this.getImageBase64} />
                </GridItem>
            </GridContainer>
        );
    }
}

OtrosDestinos.propTypes = {
    classes: PropTypes.object
};

export default withStyles(style)(OtrosDestinos);
