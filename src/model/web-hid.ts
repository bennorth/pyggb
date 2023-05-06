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

export type WebHid = {
  acquisitionStatus: DeviceAcquisitionStatus;
  setAcquisitionStatus: Action<WebHid, DeviceAcquisitionStatus>;
};

export let webHid: WebHid = {
  acquisitionStatus: "not-yet-requested",
  setAcquisitionStatus: propSetterAction("acquisitionStatus"),
};
