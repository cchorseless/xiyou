import Dictionary from "../../helper/DataContainerHelper";

import { TActivityData } from "./TActivityData";
import { reloadable } from "../../GameCache";

@reloadable
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
        this._MentorshipPrize.copyData((data as any)[0], (data as any)[1]);

    }
}