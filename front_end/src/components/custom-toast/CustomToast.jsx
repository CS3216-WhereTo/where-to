import { IonToast } from "@ionic/react";

const CustomToast = ({ showToast, setShowToast, toastMessage, dismissBtnHandler }) => {
  const dismissBtn = {
    text: "Okay",
    role: "cancel",
    handler: dismissBtnHandler,
  };

  return (
    <IonToast
      isOpen={showToast}
      onDidDismiss={() => setShowToast(false)}
      message={toastMessage}
      position={"top"}
      duration={2000}
      buttons={[dismissBtn]}
    />
  );
};

export default CustomToast;
