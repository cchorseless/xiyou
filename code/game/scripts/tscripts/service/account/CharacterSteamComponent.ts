import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class CharacterSteamComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }

}
