import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { ValueTupleStruct } from "../common/ValueTupleStruct";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityMonthLogin extends TActivity {
    public Items: Dictionary<number, ValueTupleStruct<number, number>> = new Dictionary<
        number,
        ValueTupleStruct<number, number>
    >();

    public set _Items(data: Dictionary<number, ValueTupleStruct<number, number>>) {
        this.Items.copy(data);
    }


    public TotalLoginItems: Dictionary<number, ValueTupleStruct<number, number>> = new Dictionary<
        number,
        ValueTupleStruct<number, number>
    >();

    public set _TotalLoginItems(data: Dictionary<number, ValueTupleStruct<number, number>>) {
        this.TotalLoginItems.copy(data);
    }
}