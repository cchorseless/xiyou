
import { TActivityData } from "./TActivityData";
import { reloadable } from "../../GameCache";

@reloadable
export class TActivityMemberShipData extends TActivityData {
    public VipStartTime: string;
    public VipEndTime: string;
}