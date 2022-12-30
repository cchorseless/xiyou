
import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityGiftCommondData extends TActivityData {
    private _GiftCommonds = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get GiftCommonds() {
        return this._GiftCommonds;
    }
    public set GiftCommonds(data) {
        this._GiftCommonds.copy(data);

    }

    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}