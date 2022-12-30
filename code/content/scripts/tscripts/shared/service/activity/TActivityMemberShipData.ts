
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityMemberShipData extends TActivityData {
    public VipStartTime: string;
    public VipEndTime: string;

    onReload() {
        this.SyncClient();
    }
}