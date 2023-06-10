

import { serializeETProps } from "../../lib/Entity";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityMonthLoginData extends TActivityData {


    @serializeETProps()
    public ItemHadGet: number[] = [];
    @serializeETProps()
    public TotalLoginItemHadGet: number[] = [];

    @serializeETProps()
    public LoginDayCount: number;

    @serializeETProps()
    public MonthIndex: number;
}