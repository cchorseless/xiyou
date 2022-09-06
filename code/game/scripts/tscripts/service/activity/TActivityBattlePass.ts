import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityBattlePass extends TActivity {
    @serializeETProps()
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


    @serializeETProps()
    private _VipItems: Dictionary<number, ValueTupleStruct<number, number>> = new Dictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    public get VipItems() {
        return this._VipItems;
    }
    public set VipItems(data: Dictionary<number, ValueTupleStruct<number, number>>) {
        this._VipItems.clear();
        for (let _d of data as any) {
            this._VipItems.add(_d[0], _d[1]);
        }
    }
}