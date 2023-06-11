
import { serializeETProps } from "../../lib/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivity } from "./TActivity";


@GReloadable
export class TActivityFirstCharge extends TActivity {

    @serializeETProps()
    public ChargeFirstPrize: IFItemInfo[] = [];

    @serializeETProps()
    public SecondFirstPrize: IFItemInfo[] = [];

    public ActivityComp() { return this.GetParent<CharacterActivityComponent>(); }

}