
import { ET } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";


@GReloadable
export class CharacterTitleComponent extends ET.Component {
    public DressTitleConfigId: number;

    private _Titles = new GDictionary<number, string>();
    public get Titles() {
        return this._Titles;
    }
    public set Titles(data) {
        this._Titles.copy(data);
    }

    public get Character(): TCharacter {
        return this.GetParent<TCharacter>();
    }
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
