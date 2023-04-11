import { useStoreActions } from "../store";
import React, { useEffect } from "react";
import { GgbApi } from "../shared/vendor-types/ggbapi";

declare var GGBApplet: any;

const useLocalGeoGebraBundle = process.env.REACT_APP_LOCAL_GEOGEBRA === "yes";

// Using a local copy of the GGB bundle was not initially successful.  One
// symptom was that the browser attempted to fetch the main files
// (BIG-HEX-STRING.js) from http://localhost:3000/BIG-HEX-STRING.js, seemingly
// ignoring the setHTML5Codebase().  I think the reason for this was that the
// <script> element which is dynamically created gets attached as a child to the
// applet div, but React was throwing that div away and making a new one.  So the
// code in the GGB loader which attempts to find where the running script came
// from failed.  Fixing this by changing deployggb.js allowed more progress, but
// then Python programs weren't working.  It seemed that there were two GGB API
// objects floating round, and the wrong one was being used.  I don't know why
// this didn't show up when fetching the files from GGB's CDN; a race seems
// likely.  In any event, both problems seem to be resolved (allowing the
// original deployggb.js to be used) by ensuring a fresh element-ID is used each
// time the component is rendered, and by ensuring (by means of a data
// attribute) that we only inject() the GGB app into the DIV once.

const nextAppletDivId = (() => {
  let nextId = 10000;
  return () => `ggb-applet-content-${++nextId}`;
})();

export const GeoGebraPane: React.FC<{}> = () => {
  const setGgbAppletApi = useStoreActions((a) => a.dependencies.setGgbApi);

  const divId = nextAppletDivId();
  const containerId = `container-${divId}`;

  let ggbApi: GgbApi | null = null;

  useEffect(() => {
    const containerDiv = document.getElementById(containerId)?.parentElement;
    if (containerDiv == null) {
      console.error(`no containerDiv (parent of id "${containerId}")`);
      return;
    }

    const params = {
      width: 1, // Will be overridden on load
      height: 1, // Will be overridden on load
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
        ggbApi = api;
        api.setPerspective("G");
        setGgbAppletApi(api);
        api.setSize(containerDiv.clientWidth, containerDiv.clientHeight);
      },
    };

    const appletDiv = document.getElementById(divId);
    if (appletDiv == null) {
      console.error(`no appletDiv; could not find id "${divId}"`);
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      if (ggbApi == null) {
        // Maybe the applet hasn't loaded yet.
        return;
      }

      const lastEntry = entries[entries.length - 1];
      const contentBox = lastEntry.contentBoxSize[0];
      const boxWidth = contentBox.inlineSize;
      const boxHeight = contentBox.blockSize;
      ggbApi.setSize(boxWidth, boxHeight);
    });
    resizeObserver.observe(containerDiv);

    const doneInject = appletDiv.getAttribute("data-PyGgb-injected") === "yes";
    if (doneInject) {
      return;
    }
    appletDiv.setAttribute("data-PyGgb-injected", "yes");

    const ggbApplet = new GGBApplet(params, true);

    if (useLocalGeoGebraBundle) {
      ggbApplet.setHTML5Codebase("/vendor/geogebra/GeoGebra/HTML5/5.0/web3d/");
    }

    ggbApplet.inject(divId);

    return () => {
      resizeObserver.disconnect();
    };
  });

  return (
    <div className="GeoGebraPane" id={containerId}>
      <div id={divId}></div>
    </div>
  );
};
