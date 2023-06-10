
import { serializeETProps } from "../../lib/Entity";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivityDailyOnlinePrize extends TActivity {
    private _Items = new GDictionary<
        number,
        IFItemInfo
    >();
    @serializeETProps()
    public get Items() {
        return this._Items;
    }
    public set Items(data: any) {
        this._Items.copy(data);

    }



}