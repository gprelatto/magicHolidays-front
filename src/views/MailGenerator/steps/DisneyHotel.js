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

class DisneyHotel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checkIn: "",
      checkOut: "",
      grupoViajero: "",
      hotel: "",
      habitacion: "",
      image: "",
      nombrePlanComida: "",
      precioTotalConPlan: "",
      precioTotalSinPlan: "",
      incluye: "",
      planDeComida: [],
      servicioOpcional: "",
      importeServicio: "",
      serviciosOpcionales: [],
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

  agregarPlanDeComida = () => {
    let planes = this.state.planDeComida;

    planes.push(
      {
        nombrePlanComida: this.state.nombrePlanComida,
        precioTotalConPlan: this.state.precioTotalConPlan,
        precioTotalSinPlan: this.state.precioTotalSinPlan,
        incluye: this.state.incluye
      }
    )

    this.setState({
      nombrePlanComida: "",
      precioTotalConPlan: "",
      precioTotalSinPlan: "",
      incluye: ""
    });
  }

  agregarServicioOpcional = () => {
    let servicios = this.state.serviciosOpcionales;

    servicios.push(
      {
        servicioOpcional: this.state.servicioOpcional,
        importeServicio: this.state.importeServicio
      }
    );

    this.setState({
      servicioOpcional: "",
      importeServicio: ""
    });
  }

  deletePlan = (plan) => {
    let planes = this.state.planDeComida;
    planes = planes.filter(x => x.nombrePlanComida !== plan);
    this.setState(prevState => ({
      ...prevState,
      planDeComida: planes
    }))
  }

  deleteServicio = (serv) => {
    let servicios = this.state.serviciosOpcionales;
    servicios = servicios.filter(x => x.servicioOpcional !== serv);
    this.setState(prevState => ({
      ...prevState,
      serviciosOpcionales: servicios
    }))
  }

  render() {
    const { classes } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>Walt Disney World - Hotel</h4>
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
        <GridItem xs={12} sm={5}>
          <CustomInput
            labelText="Nombre Plan de Comida"
            id="nombrePlanComida"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              onChange: event => {
                this.setState({
                  nombrePlanComida: event.target.value
                })
              },
              value: this.state.nombrePlanComida
            }}
          />
          <CustomInput
            labelText="Precio Total Con Plan de Comida"
            id="precioCon"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              onChange: event => {
                this.setState({
                  precioTotalConPlan: event.target.value
                })
              },
              value: this.state.precioTotalConPlan
            }}
          />
          <CustomInput
            labelText="Precio Total Sin Plan de Comida"
            id="precioCon"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              onChange: event => {
                this.setState({
                  precioTotalSinPlan: event.target.value
                })
              },
              value: this.state.precioTotalSinPlan
            }}
          />
          <CustomInput
            labelText="Que incluye el plan?"
            id="incluye"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              onChange: event => {
                this.setState({
                  incluye: event.target.value
                })
              },
              value: this.state.incluye
            }}
          />
          <Button onClick={this.agregarPlanDeComida}>Agregar Plan</Button>
        </GridItem>
        <GridItem xs={12} sm={5}>
          <h3 >Planes de comida:</h3>
          <ul>
            {
              this.state.planDeComida.map((p) => {
                return (<li><h4>{p.nombrePlanComida} <Button onClick={() => this.deletePlan(p.nombrePlanComida)}>Eliminar</Button></h4></li>)
              })
            }
          </ul>
        </GridItem>
        <GridItem xs={12} sm={5}>
          <CustomInput
            labelText="Servicio Opcional"
            id="servicioOpcional"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              onChange: event => {
                this.setState({
                  servicioOpcional: event.target.value
                })
              },
              value: this.state.servicioOpcional
            }}
          />
          <CustomInput
            labelText="Importe del Servicio"
            id="importeServicio"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              onChange: event => {
                this.setState({
                  importeServicio: event.target.value
                })
              },
              value: this.state.importeServicio
            }}
          />
          <Button onClick={this.agregarServicioOpcional}>Agregar Servicio</Button>
        </GridItem>
        <GridItem xs={12} sm={5}>
          <h3 >Servicios Opcionales:</h3>
          <ul>
            {
              this.state.serviciosOpcionales.map((p) => {
                return (<li><h4>{p.servicioOpcional} <Button onClick={() => this.deleteServicio(p.servicioOpcional)}>Eliminar</Button></h4></li>)
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

DisneyHotel.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(DisneyHotel);
