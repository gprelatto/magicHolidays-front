import React, { useEffect } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// react plugin for creating vector maps
import { VectorMap } from "react-jvectormap";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Icon from "@material-ui/core/Icon";

// @material-ui/icons
// import ContentCopy from "@material-ui/icons/ContentCopy";
import Store from "@material-ui/icons/Store";
// import InfoOutline from "@material-ui/icons/InfoOutline";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Refresh from "@material-ui/icons/Refresh";
import Edit from "@material-ui/icons/Edit";
import Place from "@material-ui/icons/Place";
import ArtTrack from "@material-ui/icons/ArtTrack";
import Language from "@material-ui/icons/Language";

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

// @material-ui/icons
import Timeline from "@material-ui/icons/Timeline";

import styles from "assets/jss/material-dashboard-pro-react/views/dashboardStyle.js";
import chartStyles from "assets/jss/material-dashboard-pro-react/views/chartsStyle.js";

import priceImage1 from "assets/img/card-2.jpeg";
import priceImage2 from "assets/img/card-3.jpeg";
import priceImage3 from "assets/img/card-1.jpeg";

import { getRequest,  redirectToUnforbidden } from 'common/Request/Requests.js'
import { blackColor } from "assets/jss/material-dashboard-pro-react";

const us_flag = require("assets/img/flags/US.png");
const de_flag = require("assets/img/flags/DE.png");
const au_flag = require("assets/img/flags/AU.png");
const gb_flag = require("assets/img/flags/GB.png");
const ro_flag = require("assets/img/flags/RO.png");
const br_flag = require("assets/img/flags/BR.png");

const useStyles = makeStyles(styles);
const useChartStyles = makeStyles(chartStyles);

export default function Dashboard(props) {
  const classes = useStyles();
  const classesChart = useChartStyles();
  const [widgets, setWidgets] = React.useState([]);
  const [totalSales, setWidgetsTotalSales] = React.useState([]);
  const [totalRevenue, setWidgetsTotalRevenue] = React.useState([]);
  const [totalFees, setWidgetsTotalFees] = React.useState([]);
  const [mapData, setSalesCountry] = React.useState({});
  const [pieChart, setPieProducts] = React.useState({});
  const [bar, setBar] = React.useState(null);
  const [tr, setTR] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [redirect, setRedirect] = React.useState(false);
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



  useEffect(() => {
      progressBar();
      var sum = function(a, b) { return a + b };
      
      getRequest('widgets').then((response) => {
          let responseData = response.data

          if(responseData.code === 403) {
              redirectToUnforbidden(props);
          }
          //setWidgets(responseData.data);
          setWidgetsTotalSales(responseData.data.find(f => f.widget === 'Total Sales').totalsales ?? 0)
          setWidgetsTotalRevenue(responseData.data.find(f => f.widget === 'Total Revenue').totalsales ?? 0)
          setWidgetsTotalFees(responseData.data.find(f => f.widget === 'Total Fees').totalsales ?? 0)
          removeProgressBar();
      }).catch(e => {
          props.history.push('/auth/forbidden')
      });

      getRequest('salesCountry').then((response) => {
        let responseData = response.data

        if(responseData.code === 403) {
            redirectToUnforbidden(props);
        }
        //setWidgets(responseData.data);
        let data = {};
        responseData.data.forEach(element => {
          data[element.key] = element.totalsales
        });
        setSalesCountry(data)
        removeProgressBar();
      }).catch(e => {
          props.history.push('/auth/forbidden')
      });     

      getRequest('salesProduct').then((response) => {
        let responseData = response.data

        if(responseData.code === 403) {
            redirectToUnforbidden(props);
        }
        //setWidgets(responseData.data);
        let pieChart = {
          data : {
            labels : [],
            series : []
          },
          options : {
            height:  "300px",
            donut: true,
            donutWidth: 60,
            donutSolid: true,
            startAngle: 270,
            showLabel: true,
            labelInterpolationFnc: function(value) {
              return  pieChart.data.series[pieChart.data.labels.indexOf(value)];
            }            
          },
          responsiveOptions : [
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
        responseData.data.forEach(element => {
          pieChart.data.labels.push(element.key)
          pieChart.data.series.push(element.totalsales)
        });
        setPieProducts(pieChart)
        removeProgressBar();
      }).catch(e => {
          props.history.push('/auth/forbidden')
      });         
  }, [])  
  


  





  return (
    <div>
      {bar}
      <GridContainer>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <Icon>receipt</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Sales</p>
              <h3 className={classes.cardTitle}>
               $ {totalSales}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <Icon>monetization_on</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Revenue</p>
              <h3 className={classes.cardTitle}>
                $  {totalRevenue}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={6} lg={4}>
          <Card>
            <CardHeader color="success" stats icon>
              <CardIcon color="success">
                <Icon>local_atm</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Total Fees</p>
              <h3 className={classes.cardTitle}>
                $  {totalFees}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <DateRange />
                Last 24 Hours
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <Card>
            <CardHeader color="success" icon>
              <CardIcon color="success">
                <Language />
              </CardIcon>
              <h4 className={classes.cardIconTitle}>
                Sales by Location
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer justify="space-between">
                <GridItem xs={12} sm={12} md={5}>
                  <Table
                    tableData={[
                      [
                        <img src={us_flag} alt="us_flag" key={"flag"} />,
                        "USA",
                        "2.920",
                        "53.23%"
                      ],
                      [
                        <img src={de_flag} alt="us_flag" key={"flag"} />,
                        "Germany",
                        "1.300",
                        "20.43%"
                      ],
                      [
                        <img src={au_flag} alt="us_flag" key={"flag"} />,
                        "Australia",
                        "760",
                        "10.35%"
                      ],
                      [
                        <img src={gb_flag} alt="us_flag" key={"flag"} />,
                        "United Kingdom",
                        "690",
                        "7.87%"
                      ],
                      [
                        <img src={ro_flag} alt="us_flag" key={"flag"} />,
                        "Romania",
                        "600",
                        "5.94%"
                      ],
                      [
                        <img src={br_flag} alt="us_flag" key={"flag"} />,
                        "Brasil",
                        "550",
                        "4.34%"
                      ]
                    ]}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <VectorMap
                    map={"world_mill"}
                    backgroundColor="transparent"
                    zoomOnScroll={false}
                    containerStyle={{
                      width: "100%",
                      height: "280px"
                    }}
                    containerClassName="map"
                    regionStyle={{
                      initial: {
                        fill: "#e4e4e4",
                        "fill-opacity": 0.9,
                        stroke: "none",
                        "stroke-width": 0,
                        "stroke-opacity": 0
                      }
                    }}
                    series={{
                      regions: [
                        {
                          values: mapData,
                          scale: ["#AAAAAA", "#444444"],
                          normalizeFunction: "polynomial"
                        }
                      ]
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="danger" icon>
              <CardIcon color="danger">
                <Timeline />
              </CardIcon>
              <h4 className={classesChart.cardIconTitle}>Totalizado de Productos Vendidos</h4>
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
                    return <i className={"fas fa-circle " } style={{ color : ct_series_colors[i] }}> <i style={{color : blackColor}}>{item}{` `}</i>  </i>
                  }) : <></>
              }
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>      
    </div>
  );
}
