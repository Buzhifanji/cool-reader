import { HGIHLIGHT_BUS, HGIHLIGHT_CLICK_BUS } from "src/constants";

export const lighlightBus = useEventBus<{ range: Range, scrollTop: number }>(HGIHLIGHT_BUS)

export const lighlighClickBus = useEventBus<HTMLElement>(HGIHLIGHT_CLICK_BUS)