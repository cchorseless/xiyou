

import { serializeETProps } from "../../lib/Entity";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityTotalOnlineTimeData extends TActivityData {

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

    @serializeETProps()
    public LastLoginTotalOnlineTime: number;

}