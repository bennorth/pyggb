import { useStoreActions } from "../store";
import React, { useEffect } from "react";
import { cssValue } from "../shared/utils";

declare var GGBApplet: any;

const nextAppletDivId = (() => {
  let nextId = 10000;
  return () => `ggb-applet-content-${++nextId}`;
})();

export const GeoGebraPane: React.FC<{}> = () => {
  const setGgbAppletApi = useStoreActions((a) => a.dependencies.setGgbApi);

  const divId = nextAppletDivId();

  useEffect(() => {
    const params = {
      scaleContainerClass: "GeoGebraPane",
      width: cssValue("--pyggb-geogebra-pane-width"),
      height: cssValue("--pyggb-geogebra-pane-height"),
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      showToolBarHelp: false,
      showResetIcon: false,
      enableLabelDrags: false,
      enableShiftDragZoom: true,
      enableRightClick: false,
      errorDialogsActive: false,
      useBrowserForJS: false,
      allowStyleBar: false,
      preventFocus: false,
      showZoomButtons: true,
      appletOnLoad: (api: any) => {
        api.setPerspective("G");
        setGgbAppletApi(api);
      },
    };

    const appletDiv = document.getElementById(divId);
    if (appletDiv == null) {
      console.error(`no appletDiv; could not find id "${divId}"`);
      return;
    }

    const doneInject = appletDiv.getAttribute("data-PyGgb-injected") === "yes";
    if (doneInject) {
      return;
    }
    appletDiv.setAttribute("data-PyGgb-injected", "yes");

    const ggbApplet = new GGBApplet(params, true);
    ggbApplet.inject(divId);
  });

  return (
    <div className="GeoGebraPane">
      <div id={divId}></div>
    </div>
  );
};
