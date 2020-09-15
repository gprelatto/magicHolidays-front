import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import ImageUpload from "components/CustomUpload/ImageUpload";
import { Button } from "@material-ui/core";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  ...customSelectStyle
};

const titulos = [
  {
    "id": 0,
    "descripcion": "Disneyland California - Ticket"
  },
  {
    "id": 1,
    "descripcion": "Walt Disney Orlando - Ticket"
  }
]

class DisneyTicket extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grupoViajero: "",
      tickets: "",
      image: "",
      nombrePlanComida: "",
      precioTotalConPlan: "",
      precioTotalSinPlan: "",
      incluye: "",
      planDeComida: [],
      servicioOpcional: "",
      importeServicio: "",
      serviciosOpcionales: [],
      tarjeta: "disneyTicket",
      tituloId: 0,
      titulo: titulos.find(f => f.id === 0).descripcion
    };
  }
  sendState() {
    let state = this.state;
    this.setState({
      grupoViajero: "",
      tickets: "",
      image: "",
      nombrePlanComida: "",
      precioTotalConPlan: "",
      precioTotalSinPlan: "",
      incluye: "",
      planDeComida: [],
      servicioOpcional: "",
      importeServicio: "",
      serviciosOpcionales: [],
      tarjeta: "disneyTicket",
      tituloId: 0,
      titulo: ""
    });

    return state;
  }

  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  isValidated() {
    return true;
  }

  getImageBase64 = (base64) => {
    this.setState({
      image: base64
    })
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
        <GridItem xs={4} sm={4}></GridItem>
        <GridItem xs={4} sm={4}>
          <Select
            MenuProps={{
              className: classes.infoText
            }}
            classes={{
              select: classes.select
            }}
            value={this.state.tituloId}
            onChange={e => {
              this.setState({
                tituloId: e.target.value,
                titulo: titulos.find(f => f.id === e.target.value).descripcion
              }
            )}}
            inputProps={{
              name: "tituloSelect",
              id: "tituloSelect"
            }}
          >
            {titulos.map((t, i) => {
              return (
                <MenuItem
                  key={i}
                  classes={{
                    root: classes.selectMenuItem,
                    selected: classes.selectMenuItemSelected
                  }}
                  value={t.id}
                >
                  {t.descripcion}
                </MenuItem>
              )
            })}
          </Select>
        </GridItem>
        <GridItem xs={2} sm={2}></GridItem>
        <GridItem xs={4} sm={5}>
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
        <GridItem xs={12} sm={5}>
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
        <GridItem xs={12} sm={5}>
          <CustomInput
            labelText="Precio Total"
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
        <GridItem xs={12} sm={12}>
          <br />
          <br />
        </GridItem>
        <GridItem xs={12} sm={4}>
          <ImageUpload base64={this.getImageBase64} />
        </GridItem>
      </GridContainer>
    );
  }
}

DisneyTicket.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(DisneyTicket);
