

import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityTotalOnlineTimeData extends TActivityData {

    private _ItemState: IGDictionary<number, number> = new GDictionary<
        number,
        number
    >();
    public get ItemState() {
        return this._ItemState;
    }
    public set ItemState(data: IGDictionary<number, number>) {
        this._ItemState.copy(data);

    }

    public LastLoginTotalOnlineTime: number;

}