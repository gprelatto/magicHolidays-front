import React, { useEffect } from "react";

import MyDocument from "components/EmailTemplateGenerator/Document.js";
import { PDFViewer } from '@react-pdf/renderer';

export default function EmailTemplateGenerator(props) {
    
    return (
        <PDFViewer width={1000} height={1000}>
          <MyDocument />
        </PDFViewer>
    )
}