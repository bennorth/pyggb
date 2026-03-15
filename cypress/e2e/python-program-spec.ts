import * as z from "zod/mini";

const zRunsWithoutErrorSpec = z.strictObject({
  only: z.optional(z.boolean()),
  label: z.string(),
  code: z.string(),
  expOutputs: z.optional(z.array(z.string())),
  expNonOutputs: z.optional(z.array(z.string())),
});

export const zRunsWithoutErrorSpecArr = z.array(zRunsWithoutErrorSpec);
