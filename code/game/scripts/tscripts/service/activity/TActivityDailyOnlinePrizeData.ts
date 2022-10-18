import Dictionary from "../../helper/DataContainerHelper";
import { ET, serializeETProps } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";
import { reloadable } from "../../GameCache";

@reloadable
export class TActivityDailyOnlinePrizeData extends TActivityData {
    @serializeETProps()
    private _ItemState: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();
    public get ItemState() {
        return this._ItemState;
    }
    public set ItemState(data: Dictionary<number, number>) {
        this._ItemState.copyData((data as any)[0], (data as any)[1]);

    }

    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}