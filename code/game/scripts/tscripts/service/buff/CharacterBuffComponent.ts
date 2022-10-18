import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { reloadable } from "../../GameCache";

@reloadable
export class CharacterBuffComponent extends ET.Component {
    private _Buffs: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get Buffs() {
        return this._Buffs;
    }
    public set Buffs(data: Dictionary<number, string>) {
        this._Buffs.copyData((data as any)[0], (data as any)[1]);

    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }
}
