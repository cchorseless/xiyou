

import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityMentorshipTreeData extends TActivityData {
    public MasterId: string;
    public Apprentice: string[];
    public ApplyMasterRecord: string[];

    private _MentorshipPrize = new GDictionary<
        number,
        string
    >();
    public get MentorshipPrize() {
        return this._MentorshipPrize;
    }
    public set MentorshipPrize(data) {
        this._MentorshipPrize.copy(data);

    }
}