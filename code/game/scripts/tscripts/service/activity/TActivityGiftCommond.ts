import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityGiftCommond extends TActivity {
    @serializeETProps()
    private _Gifts: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();
    public get Gifts() {
        return this._Gifts;
    }
    public set Gifts(data: Dictionary<number, number>) {
        this._Gifts.copyData((data as any)[0], (data as any)[1]);

    }

    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}