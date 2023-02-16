
import { ET } from "../../../shared/lib/Entity";

@GReloadable
export class ECombinationLabelItem extends ET.Entity {
    public IsActive: boolean = true;
    public CombinationName: string = "";
    public SourceEntityConfigId: string = "";
    public SourceEntityId: string = "";
    public SourceType: string = "";

    onAwake(SourceType: string, SourceEntityId: string, CombinationName: string) {
        this.SourceType = SourceType;
        this.SourceEntityId = SourceEntityId;
        this.CombinationName = CombinationName;
        this.SourceEntityConfigId = this.getSourceEntity().ConfigID;
        this.checkActive();
        this.addSelfToManager();
    }
    // todo 套装检查
    checkActive() {
        let entity = this.getSourceEntity()
        let CombinationCondition = entity.config().CombinationCondition;
        let condition = GToNumber(CombinationCondition);
        // 11标记的是大招，需要套装检查
        if (condition == 11) {
            this.IsActive = false;
        }
    }

    addSelfToManager() {
        let building = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBuildingEntityRoot>();
        if (this.IsActive && building.ChessComp().isInBattle) {
            building.GetPlayer().CombinationManager().addCombination(this);
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
