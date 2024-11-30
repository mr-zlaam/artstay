import type { IPAYLOAD } from "../types/types.js";

export const payloadGenerator = ({ ...rest }: IPAYLOAD): IPAYLOAD => {
  return { ...rest };
};
