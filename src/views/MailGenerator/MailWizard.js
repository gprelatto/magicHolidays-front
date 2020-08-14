import React from "react";

// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import SelectOptionWizard from "./steps/SelectOptionWizard.js";
import DisneyHotel from "./steps/DisneyHotel.js";
import DisneyTicket from "./steps/DisneyTicket.js";

import Template from "./mailsGenerator.js"
import Final from "./steps/Final.js";
import UniversalTicket from "./steps/UniversalTicket.js";
import UniversalHotel from "./steps/UniversalHotel.js";
import OtrosDestinos from "./steps/OtrosDestinos.js";
import Crucero from "./steps/Crucero.js";

export default function WizardView() {
  const [renderTemplate, setRenderTemplate] = React.useState(false);
  const [cards, setCards] = React.useState([])

  const returnToWizard = (bool) => {
    setRenderTemplate(bool);
  }

  const showTemplate = () => {
    return (
      <Template cards={cards} returnToWizard={returnToWizard}/>
    )
  }

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={8}>
        {!renderTemplate ?
          <Wizard
            validate
            steps={[
              { stepName: "Elegir Opcion", stepComponent: SelectOptionWizard, stepId: "cardSelect", condition: "none" },
              { stepName: "Disney Hotel", stepComponent: DisneyHotel, stepId: "disneyHotel", condition: "disneyHotel" },
              { stepName: "Disney Ticket", stepComponent: DisneyTicket, stepId: "disneyTicket", condition: "disneyTicket" },
              { stepName: "Universal Ticket", stepComponent: UniversalTicket, stepId: "universalTicket", condition: "universalTicket" },
              { stepName: "Universal Hotel", stepComponent: UniversalHotel, stepId: "universalHotel", condition: "universalHotel" },
              { stepName: "Otro Destino", stepComponent: OtrosDestinos, stepId: "otrosDestinos", condition: "otrosDestinos" },
              { stepName: "Crucero", stepComponent: Crucero, stepId: "crucero", condition: "crucero" },
              
              //ALWAYS THE LAST STEP
              { stepName: "Final", stepComponent:Final, stepId: "final", condition: "final" }
            ]}
            title="Crear Template de Email"
            subtitle="Herramienta para generar PDF a ser enviado."
            finishButtonClick={e => {
              setCards(e);
              setRenderTemplate(true);
            }}
          /> : 
          <>
            { showTemplate() }
          </>
        }
      </GridItem>
    </GridContainer>
  );
}
