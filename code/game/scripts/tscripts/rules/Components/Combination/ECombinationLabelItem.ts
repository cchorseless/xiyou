import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";

@registerET()
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
        let condition = entity.config().CombinationCondition
        if (condition && condition.length > 0) {
            this.IsActive = false;
        }
    }

    addSelfToManager() {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        if (this.IsActive && building.ChessComp().isInBattle()) {
            building.GetPlayer().CombinationManager().addCombination(this);
        }
    }

    public getSourceEntity() {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        switch (this.SourceType) {
            case "Item":
                return building.ItemManagerComp().getItemRoot(this.SourceEntityId);
            case "Ability":
                return building.AbilityManagerComp().getAbilityRoot(this.SourceEntityId);
        }
    }

    onDestroy(): void {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        building.GetPlayer().CombinationManager().removeCombination(this);
    }

}
