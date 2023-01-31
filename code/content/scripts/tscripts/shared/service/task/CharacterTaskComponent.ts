
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";


@GReloadable
export class CharacterTaskComponent extends ET.Component {
    @serializeETProps()
    public DailyTasks: string[];
    @serializeETProps()
    public WeekTasks: string[];
    @serializeETProps()
    public SeasonTasks: string[];
    @serializeETProps()
    public IsReplaceDailyTask: boolean;

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
        if (character != null) {
            return character.BelongPlayerid;
        }
        return -1;
    }
    onSerializeToEntity() {
        GTCharacter.GetOneInstance(this.BelongPlayerid).AddOneComponent(this);
        this.onReload();
    }
    onReload() {
        this.SyncClient();
    }
}
