
import { ET } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";


@GReloadable
export class CharacterBuffComponent extends ET.Component {
    private _Buffs = new GDictionary<
        number,
        string
    >();
    public get Buffs() {
        return this._Buffs;
    }
    public set Buffs(data) {
        this._Buffs.copy(data);

    }
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
