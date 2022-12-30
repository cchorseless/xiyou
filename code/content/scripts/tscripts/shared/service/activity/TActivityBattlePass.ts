
import { ET, serializeETProps } from "../../lib/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivityBattlePass extends TActivity {
    private _Items = new GDictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    @serializeETProps()
    public get Items() {
        return this._Items;
    }
    public set Items(data: any) {
        this._Items.copy(data);

    }


    private _VipItems = new GDictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    @serializeETProps()
    public get VipItems() {
        return this._VipItems;
    }
    public set VipItems(data: any) {
        this._VipItems.copy(data);

    }
}