
import { ET } from "../../lib/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivityMonthLogin extends TActivity {
    private _Items: IGDictionary<number, ValueTupleStruct<number, number>> = new GDictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    public get Items() {
        return this._Items;
    }
    public set Items(data: IGDictionary<number, ValueTupleStruct<number, number>>) {
        this._Items.copy(data);

    }


    private _TotalLoginItems: IGDictionary<number, ValueTupleStruct<number, number>> = new GDictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    public get TotalLoginItems() {
        return this._TotalLoginItems;
    }
    public set TotalLoginItems(data: IGDictionary<number, ValueTupleStruct<number, number>>) {
        this._TotalLoginItems.copy(data);

    }
}