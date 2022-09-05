import { registerET } from "../../../libs/Entity";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityMemberShipData extends TActivityData {
    public VipStartTime: string;
    public VipEndTime: string;
}