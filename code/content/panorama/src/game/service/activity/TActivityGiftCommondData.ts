import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityGiftCommondData extends TActivityData {
    public GiftCommonds: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _GiftCommonds(data: Dictionary<number, string>) {
        this.GiftCommonds.copy(data);
    }

    public get ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}