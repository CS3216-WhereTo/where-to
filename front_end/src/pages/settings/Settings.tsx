import React, { useState } from 'react';
import './Settings.css';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonButton, IonList, IonListHeader } from "@ionic/react";

const Settings: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
      <IonList>
        <IonItem lines="none">
          <IonListHeader>Walking Speed</IonListHeader>
          {/* <IonSelect class="ion-select">
              <IonSelectOption value="opt1">Very very long text</IonSelectOption>
          </IonSelect> */}
        </IonItem>
        <IonItem lines="none">
          <IonLabel>5 kilometers/hour</IonLabel>
        </IonItem>
        
        <IonItem lines="none">
          <IonButton>
            <IonLabel>Recalibrate</IonLabel>
          </IonButton>
        </IonItem>

        <IonItem lines="none">
          <IonButton shape="round" href="./">Sign Out</IonButton>
        </IonItem>
      </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
