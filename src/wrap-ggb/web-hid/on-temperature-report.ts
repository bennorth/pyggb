import { AppApi } from "../../shared/appApi";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

function deviceId(device: HIDDevice): string {
  const vendorId = device.vendorId.toString(16).padStart(4, "0");
  const productId = device.productId.toString(16).padStart(4, "0");
  return `${vendorId}:${productId}`;
}

function valueOfEvent(event: HIDInputReportEvent): number {
  const device = event.target as HIDDevice;
  switch (deviceId(device)) {
    case "046d:c214":
      // Logitech, Inc. ATK3 (Attack III Joystick)
      return event.data.getUint8(2) / 255.0;
    case "08f7:0002":
      // Vernier Go!Temp
      const rawTemp = event.data.getInt16(2, true);
      const rawCelsius = 0.0078117735 * rawTemp + 0.4979364513;
      const celsius = Math.round(rawCelsius * 10) / 10;
      return celsius;
    default:
      return 0;
  }
}
