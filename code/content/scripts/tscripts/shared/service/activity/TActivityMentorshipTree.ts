
import { serializeETProps } from "../../lib/Entity";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivityMentorshipTree extends TActivity {
    private _MentorshipTree: IGDictionary<string, string> = new GDictionary<
        string,
        string
    >();
    @serializeETProps()
    public get MentorshipTree() {
        return this._MentorshipTree;
    }
    public set MentorshipTree(data: IGDictionary<string, string>) {
        this._MentorshipTree.copy(data);

    }

}