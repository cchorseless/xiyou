import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterBattlePassComponent } from "./CharacterBattlePassComponent";


@GReloadable
export class TBattlePassTaskItem extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public Progress: number;
    @serializeETProps()
    public IsAchieve: boolean;
    @serializeETProps()
    public IsPrizeGet: boolean;

    public get BattlePassComp(): CharacterBattlePassComponent { return this.GetParent<CharacterBattlePassComponent>(); }



}