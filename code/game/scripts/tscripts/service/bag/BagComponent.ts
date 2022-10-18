import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { ET, serializeETProps } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { reloadable } from "../../GameCache";

@reloadable
export class BagComponent extends ET.Component {
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

    @serializeETProps()
    public Items: string[];
    public MaxSize: number;
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }

}
