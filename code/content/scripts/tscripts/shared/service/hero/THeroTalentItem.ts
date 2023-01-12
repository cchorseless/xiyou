import { ET, serializeETProps } from "../../lib/Entity";
import { HeroTalentComponent } from "./HeroTalentComponent";


@GReloadable
export class THeroTalentItem extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public CostTalentPoint: number;
    @serializeETProps()
    public TalentBuff: number[];

    public get HeroTalentComp(): HeroTalentComponent { return this.GetParent<HeroTalentComponent>(); }
}