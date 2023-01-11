import { ET } from "../../lib/Entity";
import { HeroTalentComponent } from "./HeroTalentComponent";


@GReloadable
export class THeroTalentItem extends ET.Entity {


    public ConfigId: number;
    public CostTalentPoint: number;
    public TalentBuff: number[];

    public get HeroTalentComp(): HeroTalentComponent { return this.GetParent<HeroTalentComponent>(); }
}