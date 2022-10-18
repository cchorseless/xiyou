import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivity } from "./TActivity";

@registerET()
export class TActivityGiftCommond extends TActivity {
    public Gifts: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();

    public set _Gifts(data: Dictionary<number, number>) {
        this.Gifts.copy(data);
    }

    public get ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}