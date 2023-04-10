type AnyVoidFunction = (...args: Array<any>) => void;

export type GgbApi = {
  getObjectType(label: string): string;

  getVisible(label: string): boolean;
  setVisible(label: string, isVisible: boolean): void;

  isIndependent(label: string): boolean;

  getValue(label: string): number;
  setValue(label: string, value: number): void;

  getXcoord(label: string): number;
  getYcoord(label: string): number;
  setCoords(label: string, x: number, y: number): void;

  getColor(label: string): string;
  setColor(label: string, r: number, g: number, b: number): void;

  getPointSize(label: string): number;
  setPointSize(label: string, size: number): number;

  getLineThickness(label: string): number;
  setLineThickness(label: string, thickness: number): number;

  deleteObject(label: string): void;

  evalCommandGetLabels(cmd: string): string;

  registerObjectUpdateListener(label: string, fun: AnyVoidFunction): void;

  reset(): void;
};
