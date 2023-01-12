
import { serializeETProps } from "../../lib/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivitySevenDayLogin extends TActivity {
    private _Items: IGDictionary<number, ValueTupleStruct<number, number>> = new GDictionary<
        number,
        ValueTupleStruct<number, number>
    >();
    @serializeETProps()
    public get Items() {
        return this._Items;
    }
    public set Items(data: IGDictionary<number, ValueTupleStruct<number, number>>) {
        this._Items.copy(data);

    }

}