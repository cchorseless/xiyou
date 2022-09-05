import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityMentorshipTree extends TActivity {
    private _MentorshipTree: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();
    public get MentorshipTree() {
        return this._MentorshipTree;
    }
    public set MentorshipTree(data: Dictionary<string, string>) {
        this._MentorshipTree.clear();
        for (let _d of data as any) {
            this._MentorshipTree.add(_d[0], _d[1]);
        }
    }

}