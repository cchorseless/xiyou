import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityMentorshipTree extends TActivity {
    public MentorshipTree: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();

    public set _MentorshipTree(data: Dictionary<string, string>) {
        this.MentorshipTree.copy(data);
    }

}