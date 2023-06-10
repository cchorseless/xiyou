import { ET, serializeETProps } from "../../lib/Entity";
import { TActivityMentorshipTreeData } from "./TActivityMentorshipTreeData";


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

    public get MentorshipTreeData() { return this.GetParent<TActivityMentorshipTreeData>(); }

}