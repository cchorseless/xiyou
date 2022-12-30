
import { ET } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";



@GReloadable
export class CharacterMailComponent extends ET.Component {
    public MaxSize: number;
    public LastMailId: string;
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
