import { IonList, IonItem } from "@ionic/react";

import ModalBusItem from "./ModalBusItem";
import ModalWalkItem from "./ModalWalkItem";
import "./Modal.css";

const Modal = ({ dirType, busDir, walkDir }) => {
  return (
  <div className="modal">
    <IonList className="modal__content" lines="full">
      <IonItem>
        <p className="modal__header">15 mins (1.5 km)</p>
      </IonItem>
      <div className="modal__list--scroll">
        {dirType === "bus"
          ? busDir.map((elem, i) => {
              if (elem.type === "bus") {
                return (
                  <ModalBusItem 
                    key={i}
                    location={elem.location}
                    duration={elem.duration}
                  />
                );
              } else {
                return (
                  <ModalWalkItem 
                    key={i}
                    location={elem.location}
                    duration={elem.duration}
                  />
                );
              }
            })
          : walkDir.map((elem, i) => {
              return (
                <ModalWalkItem 
                  key={i}
                  location={elem.location}
                  duration={elem.duration}
                />
              );
            })}
      </div>
    </IonList>
  </div>
  );
};

export default Modal;