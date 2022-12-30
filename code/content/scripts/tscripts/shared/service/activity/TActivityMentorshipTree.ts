
import { ET, serializeETProps } from "../../lib/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivityMentorshipTree extends TActivity {
    @serializeETProps()
    private _MentorshipTree: IGDictionary<string, string> = new GDictionary<
        string,
        string
    >();
    public get MentorshipTree() {
        return this._MentorshipTree;
    }
    public set MentorshipTree(data: IGDictionary<string, string>) {
        this._MentorshipTree.copy(data);

    }

}