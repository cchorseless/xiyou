import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";


@GReloadable
export class BagComponent extends ET.Component {
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

    @serializeETProps()
    public Items: string[];
    public MaxSize: number;
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }

}
