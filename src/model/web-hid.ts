import { Action, Thunk, action, thunk } from "easy-peasy";
import { propSetterAction } from "../shared/utils";

const kDeviceFilters = [
  {
    // Logitech Attack III Joystick
    vendorId: 0x046d,
    productId: 0xc214,
  },
  {
    // Vernier Go!Temp
    vendorId: 0x08f7,
    productId: 0x0002,
  },
];

type DeviceAcquisitionStatus =
  | "not-yet-requested"
  | "requesting"
  | "failed"
  | "succeeded";

export interface HidInputReportEventClient {
  onInputreport(event: HIDInputReportEvent): Promise<void>;
}

const kNopClient: HidInputReportEventClient = {
  onInputreport: (_event) => Promise.resolve(),
};

export type WebHid = {
  acquisitionStatus: DeviceAcquisitionStatus;
  setAcquisitionStatus: Action<WebHid, DeviceAcquisitionStatus>;

  client: HidInputReportEventClient;
  setClient: Action<WebHid, HidInputReportEventClient>;
  forwardEvent: Thunk<WebHid, HIDInputReportEvent>;

  openDevice: Thunk<WebHid>;

  registerClient: Thunk<WebHid, HidInputReportEventClient>;
};

export let webHid: WebHid = {
  acquisitionStatus: "not-yet-requested",
  setAcquisitionStatus: propSetterAction("acquisitionStatus"),

  client: kNopClient,
  setClient: propSetterAction("client"),

  forwardEvent: thunk(async (_a, event, helpers) => {
    const client = helpers.getState().client;
    await client.onInputreport(event);
  }),

  openDevice: thunk(async (a, _voidPayload, helpers) => {
    const state = helpers.getState();
    switch (state.acquisitionStatus) {
      case "not-yet-requested":
      case "failed":
        // Continue with main body; handle "failed" like this to let
        // the user change their mind.
        break;
      case "requesting":
      case "succeeded":
        // Either we already have the device or we're in the middle of
        // asking for it.
        return;
    }

    a.setAcquisitionStatus("requesting");

    try {
      const filterOpts = { filters: kDeviceFilters };
      const devices = await navigator.hid.requestDevice(filterOpts);

      if (devices.length === 0) {
        console.warn("no HID devices granted by user");
        a.setAcquisitionStatus("failed");
        return;
      }

      const device = devices[0];

      await device.open();
      device.addEventListener("inputreport", (e) => a.forwardEvent(e));

      a.setAcquisitionStatus("succeeded");
    } catch (err) {
      console.error("Error setting up HID device", err);
      a.setAcquisitionStatus("failed");
    }
  }),

  registerClient: thunk(async (a, client, helpers) => {
    await a.openDevice();
    if (helpers.getState().acquisitionStatus !== "succeeded")
      throw new Error("failed to acquire HID device");

    a.setClient(client);
  }),
};
