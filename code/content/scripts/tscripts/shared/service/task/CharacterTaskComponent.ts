
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
    onSerializeToEntity() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.SyncClient();
    }
}
