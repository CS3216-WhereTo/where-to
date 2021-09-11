import React, { useState } from 'react';
import './Settings.css';

import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, 
  IonItem, IonLabel, IonButton, IonList, IonListHeader } from "@ionic/react";

const Settings = (props) => {
  const isSignedIn = true;
  
  if (isSignedIn) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
        <IonList lines="none">
          <IonItem>
            <IonListHeader>Walking Speed</IonListHeader>
            {/* <IonSelect class="ion-select">
                <IonSelectOption value="opt1">Very very long text</IonSelectOption>
            </IonSelect> */}
          </IonItem>
          <IonItem>
            <IonLabel>5 kilometers/hour</IonLabel>
          </IonItem>
          
          <IonItem>
            <IonButton>
              <IonLabel>Recalibrate</IonLabel>
            </IonButton>
          </IonItem>

          <IonItem>
            <IonButton slot="" shape="round" href="./">Sign Out</IonButton>
          </IonItem>
        </IonList>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Settings</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonContent>
          <div className="sign-in">
            <IonList lines="none">
              <div className="sign-in__label">
                <IonItem>
                    <IonLabel>You are not signed in.</IonLabel>
                </IonItem>
              </div>

              <div className="sign-in__button">
                <IonItem>
                  <IonButton slot="" shape="round" href="./">Sign In</IonButton>
                </IonItem>
              </div>
            </IonList>
          </div>
        </IonContent>
      </IonPage>
    );
  }

};

export default Settings;
