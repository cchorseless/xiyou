

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

    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
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
