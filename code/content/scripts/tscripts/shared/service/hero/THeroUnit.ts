import { ET, serializeETProps } from "../../lib/Entity";
import { HeroEquipComponent } from "../equip/HeroEquipComponent";
import { HeroTalentComponent } from "./HeroTalentComponent";



@GReloadable
export class THeroUnit extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public Level: number = 1;
    @serializeETProps()
    public Exp: number = 0;
    @serializeETProps()
    public TotalExp: number = 0;
    @serializeETProps()
    public BattleScore: number;

    public get HeroTalentComp(): HeroTalentComponent {
        return HeroTalentComponent.GetOneInstanceById(this.Id)
    }
    public get HeroEquipComp(): HeroEquipComponent {
        return HeroEquipComponent.GetOneInstanceById(this.Id)
    }

    onSerializeToEntity() {
        this.onReload();
    }
    onReload() {
        this.SyncClient();
    }



    public BindHeroName() {
        return GJsonConfigHelper.GetHeroName(this.ConfigId);
    }
}
