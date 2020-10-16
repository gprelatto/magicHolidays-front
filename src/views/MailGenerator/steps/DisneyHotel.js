import React from "react";
import PropTypes from "prop-types";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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

const titulos = [
  {
    "id": 0,
    "descripcion": "Disneyland California - Hotel"
  },
  {
    "id": 1,
    "descripcion": "Walt Disney Orlando - Hotel"
  }
]

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
      tickets: "",
      tarjeta: "disneyHotel",
      tituloId: 0,
      titulo: titulos.find(f => f.id === 0).descripcion
    };
  }

  sendState() {
    let state = this.state;
    this.setState({
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
      tickets: "",
      tarjeta: "disneyHotel",
      tituloId: 0,
      titulo: ""
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
    const { classes, t } = this.props;
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
            labelText={t('wizard.step.disneyHotel.travelerGroup')}
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
            labelText={t('wizard.step.disneyHotel.room')}
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
            labelText={t('wizard.step.disneyHotel.foodPlanName')}
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
            labelText={t('wizard.step.disneyHotel.totalPriceFoodPlan')}
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
            labelText={t('wizard.step.disneyHotel.totalPriceWithoutFoodPlan')}
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
            labelText={t('wizard.step.disneyHotel.what')}
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
          <Button onClick={this.agregarPlanDeComida}>{t('wizard.step.disneyHotel.addFoodPlan')}</Button>
        </GridItem>
        <GridItem xs={12} sm={5}>
          <h3 >{t('wizard.step.disneyHotel.foodPlans')}:</h3>
          <ul>
            {
              this.state.planDeComida.map((p) => {
                return (<li><h4>{p.nombrePlanComida} <Button onClick={() => this.deletePlan(p.nombrePlanComida)}>{t('wizard.step.disneyHotel.delete')}</Button></h4></li>)
              })
            }
          </ul>
        </GridItem>
        <GridItem xs={12} sm={5}>
          <CustomInput
            labelText={t('wizard.step.disneyHotel.optional')}
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
            labelText={t('wizard.step.disneyHotel.optionalPrice')}
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
          <Button onClick={this.agregarServicioOpcional}>{t('wizard.step.disneyHotel.addService')}</Button>
        </GridItem>
        <GridItem xs={12} sm={5}>
          <h3 >{t('wizard.step.disneyHotel.optionalServices')}:</h3>
          <ul>
            {
              this.state.serviciosOpcionales.map((p) => {
              return (<li><h4>{p.servicioOpcional} <Button onClick={() => this.deleteServicio(p.servicioOpcional)}>{t('wizard.step.disneyHotel.delete')}</Button></h4></li>)
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

export default withTranslation()(withStyles(style)(DisneyHotel));
