import { serializeETProps } from "../../lib/Entity";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityBattlePassData extends TActivityData {
    @serializeETProps()
    public Level: string;
    @serializeETProps()
    public IsVip: boolean;
    @serializeETProps()
    public ItemGetRecord: number[];
    @serializeETProps()
    public VipItemGetRecord: number[];
}