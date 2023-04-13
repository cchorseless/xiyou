
import { ET } from "../../../shared/lib/Entity";
import { HeroEquipComponent } from "../../../shared/service/equip/HeroEquipComponent";

@GReloadable
export class ECombinationLabelItem extends ET.Entity {
    public IsActive: boolean = false;
    public SectName: string = "";
    public SourceEntityConfigId: string = "";
    public SourceEntityId: string = "";
    public SourceType: string = "";

    onAwake(SourceType: string, SourceEntityId: string, SectName: string) {
        this.SourceType = SourceType;
        this.SourceEntityId = SourceEntityId;
        this.SectName = SectName;
        this.SourceEntityConfigId = this.getSourceEntity().ConfigID;
        this.checkActive();

    }
    checkActive() {
        if (this.IsActive) { return }
        let equipid = GJsonConfigHelper.GetAbilitySectUnlockEquipid(this.SourceEntityConfigId)
        // 解锁装备检查
        if (equipid > 0) {
            let unitroot = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
            this.IsActive = unitroot.checkCanStarUp() == false || HeroEquipComponent.CheckPlayerIsScepter(this.BelongPlayerid, equipid);
        }
        else {
            this.IsActive = true;
        }
        if (this.IsActive) {
            this.addSelfToManager();
        }
    }

    private addSelfToManager() {
        let unitroot = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        if (this.IsActive && unitroot.ChessComp().isInBattle) {
            if (unitroot.IsBuilding()) {
                unitroot.GetPlayer().CombinationManager().addCombination(this);
            }
            else if (unitroot.IsEnemy()) {
                unitroot.GetPlayer().FakerHeroRoot().FHeroCombinationManager().addCombination(this);
            }
        }
    }

    public getSourceEntity() {
        let unitroot = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        switch (this.SourceType) {
            case "Item":
                return unitroot.InventoryComp().getItemRoot(this.SourceEntityId);
            case "Ability":
                return unitroot.AbilityManagerComp().getAbilityRoot(this.SourceEntityId);
        }
    }

    onDestroy(): void {
        let unitroot = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        if (unitroot.IsBuilding()) {
            unitroot.GetPlayer().CombinationManager().removeCombination(this);
        }
    }

}
