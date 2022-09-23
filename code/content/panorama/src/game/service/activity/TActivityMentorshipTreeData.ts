import Dictionary from "../../../helper/DataContainerHelper";
import { registerET } from "../../../libs/Entity";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityMentorshipTreeData extends TActivityData {
    public MasterId: string;
    public Apprentice: string[];
    public ApplyMasterRecord: string[];

    public MentorshipPrize: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _MentorshipPrize(data: Dictionary<number, string>) {
        this.MentorshipPrize.copy(data);

    }
}