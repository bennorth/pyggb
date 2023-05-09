import React from "react";
import { useStoreActions } from "../store";
import { Button } from "react-bootstrap";

export const AboutButton: React.FC<{}> = () => {
  const setActive = useStoreActions((a) => a.modals.aboutPyGgb.setActive);
  const launch = () => setActive(true);

  return (
    <div className="ControlButton about-button">
      <Button onClick={launch}>About</Button>
    </div>
  );
};
