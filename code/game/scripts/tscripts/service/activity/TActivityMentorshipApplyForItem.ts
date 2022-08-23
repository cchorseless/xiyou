import { ET, registerET } from "../../rules/Entity/Entity";
import { TActivityMemberShipData } from "./TActivityMemberShipData";

@registerET()
export class TActivityMentorshipPrizeItem extends ET.Entity {
    public ConfigId: number;
    public Progress: number;
    public IsAchieve: boolean;
    public IsPrizeGet: boolean;
    public PrizeGet: string[];

    public get MemberShipData() { return this.GetParent<TActivityMemberShipData>(); }

}