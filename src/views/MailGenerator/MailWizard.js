import React from "react";

// core components
import Wizard from "components/Wizard/Wizard.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";

import SelectOptionWizard from "./steps/SelectOptionWizard.js";
import DisneyHotel from "./steps/DisneyHotel.js";
import DisneyTicket from "./steps/DisneyTicket.js";

export default function WizardView() {
  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={8}>
        <Wizard
          validate
          steps={[
            { stepName: "Elegir Opcion", stepComponent: SelectOptionWizard, stepId: "cardSelect", condition: "none" },
            { stepName: "Disney Hotel", stepComponent: DisneyHotel, stepId: "disneyHotel", condition: "disneyHotel" },
            { stepName: "Disney Ticket", stepComponent: DisneyTicket, stepId: "disneyTicket", condition: "disneyTicket" }
          ]}
          title="Build Your Profile"
          subtitle="This information will let us know more about you."
          finishButtonClick={e => console.log('EEE', e)}
        />
      </GridItem>
    </GridContainer>
  );
}
