
import { serializeETProps } from "../../lib/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityInvestMetaStoneData extends TActivityData {
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

    public get ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}