
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityMemberShipData extends TActivityData {
    public VipStartTime: string;
    public VipEndTime: string;
    onSerializeToEntity() {
        this.onReload()
    }

    onReload() {
        this.SyncClient(true, true);
    }

    IsVip() {
        const now = GTimerHelper.Now();
        return Number(this.VipStartTime) <= now && Number(this.VipEndTime) >= now;
    }

    IsVipForever() {
        const now = GTimerHelper.Now();
        return Number(this.VipStartTime) <= now && Number(this.VipEndTime) >= now;
    }
}

declare global {
    var GTActivityMemberShipData: typeof TActivityMemberShipData;
}
if (_G.GTActivityMemberShipData == null) {
    _G.GTActivityMemberShipData = TActivityMemberShipData;
}