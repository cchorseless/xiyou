
import { serializeETProps } from "../../lib/Entity";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivityInvestMetaStone extends TActivity {


    private _Items = new GDictionary<
        number,
        IFItemInfo
    >();
    @serializeETProps()
    public get Items() {
        return this._Items;
    }
    public set Items(data: IGDictionary<number, IFItemInfo>) {
        this._Items.copy(data);

    }

}