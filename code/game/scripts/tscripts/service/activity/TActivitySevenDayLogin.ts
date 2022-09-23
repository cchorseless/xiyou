import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";

@registerET()
export class TActivitySevenDayLogin extends TActivity {
    private _Items: Dictionary<number, ValueTupleStruct<number, number>> = new Dictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    public get Items() {
        return this._Items;
    }
    public set Items(data: Dictionary<number, ValueTupleStruct<number, number>>) {
        this._Items.copyData((data as any)[0], (data as any)[1]);

    }

}