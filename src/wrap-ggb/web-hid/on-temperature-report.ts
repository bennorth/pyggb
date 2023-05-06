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

export const register = (mod: any, appApi: AppApi) => {
  const hidApi = appApi.hid;
  const uiApi = appApi.ui;
  const skApi = appApi.sk;

  let pyHandlers: Array<SkObject> = [];
  let runningHandlers = false;

  async function broadcastToHandlers(event: HIDInputReportEvent) {
    if (runningHandlers) {
      console.log("ignoring HID event; handlers already running");
      return;
    }

    runningHandlers = true;

    const value = valueOfEvent(event);
    const pyValue = new Sk.builtin.float_(value);

    for (const fun of pyHandlers) {
      uiApi.runControlClient.handleStartRun();
      try {
        await Sk.misceval.asyncToPromise(() =>
          Sk.misceval.callsimOrSuspend(fun, pyValue)
        );
      } catch (err) {
        skApi.onError(err as any);
        break;
      } finally {
        uiApi.runControlClient.handleFinishRun();
      }
    }

    runningHandlers = false;
  }
};
