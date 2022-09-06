import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";

@registerET()
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
        this._GiftCommonds.clear();
        for (let _d of data as any) {
            this._GiftCommonds.add(_d[0], _d[1]);
        }
    }

    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}