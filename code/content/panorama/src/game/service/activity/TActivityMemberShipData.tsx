import { TimerHelper } from "../../../helper/TimerHelper";
import { registerET } from "../../../libs/Entity";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityMemberShipData extends TActivityData {
    public VipStartTime: string;
    public VipEndTime: string;

    public IsVip() {
        let curTime = TimerHelper.Now()
        return Number(this.VipEndTime) > curTime && curTime >= Number(this.VipStartTime);
    }
}