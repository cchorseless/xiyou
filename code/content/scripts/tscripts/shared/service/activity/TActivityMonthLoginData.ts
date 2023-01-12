

import { serializeETProps } from "../../lib/Entity";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityMonthLoginData extends TActivityData {

    private _ItemState: IGDictionary<number, number> = new GDictionary<
        number,
        number
    >();
    @serializeETProps()
    public get ItemState() {
        return this._ItemState;
    }
    public set ItemState(data: IGDictionary<number, number>) {
        this._ItemState.copy(data);

    }

    private _TotalLoginItemState: IGDictionary<number, number> = new GDictionary<
        number,
        number
    >();
    public get TotalLoginItemState() {
        return this._TotalLoginItemState;
    }
    public set TotalLoginItemState(data: IGDictionary<number, number>) {
        this._TotalLoginItemState.copy(data);

    }
}