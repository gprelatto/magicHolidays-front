import React, { useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";
import DoneIcon from '@material-ui/icons/Done';

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import DateRange from "@material-ui/icons/DateRange";
import SweetAlert from "react-bootstrap-sweetalert";
import Language from "@material-ui/icons/Language";
import ReactTable from "react-table";

// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Table from "components/Table/Table.js";
import Button from "components/CustomButtons/Button.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomLinearProgress from "components/CustomLinearProgress/CustomLinearProgress.js";
import CardText from "components/Card/CardText.js";

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import chartStyles from "assets/jss/material-dashboard-pro-react/views/chartsStyle.js";
import alertStyles from "assets/jss/material-dashboard-pro-react/views/sweetAlertStyle.js";

import { getRequest, redirectToUnforbidden, notificationsDone } from 'common/Request/Requests.js'
import { blackColor } from "assets/jss/material-dashboard-pro-react";

import { useTranslation } from 'react-i18next'

const us_flag = require("assets/img/flags/US.png");
const de_flag = require("assets/img/flags/DE.png");
const au_flag = require("assets/img/flags/AU.png");
const gb_flag = require("assets/img/flags/GB.png");
const ro_flag = require("assets/img/flags/RO.png");
const br_flag = require("assets/img/flags/BR.png");

const useStyles = makeStyles(styles);
const useChartStyles = makeStyles(chartStyles);
const useAlertStyles = makeStyles(alertStyles);

var delays = 80,
  durations = 500;
var delays2 = 80,
  durations2 = 500;

export default function Dashboard(props) {
  const classes = useStyles();
  const classesChart = useChartStyles();
  const alertClasses = useAlertStyles();

  const { t, i18n } = useTranslation();

  const [widgets, setWidgets] = React.useState([]);

  const [alertNotifications, setAlertNotifications] = React.useState([]);

  // widgets for admin
  const [totalSalesDay, setWidgetsTotalSalesDay] = React.useState(0);
  const [totalSalesMonth, setWidgetsTotalSalesMonth] = React.useState(0);
  const [totalSalesHistoric, setWidgetsTotalSalesHistoric] = React.useState(0);
  const [totalIncomeDay, setWidgetsTotalIncomeDay] = React.useState(0);
  const [totalIncomeMonth, setWidgetsTotalIncomeMonth] = React.useState(0);
  const [totalPaidMonth, setWidgetsTotalPaidMonth] = React.useState(0);

  // widgets for employee


  const [mapData, setSalesCountry] = React.useState([]);
  const [pieChart, setPieProducts] = React.useState({});
  const [pieChartProviders, setPieProviders] = React.useState({});
  const [barChartEmployee, setBarEmployees] = React.useState({});
  const [travelAlerts, setTravelAlerts] = React.useState([]);


  const [bar, setBar] = React.useState(null);
  const [tr, setTR] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [redirect, setRedirect] = React.useState(false);
  const [permissions, setPermissions] = React.useState({})

  const ct_series_colors = [
    '#d70206',
    '#f05b4f',
    '#f4c63d',
    '#d17905',
    '#453d3f',
    '#59922b',
    '#0544d3',
    '#6b0392',
    '#f05b4f',
    '#dda458',
    '#eacf7d',
    '#86797d',
    '#b2c326',
    '#6188e2',
    '#a748ca']



  const progressBar = () => {
    setBar(
      <CustomLinearProgress
        variant="indeterminate"
        color="primary"
        value={30}
      />
    );
  };

  const removeProgressBar = () => {
    setBar(null);
  };

  const getTravelAlerts = () => {
    getRequest('travelAlerts').then((response) => {
      let responseData = response.data.data
      let dataContent = [];

      if (responseData.message !== 'No Data To Display' && responseData.code !== 403) {
        responseData.forEach(element => {
          let arrivalDate = element.arrivalDate != null ? element.arrivalDate.split('T')[0] : '';
          dataContent.push(
            {
              daystotravel: element.daystotravel,
              arrivalDate: arrivalDate,
              confirmationNumber: element.confirmationNumber,
              fullname: element.fullname,
              supplier: element.supplier,
              category: element.category,
              product: element.product,
              message: element.message,
              rez_id: element.rez_id
            }
          );
        });

        let tableData = dataContent.map((prop, key) => {
          return {
            daystotravel: prop.daystotravel,
            arrivalDate: prop.arrivalDate,
            confirmationNumber: prop.confirmationNumber,
            fullname: prop.fullname,
            supplier: prop.supplier,
            category: prop.category,
            product: prop.product,
            message: prop.message,
            actions: (
              <div className="actions-right">
                <Button
                  justIcon
                  round
                  simple
                  onClick={() => {
                    warningWithConfirmAndCancelMessage({
                      rez_id: prop.rez_id,
                      message: prop.message
                    });
                  }}
                  color="success"
                  className="success"
                >
                  <DoneIcon />
                </Button>
                <>{" "}</>
              </div>
            )
          }
        });
        setTravelAlerts(tableData)
      }
      removeProgressBar();
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });
  }

  useEffect(() => {
    progressBar();
    var sum = function (a, b) { return a + b };

    let permissionData = JSON.parse(localStorage.getItem("auth"))
    i18n.changeLanguage(permissionData.lang.toLowerCase())
    setPermissions(permissionData)

    getTravelAlerts();

    getRequest('widgets').then((response) => {
      let responseData = response.data

      if (responseData.code === 403) {
        redirectToUnforbidden(props);
      }
      if (responseData.message !== 'No Data To Display') {
        if (permissionData.user_type === 1) {
          setWidgetsTotalSalesDay(responseData.data.find(f => f.widget === 'Total Sales 24 Hs' ?? 0).totalsales ?? 0)
          setWidgetsTotalSalesMonth(responseData.data.find(f => f.widget === 'Total Sales Month' ?? 0).totalsales ?? 0)
          setWidgetsTotalSalesHistoric(responseData.data.find(f => f.widget === 'Total Sales Historic' ?? 0).totalsales ?? 0)
          setWidgetsTotalIncomeDay(responseData.data.find(f => f.widget === 'Total Income 24 Hs' ?? 0).totalsales ?? 0)
          setWidgetsTotalIncomeMonth(responseData.data.find(f => f.widget === 'Total Income Month' ?? 0).totalsales ?? 0)
        }
        else {
          setWidgetsTotalSalesMonth((responseData.data.find(f => f.widget === 'Total Sales Month') ?? 0).totalsales ?? 0)
          setWidgetsTotalSalesHistoric((responseData.data.find(f => f.widget === 'Total Sales Historic') ?? 0).totalsales ?? 0)
          setWidgetsTotalPaidMonth((responseData.data.find(f => f.widget === 'Total Paid Month') ?? 0).totalsales ?? 0)
          setWidgetsTotalIncomeMonth((responseData.data.find(f => f.widget === 'Total Income Month') ?? 0).totalsales ?? 0)
        }
      }
      removeProgressBar();
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });

    getRequest('salesCountry').then((response) => {
      let responseData = response.data

      let dataContent = [];

      if (responseData.message !== 'No Data To Display' && responseData.code !== 403) {
        responseData.data.forEach(element => {
          let dataChild = [];
          dataChild.push(element.key)
          dataChild.push(element.totalsales)
          dataChild.push(element.percentage.toString() + '%')
          dataContent.push(dataChild)
        });

        setSalesCountry(dataContent)
      }
      removeProgressBar();
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });

    getRequest('salesEmployee').then((response) => {
      let responseData = response.data

      //setWidgets(responseData.data);
      let salesBarChart = {
        data: {
          labels: [],
          series: []
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false
          },
          height: "300px",
          legend: {
            "display": false
          },
          tooltips: {
            "enabled": false
          }
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                }
              }
            }
          ]
        ],
        animation: {
          draw: function (data) {
            if (data.type === "bar") {
              data.element.animate({
                opacity: {
                  begin: (data.index + 1) * delays2,
                  dur: durations2,
                  from: 0,
                  to: 1,
                  easing: "ease"
                }
              });
            }
          }
        }
      };

      let serieData = [];

      if (responseData.message !== 'No Data To Display' && responseData.code !== 403) {
        responseData.data.forEach(element => {
          salesBarChart.data.labels.push(element.key)
          serieData.push(element.totalsales)
        });

        salesBarChart.data.series.push(serieData)

        setBarEmployees(salesBarChart)
      }
      removeProgressBar();
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });

    getRequest('salesProvider').then((response) => {
      let responseData = response.data

      if (responseData.code === 403) {
        redirectToUnforbidden(props);
      }
      //setWidgets(responseData.data);
      let pieChart = {
        data: {
          labels: [],
          series: []
        },
        options: {
          height: "300px",
          donut: true,
          donutWidth: 60,
          donutSolid: true,
          startAngle: 270,
          showLabel: true,
          labelInterpolationFnc: function (value) {
            return pieChart.data.series[pieChart.data.labels.indexOf(value)];
          }
        },
        responsiveOptions: [
          ['screen and (min-width: 640px)', {
            chartPadding: 30,
            labelOffset: 100,
            labelDirection: 'explode'
          }],
          ['screen and (min-width: 1024px)', {
            labelOffset: 80,
            chartPadding: 20
          }]
        ]
      };

      if (responseData.message !== 'No Data To Display') {
        responseData.data.forEach(element => {
          pieChart.data.labels.push(element.key)
          pieChart.data.series.push(element.totalsales)
        });
        setPieProviders(pieChart)
      }
      removeProgressBar();
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });

    getRequest('salesProduct').then((response) => {
      let responseData = response.data

      if (responseData.code === 403) {
        redirectToUnforbidden(props);
      }
      //setWidgets(responseData.data);
      let pieChart = {
        data: {
          labels: [],
          series: []
        },
        options: {
          height: "300px",
          donut: true,
          donutWidth: 60,
          donutSolid: true,
          startAngle: 270,
          showLabel: true,
          labelInterpolationFnc: function (value) {
            return pieChart.data.series[pieChart.data.labels.indexOf(value)];
          }
        },
        responsiveOptions: [
          ['screen and (min-width: 640px)', {
            chartPadding: 30,
            labelOffset: 100,
            labelDirection: 'explode'
          }],
          ['screen and (min-width: 1024px)', {
            labelOffset: 80,
            chartPadding: 20
          }]
        ]
      };


      if (responseData.message !== 'No Data To Display') {
        responseData.data.forEach(element => {
          pieChart.data.labels.push(element.key)
          pieChart.data.series.push(element.totalsales)
        });
        setPieProducts(pieChart)
      }

      removeProgressBar();
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });


    getRequest('notifications').then(notificationAlertResponse => {
      let responseData = notificationAlertResponse.data

      if (responseData.code === 403) {
        redirectToUnforbidden(props);
      }

      let alertNotificationMessages = responseData.data.map(r => r.message);
      let alertNotificationData = [];
      alertNotificationMessages.forEach(r => {
        let n = [r];
        alertNotificationData.push(n);
      });
      setAlertNotifications(alertNotificationData);
    }).catch(e => {
      props.history.push('/auth/forbidden')
    });

  }, [])

  const warningWithConfirmAndCancelMessage = (sup) => {
    setAlert(
      <SweetAlert
        warning
        style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
        title='Marcar como tarea completada'
        onConfirm={() => successDelete(sup)}
        onCancel={() => cancelDetele()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        cancelBtnCssClass={alertClasses.button + " " + alertClasses.danger}
        confirmBtnText='Confirmar tarea'
        cancelBtnText='Cancelar'
        showCancel
      >
        Confirme si realmente desea marcar dicha tarea como completada
      </SweetAlert>
    );
  };

  const successDelete = (rez) => {
    let data = {
      rez: rez.rez_id,
      message: rez.message
    }
    notificationsDone(data).then((response) => {
      getTravelAlerts();
      setAlert(
        <SweetAlert
          success
          style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
          title='Operacion realizada con exito!'
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
        >
          Marcada como realizada.
        </SweetAlert>
      );
    })
  };

  const cancelDetele = () => {
    setAlert(
      <SweetAlert
        danger
        style={{ display: "block", marginTop: "-100px", color: "#3e3e3e" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnCssClass={alertClasses.button + " " + alertClasses.success}
      >
        Operacion no realizada.
      </SweetAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <div>
      {bar}
      {
        permissions.user_type !== 1 ?
          <GridContainer>
            {alert}
            { alertNotifications.length >= 1 ?
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="warning" text>
                  <CardText color="warning">
                    <h4 className={classes.cardTitleWhite}>Panel de Notificaciones</h4>
                    <h4 className={classes.cardCategoryWhite}></h4>
                  </CardText>
                </CardHeader>
                <CardBody>
                  <Table
                    hover
                    tableHeaderColor="warning"
                    tableHead={["Mensaje"]}
                    tableData={alertNotifications}
                  />
                </CardBody>
              </Card>
            </GridItem> : <></> }
            <GridItem xs={12} sm={12} md={12}>
              <Card>
                <CardHeader color="danger" text>
                  <CardText color="danger">
                    <h4 className={classes.cardTitleWhite}>Alertas de Viaje</h4>
                    <h4 className={classes.cardCategoryWhite}>
                      Tareas destacadas para viajeros proximos a arrivar
                 </h4>
                  </CardText>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={travelAlerts}
                    filterable
                    columns={[
                      {
                        Header: "Dias",
                        accessor: "daystotravel",
                        width: 80
                      },
                      {
                        Header: "F. Arrivo",
                        accessor: "arrivalDate",
                        width: 90
                      },
                      {
                        Header: "N. Reserva",
                        accessor: "confirmationNumber",
                        width: 170
                      },
                      {
                        Header: "Pasajero",
                        accessor: "fullname",
                        width: 150
                      },
                      {
                        Header: "Proveedor",
                        accessor: "supplier"
                      },
                      {
                        Header: "Categoria",
                        accessor: "category",
                        width: 200
                      },
                      {
                        Header: "Producto",
                        accessor: "product",
                        width: 150
                      },
                      {
                        Header: "Tarea",
                        accessor: "message"
                      },
                      {
                        Header: "Marcar T. Realizada",
                        accessor: "actions",
                        sortable: false,
                        filterable: false
                      }
                    ]}
                    defaultPageSize={5}
                    showPaginationTop
                    showPaginationBottom={false}
                    className="-striped -highlight"
                  />
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          :
          <></>
      }
      {
        permissions.user_type === 1 ?
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={4}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Venta Total ultimas 24hs.</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalSalesDay}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Ultimas 24 hs
              </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={4}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Venta Total del Mes</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalSalesMonth}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Este Mes
              </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={4}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Venta Total Historica</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalSalesHistoric}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Todo el tiempo
              </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={6}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Ganancia Total ultimas 24hs.</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalIncomeDay}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Ultimas 24 hs.
              </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={6}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Ganancia Total del mes</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalIncomeMonth}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Este Mes
              </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
          :
          <GridContainer>
            <GridItem xs={12} sm={6} md={6} lg={6}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Venta Total Historica</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalSalesHistoric}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Todo el tiempo
              </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={6}>
              <Card>
                <CardHeader color="warning" stats icon>
                  <CardIcon color="warning">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Venta Total del Mes</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalSalesMonth}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Este Mes
              </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={6}>
              <Card>
                <CardHeader color="success" stats icon>
                  <CardIcon color="success">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Ganancia del Mes</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalIncomeMonth}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Mes Actual
              </div>
                </CardFooter>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={6} md={6} lg={6}>
              <Card>
                <CardHeader color="danger" stats icon>
                  <CardIcon color="danger">
                    <Icon>receipt</Icon>
                  </CardIcon>
                  <p className={classes.cardCategory}>Cobranzas Mes Anterior</p>
                  <h3 className={classes.cardTitle}>
                    $ {totalPaidMonth}
                  </h3>
                </CardHeader>
                <CardFooter stats>
                  <div className={classes.stats}>
                    <DateRange />
                Mes Anterior
              </div>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
      }

      {
        permissions.user_type === 1 ?
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <CardHeader color="rose" icon>
                  <CardIcon color="rose">
                    <Timeline />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>
                    Ventas Mensuales <small>- Categorizado por Empleado</small>
                  </h4>
                </CardHeader>
                <CardBody>
                  <ChartistGraph
                    data={barChartEmployee.data}
                    type="Bar"
                    options={barChartEmployee.options}
                    listener={barChartEmployee.animation}
                  />
                </CardBody>
              </Card>
            </GridItem>
            <GridItem xs={12} sm={12} md={4}>
              <Card>
                <CardHeader color="success" icon>
                  <CardIcon color="success">
                    <Language />
                  </CardIcon>
                  <h4 className={classes.cardIconTitle}>
                    Ventas por Pais
              </h4>
                </CardHeader>
                <CardBody>
                  <GridContainer justify="space-between">
                    <GridItem xs={12} sm={12} md={12}>
                      <Table
                        tableData={mapData}
                      />
                    </GridItem>
                  </GridContainer>
                </CardBody>
              </Card>
            </GridItem>
          </GridContainer>
          :
          <></>
      }

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="danger" icon>
              <CardIcon color="danger">
                <Timeline />
              </CardIcon>
              <h4 className={classesChart.cardIconTitle}>Totalizado de Ventas por Producto</h4>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={pieChart.data}
                type="Pie"
                options={pieChart.options}
                responsiveOptions={pieChart.responsiveOptions}
              />
            </CardBody>
            <CardFooter stats className={classesChart.cardFooter}>
              <h6 className={classesChart.legendTitle}>Leyenda</h6>
              {
                pieChart.data != undefined ?
                  pieChart.data.labels.map((item, i) => {
                    return <i className={"fas fa-circle "} style={{ color: ct_series_colors[i] }}> <i style={{ color: blackColor }}>{item}{` `}</i>  </i>
                  }) : <></>
              }
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="danger" icon>
              <CardIcon color="danger">
                <Timeline />
              </CardIcon>
              <h4 className={classesChart.cardIconTitle}>Totalizado de Ventas por Proveedor</h4>
            </CardHeader>
            <CardBody>
              <ChartistGraph
                data={pieChartProviders.data}
                type="Pie"
                options={pieChartProviders.options}
                responsiveOptions={pieChartProviders.responsiveOptions}
              />
            </CardBody>
            <CardFooter stats className={classesChart.cardFooter}>
              <h6 className={classesChart.legendTitle}>Leyenda</h6>
              {
                pieChartProviders.data != undefined ?
                  pieChartProviders.data.labels.map((item, i) => {
                    return <i className={"fas fa-circle "} style={{ color: ct_series_colors[i] }}> <i style={{ color: blackColor }}>{item}{` `}</i>  </i>
                  }) : <></>
              }
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
