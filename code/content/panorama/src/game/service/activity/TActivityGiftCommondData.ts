import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityGiftCommondData extends TActivityData {
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

    public get ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}