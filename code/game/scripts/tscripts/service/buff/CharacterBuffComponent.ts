import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterBuffComponent extends ET.Component {
    private _Buffs: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get Buffs() {
        return this._Buffs;
    }
    public set Buffs(data: Dictionary<number, string>) {
        this._Buffs.clear();
        for (let _d of data as any) {
            this._Buffs.add(_d[0], _d[1]);
        }
    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }
}
