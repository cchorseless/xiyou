

import { serializeETProps } from "../../lib/Entity";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityTotalGainMetaStoneData extends TActivityData {

    @serializeETProps()
    public ItemHadGet: number[] = []
    @serializeETProps()
    public TotalChargeMoney: number = 0;
    @serializeETProps()
    public SeasonConfigId: number;


}