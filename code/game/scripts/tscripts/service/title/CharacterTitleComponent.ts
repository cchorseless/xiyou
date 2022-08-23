import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterTitleComponent extends ET.Component {
    public DressTitleConfigId: number;

    private _Titles: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get Titles() {
        return this._Titles;
    }
    public set Titles(data: Dictionary<number, string>) {
        this._Titles.clear();
        for (let _d of data as any) {
            this._Titles.add(_d[0], _d[1]);
        }
    }

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
    }
}