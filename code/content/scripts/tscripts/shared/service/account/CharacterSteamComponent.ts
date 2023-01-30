
import { ET, ETEntitySystem } from "../../lib/Entity";


@GReloadable
export class CharacterSteamComponent extends ET.Component {
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
