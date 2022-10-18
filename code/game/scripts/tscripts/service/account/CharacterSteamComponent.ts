import { reloadable } from "../../GameCache";
import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { ET } from "../../rules/Entity/Entity";

@reloadable
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
