
import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivityGiftCommond extends TActivity {
    private _Gifts = new GDictionary<
        number,
        number
    >();
    @serializeETProps()
    public get Gifts() {
        return this._Gifts;
    }
    public set Gifts(data: IGDictionary<number, number>) {
        this._Gifts.copy(data);

    }

    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}