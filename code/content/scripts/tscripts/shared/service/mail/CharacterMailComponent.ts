
import { ET, ETEntitySystem, serializeETProps } from "../../lib/Entity";
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
    onGetBelongPlayerid() {
        let character = ETEntitySystem.GetEntity(this.Id + "TCharacter");
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
