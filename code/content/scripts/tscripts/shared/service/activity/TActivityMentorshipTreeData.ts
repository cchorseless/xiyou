

import { serializeETProps } from "../../lib/Entity";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityMentorshipTreeData extends TActivityData {
    @serializeETProps()
    public MasterId: string;
    @serializeETProps()
    public Apprentice: string[];
    @serializeETProps()
    public ApplyMasterRecord: string[];

    private _MentorshipPrize = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get MentorshipPrize() {
        return this._MentorshipPrize;
    }
    public set MentorshipPrize(data) {
        this._MentorshipPrize.copy(data);

    }
}