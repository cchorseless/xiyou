
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";


@GReloadable
export class CharacterTitleComponent extends ET.Component {
    @serializeETProps()
    public DressTitleConfigId: number;

    private _Titles = new GDictionary<number, string>();
    @serializeETProps()
    public get Titles() {
        return this._Titles;
    }
    public set Titles(data) {
        this._Titles.copy(data);
    }

    public get Character(): TCharacter {
        return this.GetParent<TCharacter>();
    }
    onGetBelongPlayerid() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
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
