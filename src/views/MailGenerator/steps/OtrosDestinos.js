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

import { withTranslation } from 'react-i18next' 

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
            actividadesExtra: [],
            tarjeta: "otrosDestinos"
        };
    }

    sendState() {
        let state = this.state;

        this.setState({
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
            actividadesExtra: [],
            tarjeta: "otrosDestinos"
        });

        return state;
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

    deleteActividad = (serv) => {
        let act = this.state.actividadesExtra;
        act = act.filter(x => x.actividad !== serv);
        this.setState(prevState => ({
            ...prevState,
            actividadesExtra: act
        }))
    }

    render() {
        const { classes, t } = this.props;
        return (
            <GridContainer justify="center">
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.other.destiny')}
                        id="destino"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                let dest = event.target.value
                                this.setState({
                                    destino: dest
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
                                let checkin = event.target.value
                                this.setState({
                                    checkIn: checkin
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
                                let checkout = event.target.value
                                this.setState({
                                    checkOut: checkout
                                })
                            },
                            value: this.state.checkOut
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.disneyHotel.travelerGroup')}
                        id="grupoViajero"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                let grupo = event.target.value
                                this.setState({
                                    grupoViajero: grupo
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
                                let hotel = event.target.value
                                this.setState({
                                    hotel: hotel
                                })
                            },
                            value: this.state.hotel
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.disneyHotel.room')}
                        id="habitacion"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                let hab = event.target.value
                                this.setState({
                                    habitacion: hab
                                })
                            },
                            value: this.state.habitacion
                        }}
                    />
                </GridItem>
                <GridItem xs={12} sm={3}>
                    <CustomInput
                        labelText={t('wizard.step.other.price')}
                        id="precio"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                let total = event.target.value
                                this.setState({
                                    precioTotal: total
                                })
                            },
                            value: this.state.precioTotal
                        }}
                    />
                </GridItem>
                <GridItem xs={12} sm={4}></GridItem>
                <GridItem xs={12} sm={3}>
                    <CustomInput
                        labelText={t('wizard.step.other.payment')}
                        id="formaPago"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                let pago = event.target.value
                                this.setState({
                                    formaDePago: pago
                                })
                            },
                            value: this.state.formaDePago
                        }}
                    />
                </GridItem>
                <GridItem xs={12} sm={5}>
                    <CustomInput
                        labelText={t('wizard.step.other.extra')}
                        id="actividadExtra"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                let act = event.target.value;
                                this.setState({
                                    actividad: act
                                })
                            },
                            value: this.state.actividad
                        }}
                    />
                    <CustomInput
                        labelText={t('wizard.step.other.extraPrice')}
                        id="importe"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                let e = event.target.value;
                                this.setState({
                                    precio: e
                                })
                            },
                            value: this.state.precio
                        }}
                    />
                    <Button onClick={this.agregarActividadExtra}>{t('wizard.step.other.add')}</Button>
                </GridItem>
                <GridItem xs={12} sm={5}>
                    <h3 >{t('wizard.step.other.extras')}:</h3>
                    <ul>
                        {
                            this.state.actividadesExtra.map((p) => {
                            return (<li><h4>{p.actividad} <Button onClick={() => this.deleteActividad(p.actividad)}>{t('wizard.step.disneyHotel.delete')}</Button></h4></li>)
                            })
                        }
                    </ul>
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

export default withTranslation()(withStyles(style)(OtrosDestinos));
