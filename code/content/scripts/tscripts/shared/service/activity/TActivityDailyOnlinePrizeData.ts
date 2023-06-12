
import { serializeETProps } from "../../lib/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityDailyOnlinePrizeData extends TActivityData {

    @serializeETProps()
    public ItemHadGet: number[] = []

    @serializeETProps()
    LoginTimeSpan: string;

    @serializeETProps()
    TodayOnlineTime: string;
    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}