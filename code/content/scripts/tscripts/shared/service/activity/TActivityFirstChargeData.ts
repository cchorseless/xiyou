
import { serializeETProps } from "../../lib/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";


@GReloadable
export class TActivityFirstChargeData extends TActivityData {

    @serializeETProps()
    public ChargeTime = 0;

    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}