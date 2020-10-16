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

class Crucero extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nombreBarco: "",
            destino: "",
            image: "",
            fecha: "",
            numeroNoches: "",
            viajeros: "",
            razonViaje: "",
            dia: "",
            puerto: "",
            salida: "",
            llegada: "",
            tablaDias: [],
            tipoCabina: "",
            tipoCabinaPrecio: "",
            cabinas: [],
            fechaPago1: "",
            fechaPago2: "",
            tarjeta: "crucero"
        };
    }

    sendState() {
        let state = this.state;

        this.setState({
            nombreBarco: "",
            destino: "",
            image: "",
            fecha: "",
            numeroNoches: "",
            viajeros: "",
            razonViaje: "",
            dia: "",
            puerto: "",
            salida: "",
            llegada: "",
            tablaDias: [],
            tipoCabina: "",
            tipoCabinaPrecio: "",
            cabinas: [],
            fechaPago1: "",
            fechaPago2: "",
            tarjeta: "crucero"
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

    agregarCabinas = () => {
        let cabinas = this.state.cabinas;

        cabinas.push(
            {
                tipoCabina: this.state.tipoCabina,
                tipoCabinaPrecio: this.state.tipoCabinaPrecio
            }
        );

        this.setState({
            tipoCabina: "",
            tipoCabinaPrecio: ""
        });
    }

    agregarDias = () => {
        let tabla = this.state.tablaDias;

        tabla.push(
            {
                puerto: this.state.puerto,
                salida: this.state.salida,
                llegada: this.state.llegada,
            }
        );

        this.setState({
            puerto: "",
            salida: "",
            llegada: "",
        });
    }

    deletePuerto = (pto) => {
        let puertos = this.state.tablaDias;
        puertos = puertos.filter(x => x.puerto !== pto);
        this.setState(prevState => ({
            ...prevState,
            tablaDias: puertos
        }))
    }

    deleteCabina = (cab) => {
        let cabs = this.state.cabinas;
        cabs = cabs.filter(x => x.tipoCabina !== cab);
        this.setState(prevState => ({
            ...prevState,
            cabinas: cabs
        }))
    }

    render() {
        const { classes, t } = this.props;
        return (
            <GridContainer justify="center">
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.shipname')}
                        id="nombreBarco"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    nombreBarco: event.target.value
                                })
                            },
                            value: this.state.nombreBarco
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.destination')}
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
                        labelText={t('wizard.step.cruice.date')}
                        id="fecha"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    fecha: event.target.value
                                })
                            },
                            value: this.state.fecha
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.nights')}
                        id="numeroNoches"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    numeroNoches: event.target.value
                                })
                            },
                            value: this.state.numeroNoches
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.travelers')}
                        id="viajeros"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    viajeros: event.target.value
                                })
                            },
                            value: this.state.viajeros
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.reason')}
                        id="razonDelViaje"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    razonViaje: event.target.value
                                })
                            },
                            value: this.state.razonViaje
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.firstDate')}
                        id="pago1"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    fechaPago1: event.target.value
                                })
                            },
                            value: this.state.fechaPago1
                        }}
                    />
                </GridItem>
                <GridItem xs={4} sm={4}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.limitDate')}
                        id="pago2"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    fechaPago2: event.target.value
                                })
                            },
                            value: this.state.fechaPago2
                        }}
                    />
                </GridItem>
                <GridItem xs={12} sm={5}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.port')}
                        id="puerto"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    puerto: event.target.value
                                })
                            },
                            value: this.state.puerto
                        }}
                    />
                    <CustomInput
                        labelText={t('wizard.step.cruice.departure')}
                        id="salida"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    salida: event.target.value
                                })
                            },
                            value: this.state.salida
                        }}
                    />
                    <CustomInput
                        labelText={t('wizard.step.cruice.arrival')}
                        id="llegada"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    llegada: event.target.value
                                })
                            },
                            value: this.state.llegada
                        }}
                    />
                    <Button onClick={this.agregarDias}>{t('wizard.step.cruice.addday')}</Button>
                </GridItem>
                <GridItem xs={12} sm={5}>
                    <h3 >{t('wizard.step.cruice.days')}:</h3>
                    <ul>
                        {
                            this.state.tablaDias.map((p) => {
                                return (<li><h4>{p.puerto} <Button onClick={() => this.deletePuerto(p.puerto)}>Eliminar</Button></h4></li>)
                            })
                        }
                    </ul>
                </GridItem>
                <GridItem xs={12} sm={5}>
                    <CustomInput
                        labelText={t('wizard.step.cruice.cabintype')}
                        id="tipoCabina"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    tipoCabina: event.target.value
                                })
                            },
                            value: this.state.tipoCabina
                        }}
                    />
                    <CustomInput
                        labelText={t('wizard.step.cruice.cabinprice')}
                        id="precioCabina"
                        formControlProps={{
                            fullWidth: true
                        }}
                        inputProps={{
                            type: "text",
                            onChange: event => {
                                this.setState({
                                    tipoCabinaPrecio: event.target.value
                                })
                            },
                            value: this.state.tipoCabinaPrecio
                        }}
                    />
                    <Button onClick={this.agregarCabinas}>{t('wizard.step.cruice.add')}</Button>
                </GridItem>
                <GridItem xs={12} sm={5}>
                    <h3 >{t('wizard.step.cruice.cabins')}:</h3>
                    <ul>
                        {
                            this.state.cabinas.map((p) => {
                                return (<li><h4>{p.tipoCabina} <Button onClick={() => this.deleteCabina(p.tipoCabina)}>Eliminar</Button></h4></li>)
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

Crucero.propTypes = {
    classes: PropTypes.object
};

export default withTranslation()(withStyles(style)(Crucero));
