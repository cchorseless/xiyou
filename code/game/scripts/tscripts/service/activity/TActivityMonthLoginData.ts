import Dictionary from "../../helper/DataContainerHelper";

import { TActivityData } from "./TActivityData";
import { reloadable } from "../../GameCache";

@reloadable
export class TActivityMonthLoginData extends TActivityData {

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

    private _TotalLoginItemState: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();
    public get TotalLoginItemState() {
        return this._TotalLoginItemState;
    }
    public set TotalLoginItemState(data: Dictionary<number, number>) {
        this._TotalLoginItemState.copyData((data as any)[0], (data as any)[1]);

    }
}