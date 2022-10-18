import { ET } from "../../rules/Entity/Entity";
import { HeroTalentComponent } from "./HeroTalentComponent";
import { reloadable } from "../../GameCache";

@reloadable
export class THeroTalentItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public CostTalentPoint: number;
    public TalentBuff: number[];

    public get HeroTalentComp(): HeroTalentComponent { return this.GetParent<HeroTalentComponent>(); }
}