

import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";

@GReloadable
export class CharacterActivityComponent extends ET.Component {
    private _ActivityData = new GDictionary<
        number,
        string>();

    @serializeETProps()
    public get ActivityData() {
        return this._ActivityData;
    }
    public set ActivityData(data) {
        this._ActivityData.copy(data);
    }
    get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
        GLogHelper.print(character != null, 111);
        if (character != null) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        GLogHelper.print(this.SerializeETProps);
        GLogHelper.print(this.toJsonObject());
        // this.SyncClient();
    }
}
