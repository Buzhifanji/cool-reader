import { HGIHLIGHT_BUS } from "src/constants";

export const lighlightBus = useEventBus<{ range: Range, scrollTop: number }>(HGIHLIGHT_BUS)