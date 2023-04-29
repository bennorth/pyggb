import React from "react";
import { Button, Modal } from "react-bootstrap";
import { useStoreActions, useStoreState } from "../../store";

type NewTabAProps = {
  href: string;
  children?: React.ReactNode;
};

const NewTabA: React.FC<NewTabAProps> = ({ href, children }) => {
  return (
    <a target="_blank" rel="noreferrer" href={href}>
      {children}
    </a>
  );
};

export const AboutPyGgbModal: React.FC<{}> = () => {
  const isActive = useStoreState((s) => s.modals.aboutPyGgb.active);
  const setActive = useStoreActions((a) => a.modals.aboutPyGgb.setActive);
  const dismiss = () => setActive(false);

  return (
    <Modal className="AboutPyGgbModal" show={isActive} animation={false}>
      <Modal.Header>
        <Modal.Title>About PyGgb</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section className="logo-and-text">
          <p>
            <img src="media/python-w240.png" alt="Python logo" />
          </p>
          <p>
            PyGgb is an online environment in which you can program in Python
            and see your graphical output in GeoGebra. PyGgb is currently in
            beta release so all features are subjects to change. You can report
            bugs, make feature requests and share cool programs you’ve made at{" "}
            <NewTabA href="https://www.reddit.com/r/pyggb/">
              <code>/r/pyggb</code>
            </NewTabA>
            .
          </p>
        </section>
        <section className="logo-and-text">
          <p>
            <img src="media/geogebra-w240.png" alt="GeoGebra logo" />
          </p>
          <p>
            For terms of use, please see GeoGebra’s{" "}
            <NewTabA href="https://www.geogebra.org/license">License</NewTabA>,{" "}
            <NewTabA href="https://www.geogebra.org/tos">
              Terms of Service
            </NewTabA>
            , and{" "}
            <NewTabA href="https://www.geogebra.org/privacy">
              Privacy Policy
            </NewTabA>
            . We use <NewTabA href="https://skulpt.org/">Skulpt</NewTabA> to run
            Python in the browser, and the{" "}
            <NewTabA href="https://ace.c9.io/">Ace Editor</NewTabA> for the
            coding window.
          </p>
        </section>
        <hr></hr>
        <section className="logo-and-text">
          <p>
            <NewTabA href="https://pytch.org/">
              <img src="media/pytch-w240.png" alt="Pytch logo" />
            </NewTabA>
          </p>
          <p>
            You might also like to try{" "}
            <NewTabA href="https://pytch.org/">Pytch</NewTabA>, an online
            environment which helps learners bridge the gap from Scratch to
            Python.
          </p>
        </section>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={dismiss}>OK</Button>
      </Modal.Footer>
    </Modal>
  );
};
