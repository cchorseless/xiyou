import Dictionary from "../../helper/DataContainerHelper";
import { ET, serializeETProps } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";
import { reloadable } from "../../GameCache";

@reloadable
export class TActivityGiftCommondData extends TActivityData {
    @serializeETProps()
    private _GiftCommonds: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get GiftCommonds() {
        return this._GiftCommonds;
    }
    public set GiftCommonds(data: Dictionary<number, string>) {
        this._GiftCommonds.copyData((data as any)[0], (data as any)[1]);

    }

    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}