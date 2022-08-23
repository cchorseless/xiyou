import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityGiftCommond extends TActivity {
    private _Gifts: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();
    public get Gifts() {
        return this._Gifts;
    }
    public set Gifts(data: Dictionary<number, number>) {
        this._Gifts.clear();
        for (let _d of data as any) {
            this._Gifts.add(_d[0], _d[1]);
        }
    }

    public get ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}