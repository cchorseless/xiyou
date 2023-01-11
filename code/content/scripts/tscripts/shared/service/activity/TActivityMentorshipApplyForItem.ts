import { ET } from "../../lib/Entity";
import { TActivityMemberShipData } from "./TActivityMemberShipData";


@GReloadable
export class TActivityMentorshipApplyForItem extends ET.Entity {


    public ConfigId: number;
    public Progress: number;
    public IsAchieve: boolean;
    public IsPrizeGet: boolean;
    public PrizeGet: string[];

    public get MemberShipData() { return this.GetParent<TActivityMemberShipData>(); }

}