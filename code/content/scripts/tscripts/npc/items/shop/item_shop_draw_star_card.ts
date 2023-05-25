import { KVHelper } from "../../../helper/KVHelper";
import { DrawConfig } from "../../../shared/DrawConfig";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootItemWithCharge } from "../ActiveRootItem";

// 初级抽卡券
@registerAbility()
export class item_shop_draw_card_v1 extends ActiveRootItemWithCharge {

    OnSpellStart(): void {
        let hParent = this.GetCasterPlus();
        let playerroot = hParent.GetPlayerRoot();
        if (playerroot) {
            playerroot.DrawComp().DrawCard(DrawConfig.EDrawType.DrawCardV1, 4);
            this.CostOneCharge();
        }
    }
}

// 中级抽卡券
@registerAbility()
export class item_shop_draw_card_v2 extends ActiveRootItemWithCharge {
    OnSpellStart(): void {
        let hParent = this.GetCasterPlus();
        let playerroot = hParent.GetPlayerRoot();
        if (playerroot) {
            playerroot.DrawComp().DrawCard(DrawConfig.EDrawType.DrawCardV2, 4);
            this.CostOneCharge();
        }
    }
}

// 高级抽卡券
@registerAbility()
export class item_shop_draw_card_v3 extends ActiveRootItemWithCharge {
    OnSpellStart(): void {
        let hParent = this.GetCasterPlus();
        let playerroot = hParent.GetPlayerRoot();
        if (playerroot) {
            playerroot.DrawComp().DrawCard(DrawConfig.EDrawType.DrawCardV3, 4);
            this.CostOneCharge();
        }
    }
}

// 绿色升星卡
@registerAbility()
export class item_shop_addstar_green extends ActiveRootItemWithCharge {

    CastFilterResultTarget(target: CDOTA_BaseNPC) {
        if (IsServer()) {
            let battleroot = target.ETRoot as IBattleUnitEntityRoot;
            if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding()) {
                if (battleroot.checkCanStarUp()) {
                    if (KVHelper.GetUnitData(target.GetUnitName(), "Rarity") == "C") {
                        return UnitFilterResult.UF_SUCCESS
                    }
                    else {
                        this.errorStr = "只能对绿色棋子使用"
                    }
                }
                else {
                    this.errorStr = "棋子已满星"
                }
            }
            else {
                this.errorStr = "只能对棋子使用"
            }
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_SUCCESS
    }

    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return this.errorStr;
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            battleroot.AddStar(1);
            this.CostOneCharge();
        }
    }
}

// 蓝色升星卡
@registerAbility()
export class item_shop_addstar_blue extends ActiveRootItemWithCharge {
    CastFilterResultTarget(target: CDOTA_BaseNPC) {
        if (IsServer()) {
            let battleroot = target.ETRoot as IBattleUnitEntityRoot;
            if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding()) {
                if (battleroot.checkCanStarUp()) {
                    if (KVHelper.GetUnitData(target.GetUnitName(), "Rarity") == "B") {
                        return UnitFilterResult.UF_SUCCESS
                    }
                    else {
                        this.errorStr = "只能对蓝色棋子使用"
                    }
                }
                else {
                    this.errorStr = "棋子已满星"
                }
            }
            else {
                this.errorStr = "只能对棋子使用"
            }
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_SUCCESS
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return this.errorStr;
    }

    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            battleroot.AddStar(1);
            this.CostOneCharge();
        }
    }
}

// 紫色升星卡
@registerAbility()
export class item_shop_addstar_purple extends ActiveRootItemWithCharge {
    CastFilterResultTarget(target: CDOTA_BaseNPC) {
        if (IsServer()) {
            let battleroot = target.ETRoot as IBattleUnitEntityRoot;
            if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding()) {
                if (battleroot.checkCanStarUp()) {
                    if (KVHelper.GetUnitData(target.GetUnitName(), "Rarity") == "A") {
                        return UnitFilterResult.UF_SUCCESS
                    }
                    else {
                        this.errorStr = "只能对紫色棋子使用"
                    }
                }
                else {
                    this.errorStr = "棋子已满星"
                }
            }
            else {
                this.errorStr = "只能对棋子使用"
            }
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_SUCCESS
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return this.errorStr;
    }

    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            battleroot.AddStar(1);
            this.CostOneCharge();
        }
    }
}
// 橙色升星卡
@registerAbility()
export class item_shop_addstar_gold extends ActiveRootItemWithCharge {
    CastFilterResultTarget(target: CDOTA_BaseNPC) {
        if (IsServer()) {
            let battleroot = target.ETRoot as IBattleUnitEntityRoot;
            if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding()) {
                if (battleroot.checkCanStarUp()) {
                    if (KVHelper.GetUnitData(target.GetUnitName(), "Rarity") == "S") {
                        return UnitFilterResult.UF_SUCCESS
                    }
                    else {
                        this.errorStr = "只能对橙色棋子使用"
                    }
                }
                else {
                    this.errorStr = "棋子已满星"
                }
            }
            else {
                this.errorStr = "只能对棋子使用"
            }
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        return UnitFilterResult.UF_SUCCESS
    }

    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return this.errorStr;
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        let battleroot = target.ETRoot as IBuildingEntityRoot;
        if (battleroot && battleroot.IsBuilding && battleroot.IsBuilding() && battleroot.checkCanStarUp()) {
            battleroot.AddStar(1);
            this.CostOneCharge();
        }
    }
}


// 随机紫色卡
@registerAbility()
export class item_shop_random_card_purple extends ActiveRootItemWithCharge {
    OnSpellStart(): void {
        let hParent = this.GetCasterPlus();
        let playerroot = hParent.GetPlayerRoot();
        if (playerroot) {
            let poolconfigid = this.GetSpecialValueFor("poolconfigid")
            playerroot.DrawComp().SpeDrawCard(poolconfigid, 4);
            this.CostOneCharge();
        }
    }
}
// 随机橙色卡
@registerAbility()
export class item_shop_random_card_gold extends ActiveRootItemWithCharge {
    OnSpellStart(): void {
        let hParent = this.GetCasterPlus();
        let playerroot = hParent.GetPlayerRoot();
        if (playerroot) {
            let poolconfigid = this.GetSpecialValueFor("poolconfigid")
            playerroot.DrawComp().SpeDrawCard(poolconfigid, 4);
            this.CostOneCharge();
        }
    }
}
