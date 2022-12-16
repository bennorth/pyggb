import { useStoreActions } from "../store";
import React, { useEffect } from "react";
import { cssValue } from "../shared/utils";

declare var GGBApplet: any;

export const GeoGebraPane: React.FC<{}> = () => {
  const setGgbAppletApi = useStoreActions((a) => a.dependencies.setGgbApi);

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

    const ggbApplet = new GGBApplet(params, true);
    ggbApplet.inject("ggb-applet-content");
  });

  return (
    <div className="GeoGebraPane">
      <div id="ggb-applet-content"></div>
    </div>
  );
};
