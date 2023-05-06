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
};
