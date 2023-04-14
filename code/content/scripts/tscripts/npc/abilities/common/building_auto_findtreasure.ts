import { AoiHelper } from "../../../helper/AoiHelper";
import { BuildingRuntimeEntityRoot } from "../../../rules/Components/Building/BuildingRuntimeEntityRoot";
import { RoundPrizeUnitEntityRoot } from "../../../rules/Components/Round/RoundPrizeUnitEntityRoot";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_remnant } from "../../modifier/battle/modifier_remnant";
import { modifier_tp } from "../../modifier/modifier_tp";

// 自动寻宝
@registerAbility()
export class building_auto_findtreasure extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NOT_LEARNABLE;
    }
    public IsAutoCast: boolean = true;
    GetCooldown(iLevel: number) {
        return 1;
    }
    StartFindTreasure() {
        let owner = this.GetOwnerPlus();
        modifier_auto_findtreasure.applyOnly(owner, owner, this);
    }

    IsFinding() {
        let hParent = this.GetOwnerPlus();
        return modifier_auto_findtreasure.exist(hParent);
    }

    GoBackBoard() {
        let hParent = this.GetOwnerPlus();
        let modifier = modifier_auto_findtreasure.findIn(hParent);
        modifier.StopFindTreasure();
        let building = hParent.ETRoot.As<BuildingRuntimeEntityRoot>();
        let boardV = building.ChessComp().ChessVector;
        let t_p = GChessControlSystem.GetInstance().GetBoardGirdCenterVector3(boardV);
        modifier_tp.TeleportToPoint(hParent, null, GetGroundPosition(t_p, hParent));
        modifier_remnant.remove(hParent);
        modifier.Destroy();
        GTimerHelper.AddTimer(1.1, GHandler.create(this,
            () => {
                building.OnBackBoardFromBaseRoom();
            })
        );
    }
}

@registerModifier()
export class modifier_auto_findtreasure extends BaseModifier_Plus {
    IsHidden() {
        return false;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }

    // CheckState() {
    //     let state = {
    //         [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
    //         [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
    //         [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
    //         [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
    //     };
    //     return state;
    // }
    public Init(params: IModifierTable) {
        if (IsServer() && params.IsOnCreated) {
            this.SetStackCount(3);
            GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
                this.CheckIntervalThink()
                return 0.1;
            }));
        }
    }

    CheckIntervalThink() {
        let hParent = this.GetParentPlus();
        let hAbility = this.GetAbilityPlus();
        if (IsValid(hParent)) {
            if (IsValid(hAbility) && hAbility.IsCooldownReady()) {
                if (hAbility.GetAutoCastState()) {
                    this.AutoFindTreasure();
                } else {
                    this.StopFindTreasure();
                }
            }
        }
    }
    isWorking: boolean = false;
    findTimer: ITimerTask;
    attackTarget: RoundPrizeUnitEntityRoot;
    AutoFindTreasure() {
        if (this.isWorking) {
            return;
        }
        this.isWorking = true;
        if (this.findTimer != null) {
            this.findTimer.Clear()
            this.findTimer == null;
        }
        let hParent = this.GetParentPlus();
        let ability = this.GetAbilityPlus() as building_auto_findtreasure;
        let building = hParent.ETRoot.As<BuildingRuntimeEntityRoot>();
        let playerid = building.BelongPlayerid;
        let moveto = GMapSystem.GetInstance().PlayerTpDoorPoint[playerid];
        this.findTimer = GTimerHelper.AddTimer(0.5, GHandler.create(this,
            () => {
                if (building.ChessComp().isInBoard()) {
                    if (GFuncVector.AsVector(moveto - hParent.GetAbsOrigin()).Length2D() > 60) {
                        hParent.MoveToPosition(moveto);
                    }
                } else if (building.ChessComp().isInBaseRoom()) {
                    if (this.attackTarget != null && !this.attackTarget.IsDisposed()) {
                    }
                    else {
                        let targetnpc = this.FindOneTarget();
                        this.attackTarget = targetnpc;
                        if (targetnpc == null) {
                            ability.GoBackBoard();
                            return;
                        } else {
                            GFuncEntity.ExecuteOrder(hParent, dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET, targetnpc.GetDomain<IBaseNpc_Plus>(), null);
                        }
                    }
                }
                return 3;
            }));
    }
    FindOneTarget() {
        let hParent = this.GetParentPlus();
        let targets = AoiHelper.FindEntityInRadius(DOTATeam_t.DOTA_TEAM_BADGUYS, hParent.GetAbsOrigin(), 1000, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY);
        targets = targets.filter((e) => {
            return e.ETRoot && e.ETRoot.AsValid<RoundPrizeUnitEntityRoot>("RoundPrizeUnitEntityRoot");
        });
        let targetnpc: RoundPrizeUnitEntityRoot = null;
        if (targets.length == 0) {
            let prizeUnits = GRoundSystem.GetInstance().randomRoundPrizeUnit();
            if (prizeUnits.length == 0) {
                return;
            } else {
                targetnpc = prizeUnits[0];
            }
        } else {
            targetnpc = GFuncRandom.RandomArray(targets)[0].ETRoot.As<RoundPrizeUnitEntityRoot>();
        }
        return targetnpc;
    }
    FinishOneTarget() {
        let count = this.GetStackCount();
        if (count > 1) {
            this.DecrementStackCount();
        } else {
            let ability = this.GetAbilityPlus() as building_auto_findtreasure;
            ability.GoBackBoard();
        }
    }

    StopFindTreasure() {
        if (!this.isWorking) {
            return;
        }
        this.isWorking = false;
        if (this.findTimer != null) {
            this.findTimer.Clear()
            this.findTimer == null;
        }
        let hParent = this.GetParentPlus();
        hParent.Hold();
    }
}
