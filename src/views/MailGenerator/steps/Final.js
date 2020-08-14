import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import CustomInput from "components/CustomInput/CustomInput.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import PictureUpload from "components/CustomUpload/PictureUpload";
import { Button } from "@material-ui/core";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  ...customSelectStyle
};

class Final extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nombreAgente: "",
      image: "",
      fileName: "",
      allStates: this.props.allStates
    };
  }

  sendState() {
    return this.state;
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

  render() {
    const { classes, allStates } = this.props;
    return (
      <GridContainer justify="center">
        <GridItem xs={12} sm={12}>
          <h4 className={classes.infoText}>Final</h4>
        </GridItem>
        <GridItem xs={4} sm={4}>
          <h3 >Tarjetas seleccionadas:</h3>
          {
            allStates !== undefined ?
              <ul>
                {
                  allStates.crucero !== undefined ?
                    <li><h4>Crucero <Button onClick={() => this.props.deleteCard('crucero')}>Eliminar</Button></h4></li> : <></>
                }
                {
                  allStates.disneyHotel !== undefined ?
                    <li><h4>Disney Hotel <Button onClick={() => this.props.deleteCard('disneyHotel')}>Eliminar</Button></h4></li> : <></>
                }
                {
                  allStates.disneyTicket !== undefined ?
                    <li><h4>Disney Ticket <Button onClick={() => this.props.deleteCard('disneyTicket')}>Eliminar</Button></h4></li> : <></>
                }
                {
                  allStates.universalTicket !== undefined ?
                    <li><h4>Universal Ticket <Button onClick={() => this.props.deleteCard('universalTicket')}>Eliminar</Button></h4></li> : <></>
                }
                {
                  allStates.universalHotel !== undefined ?
                    <li><h4>Universal Hotel <Button onClick={() => this.props.deleteCard('universalHotel')}>Eliminar</Button></h4></li>: <></>
                }
                {
                  allStates.otrosDestinos !== undefined ?
                    <li><h4>Otro Destino <Button onClick={() => this.props.deleteCard('otroDestinos')}>Eliminar</Button></h4></li> : <></>
                }
              </ul>
              : <></>
          }
        </GridItem>
        <GridItem xs={4} sm={4}>
          <CustomInput
            labelText="Nombre del Agente"
            id="agente"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              onChange: event => {
                this.setState({
                  nombreAgente: event.target.value
                })
              },
              value: this.state.nombreAgente
            }}
          />
        </GridItem>
        <GridItem xs={4} sm={4}>
          <CustomInput
            labelText="Nombre del Archivo"
            id="filename"
            formControlProps={{
              fullWidth: true
            }}
            inputProps={{
              type: "text",
              onChange: event => {
                let filename = event.target.value
                this.setState({
                  fileName: filename
                })
              },
              value: this.state.fileName
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={4}>
          <PictureUpload base64={this.getImageBase64} />
        </GridItem>
      </GridContainer>
    );
  }
}

Final.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(Final);
