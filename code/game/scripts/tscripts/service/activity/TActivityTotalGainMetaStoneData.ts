import Dictionary from "../../helper/DataContainerHelper";
import { registerET } from "../../rules/Entity/Entity";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityTotalGainMetaStoneData extends TActivityData {

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

    public TotalGainMetaStone: number;

}