

import { serializeETProps } from "../../lib/Entity";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivitySevenDayLoginData extends TActivityData {


    @serializeETProps()
    public ItemHadGet: number[] = [];

    @serializeETProps()
    public LoginDayCount: number;

    @serializeETProps()
    public SeasonConfigId: number;

}