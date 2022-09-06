import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityInvestMetaStoneData extends TActivityData {
    @serializeETProps()
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

    public get ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}