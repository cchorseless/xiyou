
import { ET } from "../../lib/Entity";


@GReloadable
export class CharacterSteamComponent extends ET.Component {
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
