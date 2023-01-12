
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";



@GReloadable
export class CharacterMailComponent extends ET.Component {
    @serializeETProps()
    public MaxSize: number;
    @serializeETProps()
    public LastMailId: string;
    @serializeETProps()
    public Mails: string[];

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.SyncClient();
    }
}
