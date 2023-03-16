
import { GameFunc } from "../../../GameFunc";
import { AnimationHelper } from "../../../helper/AnimationHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_diretide_candy extends BaseItem_Plus {
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let modifier_candy = caster.findBuff<modifier_diretide_candy_hp_loss>("modifier_diretide_candy_hp_loss");
            if (target.GetUnitName() == "npc_dota_good_candy_pumpkin") {
                if (caster.GetTeamNumber() == 3) {
                    return;
                }
                let allHeroes =caster.GetPlayerRoot().BuildingManager().getAllBattleUnitAliveNpc();
                for (const [_, hero] of GameFunc.iPair(allHeroes)) {
                    // hero.AddExperience(75, false, false);
                    // hero.ModifyGold(50, true, 0);
                }
                AnimationHelper.StartAnimation(target, {
                    duration: 1.0,
                    activity: GameActivity_t.ACT_DOTA_ATTACK,
                    rate: 1.0
                });
                // CustomNetTables.SetTableValue("game_options", "radiant", {
                //     score: CustomNetTables.GetTableValue("game_options", "radiant").score + 1
                // });
            } else if (target.GetUnitName() == "npc_dota_bad_candy_pumpkin") {
                if (caster.GetTeamNumber() == 2) {
                    return;
                }
                for (const [_, hero] of GameFunc.iPair(HeroList.GetAllHeroes())) {
                    // hero.AddExperience(75, false, false);
                    hero.ModifyGold(50, true, 0);
                }
                AnimationHelper.StartAnimation(target, {
                    duration: 1.0,
                    activity: GameActivity_t.ACT_DOTA_ATTACK,
                    rate: 1.0
                });
                // CustomNetTables.SetTableValue("game_options", "dire", {
                //     score: CustomNetTables.GetTableValue("game_options", "dire").score + 1
                // });
            } else if (target.GetUnitLabel() == "npc_diretide_roshan") {
                let AImod = target.findBuff("modifier_imba_roshan_ai_diretide");
                if (AImod) {
                    // AImod.Candy(target);
                }
            } else if (target.IsRealUnit()) {
                return;
            } else {
                // print("NIL target, do nothing.");
                return;
            }
            let info = {
                Target: target,
                Source: caster,
                Ability: this,
                EffectName: "particles/hw_fx/hw_candy_drop.vpcf",
                bDodgeable: false,
                bProvidesVision: true,
                bVisibleToEnemies: true,
                bReplaceExisting: false,
                iMoveSpeed: this.GetSpecialValueFor("projectile_speed"),
                iVisionRadius: 0,
                iVisionTeamNumber: caster.GetTeamNumber()
            }
            ProjectileManager.CreateTrackingProjectile(info);
            this.SetCurrentCharges(this.GetCurrentCharges() - 1);
            if (this.GetCurrentCharges() <= 0) {
                this.RemoveSelf();
            }
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_diretide_candy_hp_loss";
    }
}
@registerModifier()
export class modifier_diretide_candy_hp_loss extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseItem_Plus;
    public hp_loss_pct: number;
    GetTexture(): string {
        return "modifiers/greevil_taffy";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetItemPlus();
            this.hp_loss_pct = this.ability.GetSpecialValueFor("hp_loss_pct");
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (this.ability) {
            let charges = this.ability.GetCurrentCharges();
            this.SetStackCount(charges);
        }
        // this.caster.CalculateStatBonus(true);
        if (!this.caster.TempData().OverHeadJingu) {
            this.caster.TempData().OverHeadJingu = ResHelper.CreateParticleEx("particles/hw_fx/candy_carrying_overhead.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.caster);
            ParticleManager.SetParticleControl(this.caster.TempData().OverHeadJingu, 0, this.caster.GetAbsOrigin());
        }
        if (this.GetStackCount() < 10) {
            ParticleManager.SetParticleControl(this.caster.TempData().OverHeadJingu, 2, Vector(0, this.GetStackCount(), 0));
        } else if (this.GetStackCount() >= 10 && this.GetStackCount() < 20) {
            ParticleManager.SetParticleControl(this.caster.TempData().OverHeadJingu, 2, Vector(1, this.GetStackCount() - 10, 0));
        } else if (this.GetStackCount() >= 20 && this.GetStackCount() < 30) {
            ParticleManager.SetParticleControl(this.caster.TempData().OverHeadJingu, 2, Vector(2, this.GetStackCount() - 20, 0));
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.EXTRA_HEALTH_PERCENTAGE)
    CC_GetModifierExtraHealthPercentage(): number {
        if (IsServer()) {
            let hp_to_reduce = this.hp_loss_pct / 100 * this.GetStackCount() * (-1);
            if (hp_to_reduce < -0.99) {
                return -0.99;
            }
            return hp_to_reduce;
        }
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (IsServer()) {
            if (target.GetUnitName() !== "npc_dota_good_candy_pumpkin" || target.GetUnitName() !== "npc_dota_bad_candy_pumpkin") {
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            print("Wrong Target!");
            return UnitFilterResult.UF_SUCCESS;
        }
    }
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        if (IsServer()) {
            print("Wrong target message..");
            return "#dota_hud_error_cast_only_pumpkin";
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.GetCasterPlus().TempData().OverHeadJingu, false);
        ParticleManager.ReleaseParticleIndex(this.GetCasterPlus().TempData().OverHeadJingu);
        this.GetCasterPlus().TempData().OverHeadJingu = undefined;
    }
}
