import React from "react";
import PropTypes from "prop-types";

import ReactDOM from 'react-dom';
import "./css/estilos.css"
import { PDFExport } from '@progress/kendo-react-pdf';
import Button from "components/CustomButtons/Button.js";


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
    return (
      <div>
        <h3 className="beneficios">
          Además, alojándose en Disney tienen los siguientes beneficios:
          <br />
          <br />
          <img
            src={require("./img/estrella.png")}
            alt="estrella"
            width="19px"
            className="estrella"
          />
        Transporte de cortesía del aeropuerto de Orlando al hotel, ida y
        vuelta en el caso de llegar allí.
        <br />
          <img
            src={require("./img/estrella.png")}
            alt="estrella"
            width="19px"
            className="estrella"
          />
        Transporte gratuito dentro de Disney World con micros exclusivos a
        todos los parques desde y hacia el hotel, a Disney Springs, y
        estacionamiento gratuito en parques.
        <br />
          <img
            src={require("./img/estrella.png")}
            alt="estrella"
            width="19px"
            className="estrella"
          />
        Horas mágicas extra (pueden disfrutar de los parques durante más horas
        que el resto de los visitantes).
        <br />
          <img
            src={require("./img/estrella.png")}
            alt="estrella"
            width="19px"
            className="estrella"
          />
        Selección de Fast Pass (pases rápidos para las atracciones más
        populares) 60 días antes del viaje.
        <br />
          <br />
          PLANIFICACIÓN TOTAL:
          <br />
        La planificación incluye la preparación de una guía de viaje, la
        vinculación del paquete a la cuenta My Disney Experience, la
        realización del Check in Online, la confección de un plan día por día
        para que visiten los parques en las fechas adecuadas, la selección y
        reserva de Fast Pass, sugerencias de los mejores restaurantes para
        comer y las estrategias de recorrido para cada parque, bajando esperas
        y evitando multitudes.
        <br />
          <br />
          CONDICIONES DE PAGO:
          <br />
        Para reservar los paquetes Disney se necesita un pago mínimo de USD
        200 por habitación. El saldo tiene que estar cancelado 30 días antes
        del check in. Hasta ese momento se pueden hacer pagos parciales de los
        montos que ustedes definan y modificar la fecha de la reserva si fuera
        necesario. Incluso en el caso de que deseen cancelar, se puede hacer
        también sin cargo alguno y se devuelve todo el dinero hasta 30 días
        antes del viaje. Se puede hacer una reserva por 72 horas sin seña para
        los servicios elegidos. La reserva se hace directamente con Disney con
        la tarjeta de crédito de nuestros clientes. Cuando hagan la reserva a
        través mío, obtendrán el mismo precio que ven en Disney.com.
      </h3>
      </div>
    )
  }

  beneficioUniversal = () => {
    return (
      <div>
        <h3 className="beneficios">
          FORMA DE PAGO HOTELES UNIVERSAL:
          <br />
          El pago se realiza con tarjeta de crédito y para reservar los paquetes
          Universal es necesario un depósito de 50 USD por persona y el resto
          del total tendrá que ser liquidado 45 días antes de la fecha de
          llegada (Del Check-in).
          <br />
          Hasta ese momento se pueden hacer pagos parciales de los montos que
          ustedes definan y modificar la fecha de la reserva si fuera necesario.
          Incluso en el caso de que deseen cancelar, se puede hacer también sin
          cargo alguno y se devuelve todo el dinero hasta 45 días antes del
          viaje.
        </h3>
      </div>
    )
  }



  beneficioUniversalTicket = () => {
    return (
      <div>
        <h3 className="beneficios">
          FORMA DE PAGO TICKETS UNIVERSAL:
          <br />
          El pago se realiza con tarjeta de crédito en un pago. Los mismos no son reembolsables ni transferibles.
        </h3>
      </div>
    )
  }

  beneficiosDisneyTicket = () => {
    return (
      <div>
        <h3 className="beneficios">
          PLANIFICACIÓN TOTAL:
        <br />
        La planificación incluye la preparación de una guía de viaje, la
        vinculación del paquete a la cuenta My Disney Experience, la selección y
        reserva de Fast Pass.
        <br />
          <br />
          CONDICIONES DE PAGO:
          <br />
        El pago se realiza con tarjeta de crédito o débito en un pago.
        Los mismos no son reembolsables ni transferibles.
      </h3>
      </div>
    )
  }

  getFileName = () => {
    if (this.props.cards !== undefined) {
      if (this.props.cards.final.fileName !== "") {
        return "Presupuesto_" + this.props.cards.final.fileName + ".pdf"
      }
    }

    const date = new Date();
    const day = date.getDay() < 10 ? "0" + date.getDay().toString() : date.getDay().toString();
    const year = date.getFullYear().toString();
    const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : date.getMonth().toString();

    return "Presupuesto_" + year + month + day + ".pdf"
  }

  render() {
    return (
      <>
        <Button onClick={this.exportPDF}>Descargar</Button>
        <Button onClick={() => this.props.returnToWizard(false)}>Volver Al Wizard</Button>
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
                  <h2 className="h2">¡HOLA, VIAJEROS!</h2>
                  <h3 className="h3">
                    Este es el momento de presentarnos y contarles que somos una agencia
              especialista en crear vacaciones mágicas.<br />
                    <br />
              Magic Holidays, ubicada en la ciudad de Orlando, es una agencia autorizada
              por Disney y Universal. Te garantizamos una atención personalizada y un
              acompañamiento completo desde el inicio hasta el final de tu viaje SIN
              NINGÚN COSTO EXTRA. <br />
                    <br />
              Haremos todo lo posible para que aproveches al máximo tu experiencia,
              tiempo e inversión, buscando opciones que se ajusten a tu grupo y
              presupuesto. Te compartimos tips, recomendaciones, apoyo con reservación
              de restaurantes y Fast Pass, explicación de cómo utilizar las APPS para
              los parques y todo lo que necesites.
              <br />
                    <br />
                    <br />
                    A continuación, te detallamos la cotización solicitada:
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
                              <h1 className="h1 titular">Walt Disney World - Tickets</h1>
                            </div>
                            <div className="lugar">
                              <img src={card.image} alt="disney" className="foto" />
                              <h4 className="datos">
                                GRUPO VIAJERO: <span className="span">{card.grupoViajero}</span>
                                <br />
                                TICKETS: <span className="span">  {card.tickets}</span>
                                <br />
                              </h4>
                            </div>
                            {
                              <div id="plan-disney">
                                <article className="articulo">
                                  <h3 className="h3">
                                    Precio Total: {card.precioTotalConPlan}
                                    <br />
                                    {
                                      card.serviciosOpcionales.length > 0 ?
                                        <>
                                          SERVICIO OPCIONALES DISNEY:
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
                                          INFORMACIÓN PLAN DE COMIDAS:
                                      <br />
                                      Todas las comidas se pueden utilizar tanto en los hoteles Disney,
                                      como en todos los parques y en Disney Springs (centro comercial de
                                      Disney).
                                    <br />
                                          <br />
                                          {
                                            card.planDeComida.map(plan => {
                                              return (
                                                <>
                                                  El servicio de comidas {plan.nombrePlanComida} incluye:
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
                              <h1 className="h1 titular">Walt Disney World - Hotel</h1>
                            </div>
                            <div className="lugar">
                              <img src={card.image} alt="disney" className="foto" />
                              <h4 className="datos">
                                CHECK IN : <span className="span"> {card.checkIn} </span>
                                <br />
                                CHECK OUT: <span className="span"> {card.checkOut} </span>
                                <br />
                                GRUPO VIAJERO: <span className="span"> {card.grupoViajero} </span>
                                <br />
                                HOTEL: <span className="span"> {card.hotel} </span>
                                <br />
                                HABITACIÓN: <span className="span"> {card.habitacion} </span>
                                <br />
                                TICKETS: <span className="span">{card.tickets}</span>
                                <br />
                              </h4>
                            </div>
                            {
                              card.length > 0 || card.serviciosOpcionales.length > 0 ?
                                <div id="plan-disney">
                                  <article className="articulo">
                                    <h3 className="h3">
                                      {
                                        card.planDeComida.map(plan => {
                                          return (
                                            <>
                                              PLAN DE COMIDAS:   {plan.nombrePlanComida}
                                              <br />
                                          Precio Total con Plan de Comidas:   {plan.precioTotalConPlan}
                                              <br />
                                          Precio Total sin Plan de Comidas:   {plan.precioTotalSinPlan}
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
                                            SERVICIO OPCIONALES DISNEY:
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
                                            INFORMACIÓN PLAN DE COMIDAS:
                                        <br />
                                      Todas las comidas se pueden utilizar tanto en los hoteles Disney,
                                      como en todos los parques y en Disney Springs (centro comercial de
                                      Disney).
                                    <br />
                                            <br />
                                            {
                                              card.planDeComida.map(plan => {
                                                return (
                                                  <>
                                                    El servicio de comidas {plan.nombrePlanComida} incluye:
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
                                GRUPO VIAJERO: <span className="span">{card.grupoViajero}</span>
                                <br />
                            TICKETS: <span className="span">{card.tickets}</span>
                                <br />
                            PRECIO TOTAL: <span className="span">{card.precioTotal}</span>
                              </h4>
                            </div>
                            <div id="plan-universal">
                              <article className="articulo-u">
                                <h3 className="h3">
                                  SERVICIOS EXTRAS UNIVERSAL:
                              <br />
                              Plan de comidas Quick Service CON VASO REFILL: {card.vasoRefillPrecio} USD
                              <br />
                              (Precio por persona, por día)
                              <br />
                                  <br />
                              Plan de comidas Universal Dining Plan: {card.diningPrecio} USD
                              <br />
                              (Precio por persona, por día)
                              <br />
                                  <br />
                              Paquete de fotografías: {card.fotoPrecio} USD
                              <br />
                              (Precio por día)
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
                            GRUPO VIAJERO: <span className="span">{card.grupoViajero}</span>
                                <br />
                            HOTEL: <span className="span">{card.hotel}</span>
                                <br />
                            HABITACIÓN: <span className="span">{card.habitacion}</span>
                                <br />
                            TICKETS: <span className="span">{card.tickets}</span>
                                <br />
                            PRECIO TOTAL: <span className="span">{card.precioTotal}</span>
                              </h4>
                            </div>
                            <div id="plan-universal">
                              <article className="articulo-u">
                                <h3 className="h3">
                                  SERVICIOS EXTRAS UNIVERSAL:
                              <br />
                              Plan de comidas Quick Service CON VASO REFILL: {card.vasoRefillPrecio} USD
                              <br />
                              (Precio por persona, por día)
                              <br />
                                  <br />
                              Plan de comidas Universal Dining Plan: {card.diningPrecio} USD
                              <br />
                              (Precio por persona, por día)
                              <br />
                                  <br />
                              Paquete de fotografías: {card.fotoPrecio} USD
                              <br />
                              (Precio por persona, por día)
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
                            GRUPO VIAJERO: <span className="span">{card.grupoViajero}</span>
                                <br />
                            HOTEL: <span className="span">{card.hotel}</span>
                                <br />
                            HABITACIÓN: <span className="span">{card.habitacion}</span>
                                <br />
                            PRECIO TOTAL: <span className="span">{card.precioTotal}</span>
                              </h4>
                            </div>
                            <div id="plan-miami">
                              <article className="articulo-u">
                                <h3 className="h3">
                                  {
                                    card.actividadesExtra.length > 0 ?
                                      <>
                                        ACTIVIDADES EXTRAS:
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
                              FORMA DE PAGO:
                              <br />
                              El pago se realiza con tarjeta de crédito {card.formaDePago}
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
                              <h1 className="h1 titular">Crucero</h1>
                            </div>
                            <div className="lugar">
                              <img
                                src={card.image}
                                alt="disney"
                                width={506}
                                className="foto"
                              />
                              <h4 className="datos">
                                NOMBRE DEL BARCO:<span className="span">{card.nombreBarco}</span>
                                <br />
                            DESTINO:<span className="span">{card.destino}</span>
                                <br />
                            FECHA:<span className="span">{card.fecha}</span>
                                <br />
                            NÚMERO DE NOCHES:<span className="span">{card.numeroNoches}</span>
                                <br />
                            VIAJEROS:<span className="span">{card.viajeros}</span>
                                <br />
                            RAZÓN DEL VIAJE:<span className="span">{card.razonViaje}</span>
                              </h4>
                            </div>
                            <div id="tabla">
                              <table className="table">
                                <tbody>
                                  <tr className="tr">
                                    <th className="th">
                                      <h2 className="h2">
                                        DÍA
                                  </h2>
                                    </th>
                                    <th className="th">
                                      <h2 className="h2">
                                        PUERTO
                                  </h2>
                                    </th>
                                    <th className="th">
                                      <h2 className="h2">
                                        EMBARQUE
                                  </h2>
                                    </th>
                                    <th className="th">
                                      <h2 className="h2">
                                        DESEMBARQUE
                                  </h2>
                                    </th>
                                  </tr>
                                  {
                                    card.tablaDias.map((row, index) => {
                                      return (
                                        <tr className="tr">
                                          <td className="td">{index + 1}</td>
                                          <td className="td">{row.puerto}</td>
                                          <td className="td">{row.salida}</td>
                                          <td className="td">{row.llegada}</td>
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
                                    TIPO DE CABINA PRECIO
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
                                  ¿QUÉ INCLUYE?
                            </h3>
                                <p>
                                  <img
                                    src={require("./img/estrella.png")}
                                    alt="estrella"
                                    className="estrella"
                                    width="19px"
                                  />
                  Alojamiento
                </p>
                                <p>
                                  <img
                                    src={require("./img/estrella.png")}
                                    alt="estrella"
                                    className="estrella"
                                    width="19px"
                                  />
                  Comida
                </p>
                                <p>
                                  <img
                                    src={require("./img/estrella.png")}
                                    alt="estrella"
                                    className="estrella"
                                    width="19px"
                                  />
                  Bebidas no alcoholicas complementarias
                </p>
                                <p>
                                  <img
                                    src={require("./img/estrella.png")}
                                    alt="estrella"
                                    className="estrella"
                                    width="19px"
                                  />
                  Entretenimiento
                </p>
                                <p>
                                  <img
                                    src={require("./img/estrella.png")}
                                    alt="estrella"
                                    className="estrella"
                                    width="19px"
                                  />
                  Experiencia con Personajes
                </p>
                                <p>
                                  <img
                                    src={require("./img/estrella.png")}
                                    alt="estrella"
                                    className="estrella"
                                    width="19px"
                                  />
                  Actividades seleccionadas a bordo
                </p>
                              </article>
                            </div>
                            <div id="plan-crucero">
                              <article className="articulo-u">
                                <h3 className="h3">
                                  FORMA DE PAGO:
                              <br />
                  El pago se realiza con tarjeta de débito o crédito directamente a
                  Disney Cruise Line a través de nosotros; y para realizar la
                  reservación es necesario un depósito del 20% del total para el {card.fechaPago1} y liquidar el restante máximo el {card.fechaPago2}
                                  <br />
                  La cantidad exacta de depósito y del restante por pagar depende
                  del tipo de habitación que elijan.
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
                            <h2 className="h2">Quedamos a tu disposición para lo que necesites,</h2>
                            <h1 className="h1">{this.state.cards.final.nombreAgente}</h1>
                          </article>
                          <article className="imagen">
                            <img src={this.state.cards.final.image} alt="zain" className="agente" />
                          </article>
                        </div>
                        <h2 className="info">

                          Para más información visitanos en{" "}
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

export default Template