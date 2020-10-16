import React from "react";
import PropTypes from "prop-types";
// @material-ui/icons

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import ImageUpload from "components/CustomUpload/ImageUpload";
import CustomInput from "components/CustomInput/CustomInput.js";

import { withTranslation } from 'react-i18next' 


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

class UniversalTicket extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grupoViajero: "",
      image: "",
      vasoRefillPrecio: "",
      diningPrecio: "",
      fotoPrecio: "",
      precioTotal: "",
      tickets: "",
      tarjeta: "universalTicket"
    };
  }

  sendState() {
    let state = this.state;

    this.setState({
      grupoViajero: "",
      image: "",
      vasoRefillPrecio: "",
      diningPrecio: "",
      fotoPrecio: "",
      precioTotal: "",
      tickets: "",
      tarjeta: "universalTicket"
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

  render() {
    const { classes, t } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>Universal - Ticket</h4>
        </GridItem>
        <GridItem xs={4} sm={4}>
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
                this.setState({
                  grupoViajero: event.target.value
                })
              },
              value: this.state.grupoViajero
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={3}>
          <CustomInput
            labelText={t('wizard.step.disney.totalPrice')}
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
            labelText={t('wizard.step.universal.quickService')}
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
            labelText={t('wizard.step.universal.dinning')}
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
        <GridItem xs={4} sm={4}>
          <CustomInput
            labelText={t('wizard.step.universal.photos')}
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
        <GridItem xs={12} sm={4}>
          <ImageUpload base64={this.getImageBase64} />
        </GridItem>
      </GridContainer>
    );
  }
}

UniversalTicket.propTypes = {
  classes: PropTypes.object
};

export default withTranslation()(withStyles(style)(UniversalTicket));
