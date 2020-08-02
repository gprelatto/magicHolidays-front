import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        body: {
            margin: '0px',
            padding: '0px',
            'font-family': "Helvetica Neue, Helvetica, sans-serif, Comic Sans MS",
            'background-repeat': 'repeat-y',
            'background-size': '50px auto',
            'background-position': 'left'
        },
        h1: {
            'font-family': "Garden Grown US B",
            'font-size': '12vw',
            'color': '#27A99F'
        },
        h3: {
            'font-weight': 400,
            'line-height': '16pt',
            'font-size': '12pt'
        },
        strong: {
            color: '#27A99F'
        },
        '#contenedor': {
            'padding-top': '2em',
            'margin-left': '25px'
        },
        '.titular': {
            'font-size': '10vw',
            'margin-bottom': '10x',
            'margin-top': '6px',
            'padding-left': '10px'
        },
        '.foto': {
            width: '70%',
            height: '100%',
            'padding-right': '10px'
        },
        span: {
            color: 'black',
            'font-family': "Comic Sans MS"
        },
        '@media (min-width:768px)': {
            body: {
                'background-size': '169px auto'
            },
            h1: {
                'font-size': '10vw'
            },
            h3: {
                'font-size': '14pt'
            },
            '.titular': {
                'font-size': '5vw',
                'margin-bottom': '10px',
                'margin-top': '0px'
            },
            '#contenedor': {
                'margin-left': '156px'
            },
            '.foto': {
                width: '400px',
                'padding-right': '30px'
            }
        },
        '@media (min-width:1200px)': {
            '.foto': {
                width: '50%'
            }
        }
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
});

Font.register({
    family: 'Garden-Grown',
    src: `/font/GardenGrownUS-B.otf`,
});

// Create Document Component
const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page} >
            <View >
                <h1>Romina Zain</h1>
                <Text >
                    Magic Holidays ubicada en la ciudad de Orlando es una agencia autorizada por Disney y Universal.
                    Te garantizamos una atención personalizada y un acompañamiento completo desde el inicio hasta el final de tu viaje SIN NINGÚN COSTO EXTRA.
                    Haremos todo lo posible para que aproveches al máximo tu experiencia, tiempo e inversión, buscando opciones que se ajusten a tu grupo y presupuesto.
                    Te compartimos tips, recomendaciones, apoyo con reservación de restaurantes y Fast Pass, explicación de cómo utilizar las APPS para los parques y todo lo que necesites.
                </Text>
            </View>
        </Page>
    </Document>
);

export default MyDocument;