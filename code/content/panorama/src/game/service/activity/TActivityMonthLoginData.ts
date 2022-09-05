import Dictionary from "../../../helper/DataContainerHelper";
import { registerET } from "../../../libs/Entity";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityMonthLoginData extends TActivityData {

    private _ItemState: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();
    public get ItemState() {
        return this._ItemState;
    }
    public set ItemState(data: Dictionary<number, number>) {
        this._ItemState.clear();
        for (let _d of data as any) {
            this._ItemState.add(_d[0], _d[1]);
        }
    }

    private _TotalLoginItemState: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();
    public get TotalLoginItemState() {
        return this._TotalLoginItemState;
    }
    public set TotalLoginItemState(data: Dictionary<number, number>) {
        this._TotalLoginItemState.clear();
        for (let _d of data as any) {
            this._TotalLoginItemState.add(_d[0], _d[1]);
        }
    }
}