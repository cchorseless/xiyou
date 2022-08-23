import Dictionary from "../../helper/DataContainerHelper";
import { registerET } from "../../rules/Entity/Entity";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityMentorshipTreeData extends TActivityData {
    public MasterId: string;
    public Apprentice: string[];
    public ApplyMasterRecord: string[];

    private _MentorshipPrize: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get MentorshipPrize() {
        return this._MentorshipPrize;
    }
    public set MentorshipPrize(data: Dictionary<number, string>) {
        this._MentorshipPrize.clear();
        for (let _d of data as any) {
            this._MentorshipPrize.add(_d[0], _d[1]);
        }
    }
}