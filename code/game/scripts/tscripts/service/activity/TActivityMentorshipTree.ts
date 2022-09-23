import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityMentorshipTree extends TActivity {
    @serializeETProps()
    private _MentorshipTree: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();
    public get MentorshipTree() {
        return this._MentorshipTree;
    }
    public set MentorshipTree(data: Dictionary<string, string>) {
        this._MentorshipTree.copyData((data as any)[0], (data as any)[1]);

    }

}