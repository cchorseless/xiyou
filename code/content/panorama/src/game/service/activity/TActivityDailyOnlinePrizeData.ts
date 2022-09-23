import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityDailyOnlinePrizeData extends TActivityData {
    public ItemState: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();

    public set _ItemState(data: Dictionary<number, number>) {
        this.ItemState.copy(data);
    }

    public get ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}