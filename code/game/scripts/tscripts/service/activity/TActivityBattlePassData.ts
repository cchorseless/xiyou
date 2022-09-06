import { ET, registerET } from "../../rules/Entity/Entity";
import { CharacterActivityComponent } from "./CharacterActivityComponent";
import { TActivityData } from "./TActivityData";

@registerET()
export class TActivityBattlePassData extends TActivityData {
    public Level: string;
    public IsVip: boolean;
    public ItemGetRecord: number[];
    public VipItemGetRecord: number[];

    public CharacterActivity() { return this.GetParent<CharacterActivityComponent>(); }

}