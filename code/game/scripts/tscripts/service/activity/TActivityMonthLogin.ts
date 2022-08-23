import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityMonthLogin extends TActivity {
    private _Items: Dictionary<number, ValueTupleStruct<number, number>> = new Dictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    public get Items() {
        return this._Items;
    }
    public set Items(data: Dictionary<number, ValueTupleStruct<number, number>>) {
        this._Items.clear();
        for (let _d of data as any) {
            this._Items.add(_d[0], _d[1]);
        }
    }


    private _TotalLoginItems: Dictionary<number, ValueTupleStruct<number, number>> = new Dictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    public get TotalLoginItems() {
        return this._TotalLoginItems;
    }
    public set TotalLoginItems(data: Dictionary<number, ValueTupleStruct<number, number>>) {
        this._TotalLoginItems.clear();
        for (let _d of data as any) {
            this._TotalLoginItems.add(_d[0], _d[1]);
        }
    }
}