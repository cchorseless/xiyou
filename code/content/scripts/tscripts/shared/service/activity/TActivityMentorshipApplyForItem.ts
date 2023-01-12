import { ET, serializeETProps } from "../../lib/Entity";
import { TActivityMemberShipData } from "./TActivityMemberShipData";


@GReloadable
export class TActivityMentorshipApplyForItem extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public Progress: number;
    @serializeETProps()
    public IsAchieve: boolean;
    @serializeETProps()
    public IsPrizeGet: boolean;
    @serializeETProps()
    public PrizeGet: string[];

    public get MemberShipData() { return this.GetParent<TActivityMemberShipData>(); }

}