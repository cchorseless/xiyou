import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";
import { reloadable } from "../../GameCache";

@reloadable
export class TActivityMonthLogin extends TActivity {
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


    private _TotalLoginItems: Dictionary<number, ValueTupleStruct<number, number>> = new Dictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    public get TotalLoginItems() {
        return this._TotalLoginItems;
    }
    public set TotalLoginItems(data: Dictionary<number, ValueTupleStruct<number, number>>) {
        this._TotalLoginItems.copyData((data as any)[0], (data as any)[1]);

    }
}