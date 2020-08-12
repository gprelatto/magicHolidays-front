import React, { useEffect } from "react";

import ReactDOM from 'react-dom';
import "./css/estilos.css"
import { PDFExport } from '@progress/kendo-react-pdf';
import { textChangeRangeIsUnchanged } from "typescript";


class Template extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: {}
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
    this.resume.save();
  }

  beneficiosDisney = () => {
    return (
      <div>
        <h3 className="beneficios">
          <b>Además, alojándose en Disney tienen los siguientes beneficios:</b>
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
          <strong className="strong">PLANIFICACIÓN TOTAL:</strong>
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
          <strong className="strong">CONDICIONES DE PAGO:</strong>
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
          <strong className="strong">FORMA DE PAGO HOTELES UNIVERSAL:</strong>
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

  render() {
    return (
      <>
        <button onClick={this.exportPDF}>download</button>
        <PDFExport scale={0.4}
          paperSize="auto"
          fileName="lologresolito.pdf"
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
                  <h2 className="h2">¡HOLA VIAJEROS!</h2>
                  <h3 className="h3">
                    Este es el momento de presentarnos y contarles que somos una agencia
              especialista en crear <b>Vacaciones mágicas</b>.<br />
                    <br />
              Magic Holidays ubicada en la ciudad de Orlando es una agencia autorizada
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
                    <b>A continuación, te datallamos la cotización solicitada:</b>
                  </h3>
                </div>

                {/* DISNEY TICKET */}
                {
                  this.state.cards.disneyTicket !== undefined ?
                    <section id="walt">
                      <div className="bordes-plan">
                        <div>
                          <h1 className="h1 titular">Walt Disney World - Tickets</h1>
                        </div>
                        <div className="lugar">
                          <img src={this.state.cards.disneyTicket.image} alt="disney" className="foto" />
                          <h4 className="datos">
                            GRUPO VIAJERO: <span className="span">{this.state.cards.disneyTicket.grupoViajero}</span>
                            <br />
          TICKETS: <span className="span">  {this.state.cards.disneyTicket.tickets}</span>
                            <br />
                          </h4>
                        </div>
                        {
                          this.state.cards.disneyTicket.planDeComida.length > 0 || this.state.cards.disneyTicket.serviciosOpcionales.length > 0 ?
                            <div id="plan-disney">
                              <article className="articulo">
                                <h3 className="h3">
                                  {
                                    this.state.cards.disneyTicket.planDeComida.map(plan => {
                                      return (
                                        <>
                                          <strong className="strong">PLAN DE COMIDAS:   {plan.nombrePlanComida}</strong>
                                          <br />
                                          <b>Precio Total con Plan de Comidas:   {plan.precioTotalConPlan}</b>
                                          <br />
                                          <b>Precio Total sin Plan de Comidas:   {plan.precioTotalSinPlan}</b>
                                          <br />
                                          <br />
                                        </>
                                      );
                                    })
                                  }
                                  <h3 className="h3"></h3>
                                  {
                                    this.state.cards.disneyTicket.serviciosOpcionales.length > 0 ?
                                      <>
                                        <strong className="strong">SERVICIO OPCIONALES DISNEY:</strong>
                                        <br />
                                      </>
                                      : <></>
                                  }
                                  {
                                    this.state.cards.disneyTicket.serviciosOpcionales.map((servicio) => {
                                      return (
                                        <>
                                          <b>{servicio.servicioOpcional}: {servicio.importeServicio}</b>
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
                                    this.state.cards.disneyTicket.planDeComida.length > 0 ?
                                      <>
                                        <strong className="strong">INFORMACIÓN PLAN DE COMIDAS:</strong>
                                        <br />
                                      Todas las comidas se pueden utilizar tanto en los hoteles Disney,
                                      como en todos los parques y en Disney Springs (centro comercial de
                                      Disney).
                                    <br />
                                        <br />
                                        {
                                          this.state.cards.disneyTicket.planDeComida.map(plan => {
                                            return (
                                              <>
                                                El servicio de comidas <b>{plan.nombrePlanComida}</b> incluye:
                                          <br />
                                                <b>{plan.incluye}</b>
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
                    : <></>
                }

                {/* DISNEY HOTEL */}
                {
                  this.state.cards.disneyHotel !== undefined ?
                    <section id="walt">
                      <div className="bordes-plan">
                        <div>
                          <h1 className="h1 titular">Walt Disney World - Hotel</h1>
                        </div>
                        <div className="lugar">
                          <img src={this.state.cards.disneyHotel.image} alt="disney" className="foto" />
                          <h4 className="datos">
                            CHECK IN : <span className="span"> {this.state.cards.disneyHotel.checkIn} </span>
                            <br />
                  CHECK OUT: <span className="span"> {this.state.cards.disneyHotel.checkOut} </span>
                            <br />
                  GRUPO VIAJERO: <span className="span"> {this.state.cards.disneyHotel.grupoViajero} </span>
                            <br />
                  HOTEL: <span className="span"> {this.state.cards.disneyHotel.hotel} </span>
                            <br />
                  HABITACIÓN: <span className="span"> {this.state.cards.disneyHotel.habitacion} </span>
                            <br />
                          </h4>
                        </div>
                        {
                          this.state.cards.disneyHotel.planDeComida.length > 0 || this.state.cards.disneyHotel.serviciosOpcionales.length > 0 ?
                            <div id="plan-disney">
                              <article className="articulo">
                                <h3 className="h3">
                                  {
                                    this.state.cards.disneyHotel.planDeComida.map(plan => {
                                      return (
                                        <>
                                          <strong className="strong">PLAN DE COMIDAS:   {plan.nombrePlanComida}</strong>
                                          <br />
                                          <b>Precio Total con Plan de Comidas:   {plan.precioTotalConPlan}</b>
                                          <br />
                                          <b>Precio Total sin Plan de Comidas:   {plan.precioTotalSinPlan}</b>
                                          <br />
                                          <br />
                                        </>
                                      );
                                    })
                                  }
                                  <h3 className="h3"></h3>
                                  {
                                    this.state.cards.disneyHotel.serviciosOpcionales.length > 0 ?
                                      <>
                                        <strong className="strong">SERVICIO OPCIONALES DISNEY:</strong>
                                        <br />
                                      </>
                                      : <></>
                                  }
                                  {
                                    this.state.cards.disneyHotel.serviciosOpcionales.map((servicio) => {
                                      return (
                                        <>
                                          <b>{servicio.servicioOpcional}: {servicio.importeServicio}</b>
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
                                    this.state.cards.disneyHotel.planDeComida.length > 0 ?
                                      <>
                                        <strong className="strong">INFORMACIÓN PLAN DE COMIDAS:</strong>
                                        <br />
                                      Todas las comidas se pueden utilizar tanto en los hoteles Disney,
                                      como en todos los parques y en Disney Springs (centro comercial de
                                      Disney).
                                    <br />
                                        <br />
                                        {
                                          this.state.cards.disneyHotel.planDeComida.map(plan => {
                                            return (
                                              <>
                                                El servicio de comidas <b>{plan.nombrePlanComida}</b> incluye:
                                          <br />
                                                <b>{plan.incluye}</b>
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
                    : <></>
                }

                {/* UNIVERSAL TICKET */}
                {
                  this.state.cards.universalTicket !== undefined ?
                    <section id="universal">
                      <div className="bordes-plan">
                        <div>
                          <h1 className="h1 titular">Universal - Ticket</h1>
                        </div>
                        <div className="lugar">
                          <img
                            src={this.state.cards.universalTicket.image}
                            alt="disney"
                            width={506}
                            className="foto"
                          />
                          <h4 className="datos">
                            GRUPO VIAJERO: <span className="span">{this.state.cards.universalTicket.grupoViajero}</span>
                            <br />
                            TICKETS: <span className="span">{this.state.cards.universalTicket.tickets}</span>
                            <br />
                            PRECIO TOTAL: <span className="span">{this.state.cards.universalTicket.precioTotal}</span>
                          </h4>
                        </div>
                        <div id="plan-universal">
                          <article className="articulo-u">
                            <h3 className="h3">
                              <strong className="strong">SERVICIOS EXTRAS UNIVERSAL:</strong>
                              <br />
                              <b>Plan de comidas Quick Service CON VASO REFILL:</b> {this.state.cards.universalTicket.vasoRefillPrecio} USD
                              <br />
                              (Precio por persona, por día)
                              <br />
                              <br />
                              <b>Plan de comidas Universal Dining Plan:</b> {this.state.cards.universalTicket.diningPrecio} USD
                              <br />
                              (Precio por persona, por día)
                              <br />
                              <br />
                              <b>Paquete de fotografías:</b> {this.state.cards.universalTicket.fotoPrecio} USD
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
                    : <></>
                }

                {/* UNIVERSAL TICKET */}
                {
                  this.state.cards.universalHotel !== undefined ?
                    <section id="universal">
                      <div className="bordes-plan">
                        <div>
                          <h1 className="h1 titular">Universal - Hotel</h1>
                        </div>
                        <div className="lugar">
                          <img
                            src={this.state.cards.universalHotel.image}
                            alt="disney"
                            width={506}
                            className="foto"
                          />
                          <h4 className="datos">
                            CHECK IN : <span className="span">{this.state.cards.universalHotel.checkIn}</span>
                            <br />
                            CHECK OUT: <span className="span">{this.state.cards.universalHotel.checkOut}</span>
                            <br />
                            GRUPO VIAJERO: <span className="span">{this.state.cards.universalHotel.grupoViajero}</span>
                            <br />
                            HOTEL: <span className="span">{this.state.cards.universalHotel.hotel}</span>
                            <br />
                            HABITACIÓN: <span className="span">{this.state.cards.universalHotel.habitacion}</span>
                            <br />
                            PRECIO TOTAL: <span className="span">{this.state.cards.universalHotel.precioTotal}</span>
                          </h4>
                        </div>
                        <div id="plan-universal">
                          <article className="articulo-u">
                            <h3 className="h3">
                              <strong className="strong">SERVICIOS EXTRAS UNIVERSAL:</strong>
                              <br />
                              <b>Plan de comidas Quick Service CON VASO REFILL:</b> {this.state.cards.universalHotel.vasoRefillPrecio} USD
                              <br />
                              (Precio por persona, por día)
                              <br />
                              <br />
                              <b>Plan de comidas Universal Dining Plan:</b> {this.state.cards.universalHotel.diningPrecio} USD
                              <br />
                              (Precio por persona, por día)
                              <br />
                              <br />
                              <b>Paquete de fotografías:</b> {this.state.cards.universalHotel.fotoPrecio} USD
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
                    : <></>
                }

                {/* OTROS DESTINOS */}
                {
                  this.state.cards.otrosDestinos !== undefined ?
                    <section id="miami">
                      <div className="bordes-plan">
                        <div>
                          <h1 className="h1 titular">{this.state.cards.otrosDestinos.destino}</h1>
                        </div>
                        <div className="lugar">
                          <img src={this.state.cards.otrosDestinos.image} alt="disney" width={506} className="foto" />
                          <h4 className="datos">
                            CHECK IN : <span className="span">{this.state.cards.otrosDestinos.checkIn}</span>
                            <br />
                            CHECK OUT: <span className="span">{this.state.cards.otrosDestinos.checkOut}</span>
                            <br />
                            GRUPO VIAJERO: <span className="span">{this.state.cards.otrosDestinos.grupoViajero}</span>
                            <br />
                            HOTEL: <span className="span">{this.state.cards.otrosDestinos.hotel}</span>
                            <br />
                            HABITACIÓN: <span className="span">{this.state.cards.otrosDestinos.habitacion}</span>
                            <br />
                            PRECIO TOTAL: <span className="span">{this.state.cards.otrosDestinos.precioTotal}</span>
                          </h4>
                        </div>
                        <div id="plan-miami">
                          <article className="articulo-u">
                            <h3 className="h3">
                              {
                                this.state.cards.otrosDestinos.actividadesExtra.length > 0 ?
                                  <>
                                    <strong className="strong">ACTIVIDADES EXTRAS:</strong>
                                    <br />
                                    {
                                      this.state.cards.otrosDestinos.actividadesExtra.map(act => {
                                        return (
                                          <>
                                            <b>{act.actividad}:</b> {act.precio} USD
                                            <br />
                                            <br />
                                          </>
                                        );
                                      })
                                    }
                                  </>
                                  : <></>
                              }
                              <strong className="strong">FORMA DE PAGO:</strong>
                              <br />
                              El pago se realiza con tarjeta de crédito {this.state.cards.otrosDestinos.formaDePago}
                            </h3>
                          </article>
                        </div>
                      </div>
                    </section>
                    : <></>
                }

                {/* CRUCERO */}
                {
                  this.state.cards.crucero !== undefined ?
                    <section id="crucero">
                      <div className="bordes-plan">
                        <div>
                          <h1 className="h1 titular">Crucero</h1>
                        </div>
                        <div className="lugar">
                          <img
                            src={this.state.cards.crucero.image}
                            alt="disney"
                            width={506}
                            className="foto"
                          />
                          <h4 className="datos">
                            NOMBRE DEL BARCO:<span className="span">{this.state.cards.crucero.nombreBarco}</span>
                            <br />
                            DESTINO:<span className="span">{this.state.cards.crucero.destino}</span>
                            <br />
                            FECHA:<span className="span">{this.state.cards.crucero.fecha}</span>
                            <br />
                            NÚMERO DE NOCHES:<span className="span">{this.state.cards.crucero.numeroNoches}</span>
                            <br />
                            VIAJEROS:<span className="span">{this.state.cards.crucero.viajeros}</span>
                            <br />
                            RAZÓN DEL VIAJE:<span className="span">{this.state.cards.crucero.razonViaje}</span>
                          </h4>
                        </div>
                        <div id="tabla">
                          <table className="table">
                            <tbody>
                              <tr className="tr">
                                <th className="th">
                                  <h2 className="h2">
                                    <strong className="strong">DÍA</strong>
                                  </h2>
                                </th>
                                <th className="th">
                                  <h2 className="h2">
                                    <strong className="strong">PUERTO</strong>
                                  </h2>
                                </th>
                                <th className="th">
                                  <h2 className="h2">
                                    <strong className="strong">SALIDA</strong>
                                  </h2>
                                </th>
                                <th className="th">
                                  <h2 className="h2">
                                    <strong className="strong">LLEGADA</strong>
                                  </h2>
                                </th>
                              </tr>
                              {
                                this.state.cards.crucero.tablaDias.map((row, index) => {
                                  return (
                                    <tr className="tr">
                                      <td className="td">{index}</td>
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
                                <strong className="strong">TIPO DE CABINA PRECIO</strong>
                                <br />
                                <br />
                                {
                                  this.state.cards.crucero.cabinas.map(cabina => {
                                    return (
                                      <>
                                        <b>{cabina.tipoCabina}</b>: {cabina.tipoCabinaPrecio} USD
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
                              <strong className="strong">¿QUÉ INCLUYE?</strong>
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
                              <strong className="strong">FORMA DE PAGO:</strong>
                              <br />
                  El pago se realiza con tarjeta de débito o crédito directamente a
                  Disney Cruise Line a través de nosotros; y para realizar la
                  reservación es necesario un depósito del 20% del total para el
                  {this.state.cards.crucero.fechaPago1} y liquidar el restante máximo el {this.state.cards.crucero.fechaPago2}
                              <br />
                  La cantidad exacta de depósito y del restante por pagar depende
                  del tipo de habitación que elijan.
                </h3>
                          </article>
                        </div>
                      </div>
                    </section>
                    : <></>
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
                          <b>
                            Para más información visitanos en{" "}
                            <a className="footera" href="http://mhtravelagency.com/website/index.php?lang=es">
                              www.mhtravelagency.com
                  </a>
                          </b>
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

ReactDOM.render(<Template />, document.getElementById('root'));

export default Template