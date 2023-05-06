import { AppApi } from "../../shared/appApi";
import { SkObject, SkulptApi } from "../../shared/vendor-types/skulptapi";

declare var Sk: SkulptApi;

function deviceId(device: HIDDevice): string {
  const vendorId = device.vendorId.toString(16).padStart(4, "0");
  const productId = device.productId.toString(16).padStart(4, "0");
  return `${vendorId}:${productId}`;
}
