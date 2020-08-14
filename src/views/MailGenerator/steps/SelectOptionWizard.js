import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Checkbox from "@material-ui/core/Checkbox";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import customSelectStyle from "assets/jss/material-dashboard-pro-react/customSelectStyle.js";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.js";

const style = {
  infoText: {
    fontWeight: "300",
    margin: "10px 0 30px",
    textAlign: "center"
  },
  inputAdornmentIcon: {
    color: "#555"
  },
  choiche: {
    textAlign: "center",
    cursor: "pointer",
    marginTop: "20px"
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class SelectOptionWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checks: [],
      selected: ""
    };
  }

  sendState() {
    return this.state;
  }

  handleChange = name => event => {
    if(event.target.checked == true) {
      let checks = this.state.checks;
      checks.push(name)
      this.setState({ 
        checks: checks,
        selected: checks[0]
      });
  
      this.props.childStateCallback(checks[0]);
    } else {
      let checks = this.state.checks.filter(x => x != name);
      this.setState({
        checks: checks
      });

      if(checks.length == 0) {
        this.setState({
          selected: ""
        });
        this.props.childStateCallback("");
      } else if (checks.length == 1){
        this.setState({
          selected: checks[0]
        });
        this.props.childStateCallback(checks[0]);
      }
    }
  };

  isValidated() {
    if(this.state.checks.length == 1) {
      return true;
    }
    
    return false;  
  }

  tarjetaSeleccionada = () => {
    const state = this.state;

    if(state.selected === 'disneyTicket')
      return 'Disney Ticket'
    else if (state.selected === 'disneyHotel')
      return 'Disney Hotel'
    else if (state.selected === 'universalTicket')
      return 'Universal Ticket'
    else if (state.selected === 'universalHotel')
      return 'Universal Hotel'
    else if (state.selected === 'otrosDestinos')
      return 'Otros Destinos'
    else if (state.selected === 'crucero')
      return 'Crucero'
    
    return ''
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <h4 className={classes.infoText}>Tarjeta seleccionada: {this.tarjetaSeleccionada()}</h4>
        <GridContainer justify="center">
          <GridItem xs={12} sm={12} md={12} lg={10}>
            <GridContainer>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("universalTicket")}
                    checkedIcon={
                      <i
                        className={
                          "fas fa-ticket-alt " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    icon={
                      <i
                        className={
                          "fas fa-ticket-alt " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                  />
                  <h6>Universal Ticket</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("universalHotel")}
                    checkedIcon={
                      <i
                        className={
                          "fa fa-bed " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    icon={
                      <i
                        className={
                          "fa fa-bed " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                  />
                  <h6>Universal Hotel</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("otrosDestinos")}
                    checkedIcon={
                      <i
                        className={
                          "fas fa-location-arrow " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    icon={
                      <i
                        className={
                          "fas fa-location-arrow " + classes.iconCheckboxIcon
                        }
                      />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                  />
                  <h6>Otros Destinos</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("disneyTicket")}
                    checkedIcon={
                      <i
                        className={"far fa-star " + classes.iconCheckboxIcon}
                      />
                    }
                    icon={
                      <i
                        className={"far fa-star " + classes.iconCheckboxIcon}
                      />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                  />
                  <h6>Disney Ticket</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("disneyHotel")}
                    checkedIcon={
                      <i
                        className={"far fa-check-circle " + classes.iconCheckboxIcon}
                      />
                    }
                    icon={
                      <i
                        className={"far fa-check-circle " + classes.iconCheckboxIcon}
                      />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                  />
                  <h6>Disney Hotel</h6>
                </div>
              </GridItem>
              <GridItem xs={12} sm={4}>
                <div className={classes.choiche}>
                  <Checkbox
                    tabIndex={-1}
                    onClick={this.handleChange("crucero")}
                    checkedIcon={
                      <i
                        className={"fas fa-ship " + classes.iconCheckboxIcon}
                      />
                    }
                    icon={
                      <i
                        className={"fas fa-ship " + classes.iconCheckboxIcon}
                      />
                    }
                    classes={{
                      checked: classes.iconCheckboxChecked,
                      root: classes.iconCheckbox
                    }}
                  />
                  <h6>Crucero</h6>
                </div>
              </GridItem>
            </GridContainer>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

SelectOptionWizard.propTypes = {
  classes: PropTypes.object
};

export default withStyles(style)(SelectOptionWizard);
