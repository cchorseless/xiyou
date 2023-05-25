import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 驻扎转换
@registerAbility()
export class courier_hut_change extends BaseAbility_Plus {
    CastFilterResultTarget(target: IBaseNpc_Plus) {
        // if (target.ETRoot == null || !target.ETRoot.AsValid<IBuildingEntityRoot>("BuildingEntityRoot")) {
        //     this.errorStr = "dota_hud_error_only_can_cast_on_building";
        //     return UnitFilterResult.UF_FAIL_CUSTOM;
        // }
        let caster = this.GetCasterPlus();
        if (caster.GetPlayerID() != target.GetPlayerID()) {
            return UnitFilterResult.UF_FAIL_NOT_PLAYER_CONTROLLED;
        }
        if (target.HasModifier("modifier_building")) {
            if (IsServer()) {
                let playerid = caster.GetPlayerID()
                let playerroot = GPlayerEntityRoot.GetOneInstance(playerid);
                if (!playerroot.RoundManagerComp().getCurrentBoardRound().IsRoundStart()) {
                    this.errorStr = "only use in round start";
                    return UnitFilterResult.UF_FAIL_CUSTOM;
                }
                if (!GChessControlSystem.GetInstance().IsInBoard8x10(playerid, target.GetAbsOrigin())) {
                    this.errorStr = "only use in battle arua";
                    return UnitFilterResult.UF_FAIL_CUSTOM;
                }
                return UnitFilterResult.UF_SUCCESS
            }
        }
        else {
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
    }

    ProcsMagicStick() {
        return false;
    }

    OnSpellStart(): void {
        let target = this.GetCursorTarget() as IBaseNpc_Plus;
        let buff = modifier_courier_hut_change.findIn(target)
        if (IsValid(buff)) {
            buff.Destroy()
        }
        else {
            modifier_courier_hut_change.applyOnly(target, target, this)
        }
    }

}


@registerModifier()
export class modifier_courier_hut_change extends BaseModifier_Plus {

    towerBase: CBaseModelEntity;
    buff: modifier_courier_hut_change_debuff;
    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.towerBase = SpawnEntityFromTableSynchronous("prop_dynamic", {
                model: "models/props_structures/tower_upgrade/tower_upgrade_base.vmdl",
            }) as CBaseModelEntity;
            this.towerBase.SetAbsOrigin(this.GetParent().GetAbsOrigin());
            // 驻扎在通道的Debuff
            let parent = this.GetParentPlus();
            let playerroot = parent.GetPlayerRoot();
            if (playerroot.CourierRoot().CourierEggComp().IsInPath(parent.GetAbsOrigin())) {
                this.buff = modifier_courier_hut_change_debuff.applyOnly(parent, parent, this.GetAbilityPlus());
                (parent.ETRoot as IBuildingEntityRoot).BuffManagerComp().addRuntimeCloneBuff(modifier_courier_hut_change_debuff.name);
            }
        }
    }

    public BeDestroy(): void {
        if (IsServer()) {
            if (IsValid(this.towerBase)) {
                this.towerBase.Destroy();
            }
            this.towerBase == null;
            if (IsValid(this.buff)) {
                this.buff.Destroy();
            }
            this.buff = null;
        }
    }
}


@registerModifier()
export class modifier_courier_hut_change_debuff extends BaseModifier_Plus {

    public IsDebuff(): boolean {
        return true
    }
    public IsHidden(): boolean {
        return false
    }

    public IsPurgable(): boolean {
        return false
    }

    public Init(params?: IModifierTable): void {
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_ATTACKSPEED_BONUS_CONSTANT() {
        return -50
    }
}