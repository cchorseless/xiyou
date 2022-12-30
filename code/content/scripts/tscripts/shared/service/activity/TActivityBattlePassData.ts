import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityBattlePassData extends TActivityData {
    public Level: string;
    public IsVip: boolean;
    public ItemGetRecord: number[];
    public VipItemGetRecord: number[];
}