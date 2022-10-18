import Dictionary from "../../../helper/DataContainerHelper";
import { registerET } from "../../../libs/Entity";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityTotalSpendMetaStoneData extends TActivityData {

    public ItemState: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();

    public set _ItemState(data: Dictionary<number, number>) {
        this.ItemState.copy(data);
    }

    public TotalSpendMetaStone: number;

}