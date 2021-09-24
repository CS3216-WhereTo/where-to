import { IonList, IonItem } from "@ionic/react";

import "./Modal.css";
import ModalBusItem from "./ModalBusItem";
import ModalWalkItem from "./ModalWalkItem";

/**
 * Content for react-modal-sheet
 */
const Modal = ({ dirType, busDir, walkDir, busDuration, busDistance, walkDuration, walkDistance }) => {
  return (
    <div className="modal">
      <IonList className="modal__content" lines="full">
        <IonItem>
          <p className="modal__header">{dirType === "bus" ? `${busDuration} min (${busDistance} km)` : `${walkDuration} min (${walkDistance} km)`}</p>
        </IonItem>

        <div className="modal__list--scroll">
          {dirType === "bus"
            ? busDir.map((elem, i) => {
                if (elem.type === "bus") {
                  return (
                    <ModalBusItem
                      key={i}
                      location={elem.location}
                      duration={elem.duration ? Math.floor(elem.duration / 60) : null}
                      stops={elem.stops}
                    />
                  );
                } else {
                  return <ModalWalkItem key={i} location={elem.location} duration={elem.duration ? Math.floor(elem.duration / 60) : null} />;
                }
              })
            : walkDir.map((elem, i) => {
                return <ModalWalkItem key={i} location={elem.location} duration={elem.duration} />;
              })}
        </div>
      </IonList>
    </div>
  );
};

export default Modal;
