import { ET, registerET } from "../../../libs/Entity";
import { TActivityMentorshipTreeData } from "./TActivityMentorshipTreeData";

@registerET()
export class TActivityMentorshipApplyForItem extends ET.Entity {
    public ConfigId: number;
    public Progress: number;
    public IsAchieve: boolean;
    public IsPrizeGet: boolean;
    public PrizeGet: string[];

    public get MemberShipData() { return this.GetParent<TActivityMentorshipTreeData>(); }

}