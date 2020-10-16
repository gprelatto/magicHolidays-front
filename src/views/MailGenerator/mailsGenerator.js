import React from "react";
import PropTypes from "prop-types";

import ReactDOM from 'react-dom';
import "./css/estilos.css"
import { PDFExport } from '@progress/kendo-react-pdf';
import Button from "components/CustomButtons/Button.js";

import { withTranslation } from 'react-i18next'

class Template extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: {},
      fileName: ""
    }
  }

  componentWillMount() {
    if (this.props.cards !== undefined) {
      this.setState({
        cards: this.props.cards
      })
    }
  }

  exportPDF = () => {
    this.getFileName();
    this.resume.save();
  }

  beneficiosDisney = () => {
    const { t } = this.props;

    return (
      <div>
        <h3 className="beneficios">
          {t('pdf.disneyBenefit.1')}:
          <br />
          <br />
          <img
            src={require("./img/estrella.png")}
            alt="estrella"
            width="19px"
            className="estrella"
          />
          {t('pdf.disneyBenefit.2')}
          <br />
          <img
            src={require("./img/estrella.png")}
            alt="estrella"
            width="19px"
            className="estrella"
          />
          {t('pdf.disneyBenefit.3')}
          <br />
          <img
            src={require("./img/estrella.png")}
            alt="estrella"
            width="19px"
            className="estrella"
          />
          {t('pdf.disneyBenefit.4')}
          <br />
          <img
            src={require("./img/estrella.png")}
            alt="estrella"
            width="19px"
            className="estrella"
          />
          {t('pdf.disneyBenefit.5')}
          <br />
          <br />
          {t('pdf.disneyBenefit.6')}:
          <br />
          {t('pdf.disneyBenefit.7')}
          <br />
          <br />
          {t('pdf.disneyBenefit.8')}:
          <br />
          {t('pdf.disneyBenefit.9')}
        </h3>
      </div>
    )
  }

  beneficioUniversal = () => {
    const { t } = this.props;

    return (
      <div>
        <h3 className="beneficios">
          {t('pdf.universal.1')}:
          <br />
          {t('pdf.universal.2')}
          <br />
          {t('pdf.universal.3')}
        </h3>
      </div>
    )
  }

  beneficioUniversalTicket = () => {
    const { t } = this.props;

    return (
      <div>
        <h3 className="beneficios">
          {t('pdf.universal.4')}:
          <br />
          {t('pdf.universal.5')}
        </h3>
      </div>
    )
  }

  beneficiosDisneyTicket = () => {
    const { t } = this.props;

    return (
      <div>
        <h3 className="beneficios">
          {t('pdf.disney.1')}:
        <br />
          {t('pdf.disney.2')}
          <br />
          <br />
          {t('pdf.disney.3')}:
          <br />
          {t('pdf.disney.4')}
        </h3>
      </div>
    )
  }

  getFileName = () => {
    const { t } = this.props;

    if (this.props.cards !== undefined) {
      if (this.props.cards.final.fileName !== "") {
        return t('pdf.budget') + "_" + this.props.cards.final.fileName + ".pdf"
      }
    }

    const date = new Date();
    const day = date.getDay() < 10 ? "0" + date.getDay().toString() : date.getDay().toString();
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : date.getMonth().toString();

    return t('pdf.budget') + "_" + year + month + day + ".pdf"
  }

  render() {
    const { t } = this.props;

    if (Object.keys(this.props).length === 0)
      return <></>
    else
      return (
        <>
          <Button onClick={this.exportPDF}>{t('pdf.download')}</Button>
          <Button onClick={() => this.props.returnToWizard(false)}>{t('pdf.goBack')}</Button>
          <PDFExport
            paperSize="auto"
            fileName={this.getFileName()}
            ref={(r) => this.resume = r}>
            <div >
              <div className="body">
                <meta charSet="UTF-8" />
                <meta
                  name="viewport"
                  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
                />
                <title>magic_holidays</title>
                <link rel="stylesheet" href="css/estilos.css" />
                <div id="contenedor">
                  <div id="logo">
                    <img src={require("./img/logo.png")} alt="logo" />
                  </div>
                  <div id="presentacion">
                    {/* PRESENTACION */}
                    {
                      this.state.cards.final !== undefined ?
                        <h1 className="h1">{this.state.cards.final.nombreAgente}</h1> : <></>
                    }
                    <h2 className="h2">{t('pdf.welcome.1')}</h2>
                    <h3 className="h3">
                      {t('pdf.welcome.2')}<br />
                      <br />
                      {t('pdf.welcome.3')} <br />
                      <br />
                      {t('pdf.welcome.4')} <br />
                      <br />
                      <br />
                      {t('pdf.welcome.5')}
                    </h3>
                  </div>

                  {/* DISNEY TICKET */}
                  {
                    this.state.cards.disneyTicket !== undefined ?
                      this.state.cards.disneyTicket.map(card => {
                        return (
                          <section id="walt">
                            <div className="bordes-plan">
                              <div>
                                <h1 className="h1 titular">{card.titulo}</h1>
                              </div>
                              <div className="lugar">
                                <img src={card.image} alt="disney" className="foto" />
                                <h4 className="datos">
                                  {t('wizard.step.disneyHotel.travelerGroup').toUpperCase()}: <span className="span">{card.grupoViajero}</span>
                                  <br />
                                TICKETS: <span className="span">  {card.tickets}</span>
                                  <br />
                                </h4>
                              </div>
                              {
                                <div id="plan-disney">
                                  <article className="articulo">
                                    <h3 className="h3">
                                      {t('wizard.step.disney.totalPrice')}: {card.precioTotalConPlan}
                                      <br />
                                      {
                                        card.serviciosOpcionales.length > 0 ?
                                          <>
                                            {t('wizard.step.disneyHotel.optionalServices')} DISNEY:
                                      <br />
                                          </>
                                          : <></>
                                      }
                                      {
                                        card.serviciosOpcionales.map((servicio) => {
                                          return (
                                            <>
                                              {servicio.servicioOpcional}: {servicio.importeServicio}
                                              <br />
                                            </>
                                          );
                                        })
                                      }
                                    </h3>
                                  </article>
                                  <article className="articulo1">
                                    <h3 className="h3">
                                      {
                                        card.planDeComida.length > 0 ?
                                          <>
                                            {t('pdf.meal.1')}:
                                      <br />
                                            {t('pdf.meal.2')}
                                            <br />
                                            <br />
                                            {
                                              card.planDeComida.map(plan => {
                                                return (
                                                  <>
                                                    {t('pdf.meal.3')} {plan.nombrePlanComida} {t('pdf.meal.4')}:
                                          <br />
                                                    {plan.incluye}
                                                    <br />
                                                  </>
                                                );
                                              })
                                            }
                                          </> : <></>
                                      }
                                      <br />
                                    </h3>
                                  </article>
                                </div>
                              }
                            </div>
                            {this.beneficiosDisneyTicket()}
                          </section>
                        )
                      }) : <></>
                  }

                  {/* DISNEY HOTEL */}
                  {
                    this.state.cards.disneyHotel !== undefined ?
                      this.state.cards.disneyHotel.map(card => {
                        return (
                          <section id="walt">
                            <div className="bordes-plan">
                              <div>
                                <h1 className="h1 titular">{card.titulo}</h1>
                              </div>
                              <div className="lugar">
                                <img src={card.image} alt="disney" className="foto" />
                                <h4 className="datos">
                                  CHECK IN : <span className="span"> {card.checkIn} </span>
                                  <br />
                                CHECK OUT: <span className="span"> {card.checkOut} </span>
                                  <br />
                                  {t('wizard.step.disneyHotel.travelerGroup').toUpperCase()}: <span className="span"> {card.grupoViajero} </span>
                                  <br />
                                HOTEL: <span className="span"> {card.hotel} </span>
                                  <br />
                                  {t('wizard.step.disneyHotel.room').toUpperCase()}: <span className="span"> {card.habitacion} </span>
                                  <br />
                                TICKETS: <span className="span">{card.tickets}</span>
                                  <br />
                                </h4>
                              </div>
                              {
                                card.planDeComida.length > 0 || card.serviciosOpcionales.length > 0 ?
                                  <div id="plan-disney">
                                    <article className="articulo">
                                      <h3 className="h3">
                                        {
                                          card.planDeComida.map(plan => {
                                            return (
                                              <>
                                                {t('pdf.meal.1')}:   {plan.nombrePlanComida}
                                                <br />
                                                {t('wizard.step.disneyHotel.totalPriceFoodPlan')}:   {plan.precioTotalConPlan}
                                                <br />
                                                {t('wizard.step.disneyHotel.totalPriceWithoutFoodPlan')}:   {plan.precioTotalSinPlan}
                                                <br />
                                                <br />
                                              </>
                                            );
                                          })
                                        }
                                        <h3 className="h3"></h3>
                                        {
                                          card.serviciosOpcionales.length > 0 ?
                                            <>
                                              {t('wizard.step.disneyHotel.optionalServices')} DISNEY:
                                        <br />
                                            </>
                                            : <></>
                                        }
                                        {
                                          card.serviciosOpcionales.map((servicio) => {
                                            return (
                                              <>
                                                {servicio.servicioOpcional}: {servicio.importeServicio}
                                                <br />
                                              </>
                                            );
                                          })
                                        }
                                      </h3>
                                    </article>
                                    <article className="articulo1">
                                      <h3 className="h3">
                                        {
                                          card.planDeComida.length > 0 ?
                                            <>
                                              {t('pdf.meal.1')}:
                                        <br />
                                              {t('pdf.meal.2')}
                                              <br />
                                              <br />
                                              {
                                                card.planDeComida.map(plan => {
                                                  return (
                                                    <>
                                                      {t('pdf.meal.3')} {plan.nombrePlanComida} {t('pdf.meal.4')}:
                                          <br />
                                                      {plan.incluye}
                                                      <br />
                                                    </>
                                                  );
                                                })
                                              }
                                            </> : <></>
                                        }
                                        <br />
                                      </h3>
                                    </article>
                                  </div>
                                  : <></>
                              }
                            </div>
                            {this.beneficiosDisney()}
                          </section>
                        )
                      }) : <></>
                  }

                  {/* UNIVERSAL TICKET */}
                  {
                    this.state.cards.universalTicket !== undefined ?
                      this.state.cards.universalTicket.map(card => {
                        return (
                          <section id="universal">
                            <div className="bordes-plan">
                              <div>
                                <h1 className="h1 titular">Universal - Ticket</h1>
                              </div>
                              <div className="lugar">
                                <img
                                  src={card.image}
                                  alt="disney"
                                  width={506}
                                  className="foto"
                                />
                                <h4 className="datos">
                                  {t('wizard.step.disneyHotel.travelerGroup').toUpperCase()}: <span className="span">{card.grupoViajero}</span>
                                  <br />
                            TICKETS: <span className="span">{card.tickets}</span>
                                  <br />
                                  {t('wizard.step.disney.totalPrice').toUpperCase()}: <span className="span">{card.precioTotal}</span>
                                </h4>
                              </div>
                              <div id="plan-universal">
                                <article className="articulo-u">
                                  <h3 className="h3">
                                    {t('pdf.universal.extra')}:
                              <br />
                                    {t('pdf.universal.mug')}: {card.vasoRefillPrecio} USD
                              <br />
                                    {t('pdf.universal.per')}
                                    <br />
                                    <br />
                                    {t('pdf.universal.dining')}: {card.diningPrecio} USD
                              <br />
                                    {t('pdf.universal.per')}
                                    <br />
                                    <br />
                                    {t('pdf.universal.photo')}: {card.fotoPrecio} USD
                              <br />
                                    {t('pdf.universal.perF')}
                                    <br />
                                    <br />
                                  </h3>
                                </article>
                              </div>
                            </div>
                            {this.beneficioUniversalTicket()}
                          </section>
                        );
                      }) : <></>
                  }

                  {/* UNIVERSAL HOTEL */}
                  {
                    this.state.cards.universalHotel !== undefined ?
                      this.state.cards.universalHotel.map(card => {
                        return (
                          <section id="universal">
                            <div className="bordes-plan">
                              <div>
                                <h1 className="h1 titular">Universal - Hotel</h1>
                              </div>
                              <div className="lugar">
                                <img
                                  src={card.image}
                                  alt="disney"
                                  width={506}
                                  className="foto"
                                />
                                <h4 className="datos">
                                  CHECK IN : <span className="span">{card.checkIn}</span>
                                  <br />
                            CHECK OUT: <span className="span">{card.checkOut}</span>
                                  <br />
                                  {t('wizard.step.disneyHotel.travelerGroup').toUpperCase()}: <span className="span">{card.grupoViajero}</span>
                                  <br />
                            HOTEL: <span className="span">{card.hotel}</span>
                                  <br />
                                  {t('wizard.step.disneyHotel.room').toUpperCase()}: <span className="span">{card.habitacion}</span>
                                  <br />
                            TICKETS: <span className="span">{card.tickets}</span>
                                  <br />
                                  {t('wizard.step.disney.totalPrice').toUpperCase()}: <span className="span">{card.precioTotal}</span>
                                </h4>
                              </div>
                              <div id="plan-universal">
                                <article className="articulo-u">
                                  <h3 className="h3">
                                    {t('pdf.universal.extra')}:
                              <br />
                                    {t('pdf.universal.mug')}: {card.vasoRefillPrecio} USD
                              <br />
                                    {t('pdf.universal.per')}
                                    <br />
                                    <br />
                                    {t('pdf.universal.dining')}: {card.diningPrecio} USD
                              <br />
                                    {t('pdf.universal.per')}
                                    <br />
                                    <br />
                                    {t('pdf.universal.photo')}: {card.fotoPrecio} USD
                              <br />
                                    {t('pdf.universal.perF')}
                                    <br />
                                    <br />
                                  </h3>
                                </article>
                              </div>
                            </div>
                            {this.beneficioUniversal()}
                          </section>
                        );
                      }) : <></>
                  }

                  {/* OTROS DESTINOS */}
                  {
                    this.state.cards.otrosDestinos !== undefined ?
                      this.state.cards.otrosDestinos.map(card => {
                        return (
                          <section id="miami">
                            <div className="bordes-plan">
                              <div>
                                <h1 className="h1 titular">{card.destino}</h1>
                              </div>
                              <div className="lugar">
                                <img src={card.image} alt="disney" width={506} className="foto" />
                                <h4 className="datos">
                                  CHECK IN : <span className="span">{card.checkIn}</span>
                                  <br />
                            CHECK OUT: <span className="span">{card.checkOut}</span>
                                  <br />
                                  {t('wizard.step.disneyHotel.travelerGroup').toUpperCase()}: <span className="span">{card.grupoViajero}</span>
                                  <br />
                            HOTEL: <span className="span">{card.hotel}</span>
                                  <br />
                                  {t('wizard.step.disneyHotel.room').toUpperCase()}: <span className="span">{card.habitacion}</span>
                                  <br />
                                  {t('wizard.step.disney.totalPrice').toUpperCase()}: <span className="span">{card.precioTotal}</span>
                                </h4>
                              </div>
                              <div id="plan-miami">
                                <article className="articulo-u">
                                  <h3 className="h3">
                                    {
                                      card.actividadesExtra.length > 0 ?
                                        <>
                                          {t('wizard.step.other.extras')}:
                                    <br />
                                          {
                                            card.actividadesExtra.map(act => {
                                              return (
                                                <>
                                                  {act.actividad}: {act.precio} USD
                                            <br />
                                                  <br />
                                                </>
                                              );
                                            })
                                          }
                                        </>
                                        : <></>
                                    }
                                    {t('pdf.other.payment')}:
                              <br />
                                    {t('pdf.other.paymentDesc')} {card.formaDePago}
                                  </h3>
                                </article>
                              </div>
                            </div>
                          </section>
                        );
                      }) : <></>
                  }

                  {/* CRUCERO */}
                  {
                    this.state.cards.crucero !== undefined ?
                      this.state.cards.crucero.map(card => {
                        return (
                          <section id="crucero">
                            <div className="bordes-plan">
                              <div>
                                <h1 className="h1 titular">{t('wizard.option.cruice')}</h1>
                              </div>
                              <div className="lugar">
                                <img
                                  src={card.image}
                                  alt="disney"
                                  width={506}
                                  className="foto"
                                />
                                <h4 className="datos">
                                  {t('wizard.step.cruice.shipname').toUpperCase()}:<span className="span">{card.nombreBarco}</span>
                                  <br />
                                  {t('wizard.step.cruice.destination').toUpperCase()}:<span className="span">{card.destino}</span>
                                  <br />
                                  {t('wizard.step.cruice.date').toUpperCase()}:<span className="span">{card.fecha}</span>
                                  <br />
                                  {t('wizard.step.cruice.nights').toUpperCase()}:<span className="span">{card.numeroNoches}</span>
                                  <br />
                                  {t('wizard.step.cruice.travelers').toUpperCase()}:<span className="span">{card.viajeros}</span>
                                  <br />
                                  {t('wizard.step.cruice.reason').toUpperCase()}:<span className="span">{card.razonViaje}</span>
                                </h4>
                              </div>
                              <div id="tabla">
                                <table className="table">
                                  <tbody>
                                    <tr className="tr">
                                      <th className="th">
                                        <h2 className="h2">
                                          {t('wizard.step.cruice.date')}
                                        </h2>
                                      </th>
                                      <th className="th">
                                        <h2 className="h2">
                                          {t('wizard.step.cruice.port')}
                                        </h2>
                                      </th>
                                      <th className="th">
                                        <h2 className="h2">
                                          {t('wizard.step.cruice.arrival')}

                                        </h2>
                                      </th>
                                      <th className="th">
                                        <h2 className="h2">
                                          {t('wizard.step.cruice.departure')}
                                        </h2>
                                      </th>
                                    </tr>
                                    {
                                      card.tablaDias.map((row, index) => {
                                        return (
                                          <tr className="tr">
                                            <td className="td">{index + 1}</td>
                                            <td className="td">{row.puerto}</td>
                                            <td className="td">{row.llegada}</td>
                                            <td className="td">{row.salida}</td>
                                          </tr>
                                        )
                                      })
                                    }
                                  </tbody>
                                </table>
                              </div>
                              <div id="cabina">
                                <article className="precios">
                                  <div>
                                    <h3 className="h3">
                                      {t('pdf.cruice.cabinprice')}
                                      <br />
                                      <br />
                                      {
                                        card.cabinas.map(cabina => {
                                          return (
                                            <>
                                              {cabina.tipoCabina}: {cabina.tipoCabinaPrecio} USD
                                        <br />
                                            </>
                                          );
                                        })
                                      }
                                    </h3>
                                  </div>
                                </article>
                                <article className="inc">
                                  <h3 className="h3">
                                    {t('pdf.cruice.1')}
                                  </h3>
                                  <p>
                                    <img
                                      src={require("./img/estrella.png")}
                                      alt="estrella"
                                      className="estrella"
                                      width="19px"
                                    />
                                    {t('pdf.cruice.2')}
                                  </p>
                                  <p>
                                    <img
                                      src={require("./img/estrella.png")}
                                      alt="estrella"
                                      className="estrella"
                                      width="19px"
                                    />
                                    {t('pdf.cruice.3')}
                                  </p>
                                  <p>
                                    <img
                                      src={require("./img/estrella.png")}
                                      alt="estrella"
                                      className="estrella"
                                      width="19px"
                                    />
                                    {t('pdf.cruice.4')}
                                  </p>
                                  <p>
                                    <img
                                      src={require("./img/estrella.png")}
                                      alt="estrella"
                                      className="estrella"
                                      width="19px"
                                    />
                                    {t('pdf.cruice.5')}
                                  </p>
                                  <p>
                                    <img
                                      src={require("./img/estrella.png")}
                                      alt="estrella"
                                      className="estrella"
                                      width="19px"
                                    />
                                    {t('pdf.cruice.6')}
                                  </p>
                                  <p>
                                    <img
                                      src={require("./img/estrella.png")}
                                      alt="estrella"
                                      className="estrella"
                                      width="19px"
                                    />
                                    {t('pdf.cruice.7')}
                                  </p>
                                </article>
                              </div>
                              <div id="plan-crucero">
                                <article className="articulo-u">
                                  <h3 className="h3">
                                    {t('pdf.cruice.8')}:
                              <br />
                                    {t('pdf.cruice.9')} {card.fechaPago1} {t('pdf.cruice.10')} {card.fechaPago2}
                                    <br />
                                    {t('pdf.cruice.11')}
                                  </h3>
                                </article>
                              </div>
                            </div>
                          </section>
                        );
                      }) : <></>
                  }

                  {/* FOOTER */}
                  {
                    this.state.cards.final !== undefined ?
                      <footer className="footer">
                        <div id="footer">
                          <div className="pie">
                            <article className="final">
                              <h2 className="h2">{t('pdf.final.1')}</h2>
                              <h1 className="h1">{this.state.cards.final.nombreAgente}</h1>
                            </article>
                            <article className="imagen">
                              <img src={this.state.cards.final.image} alt="zain" className="agente" />
                            </article>
                          </div>
                          <h2 className="info">

                            {t('pdf.final.2')}{" "}
                            <a className="footera" href="http://mhtravelagency.com/website/index.php?lang=es">
                              www.mhtravelagency.com
                  </a>

                          </h2>
                        </div>
                      </footer> : <></>
                  }
                  <div id="zocalo" />
                </div>
              </div>
            </div>
          </PDFExport>
        </>
      );

  }
}

Template.propTypes = {
  cards: PropTypes.object.isRequired,
  returnToWizard: PropTypes.func,
};

ReactDOM.render(<Template />, document.getElementById('root'));

export default withTranslation()(Template)