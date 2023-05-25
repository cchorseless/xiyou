
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { ChessVector } from "../../../rules/Components/ChessControl/ChessVector";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

// 守卫流
@registerAbility()
export class ability_sect_guard extends BaseAbility_Plus {



    OnSpellStart() {
        let caster = this.GetCasterPlus();
        if (caster.HasCiTiao(this.GetSectCiTiaoName("a"))) {
            this.summonTauntWard();
        }
        if (caster.HasCiTiao(this.GetSectCiTiaoName("b"))) {
            this.summonHealingWard();
        }
        if (caster.HasCiTiao(this.GetSectCiTiaoName("c"))) {
            this.summonFountainWard();
        }
    }

    summonTauntWard() {
        let caster = this.GetCasterPlus();
        let targetPoint = GChessControlSystem.GetInstance().GetBoardGirdVector3(new ChessVector(3.5, 7.5, caster.GetPlayerID()))
        let healguard = caster.CreateSummon("npc_sect_guard_taunt_guard", targetPoint, 60, true);
        modifier_sect_guard_taunt_ward_passive.applyOnly(healguard, this.GetCasterPlus(), this);
    }

    summonHealingWard() {
        let caster = this.GetCasterPlus();
        let targetPoint = GChessControlSystem.GetInstance().GetBoardGirdVector3(new ChessVector(3.5, 5.5, caster.GetPlayerID()))
        caster.EmitSound("Hero_Juggernaut.HealingWard.Cast");
        let healguard = caster.CreateSummon("npc_sect_guard_healing_guard", targetPoint, 60, true);
        modifier_sect_guard_healing_ward_passive.applyOnly(healguard, this.GetCasterPlus(), this);
    }

    summonFountainWard() {
        let caster = this.GetCasterPlus();
        let targetPoint = GChessControlSystem.GetInstance().GetBoardGirdVector3(new ChessVector(3.5, 3.5, caster.GetPlayerID()))
        let healguard = caster.CreateSummon("npc_sect_guard_fountain_guard", targetPoint, 60, true);
        // healguard.SetForwardVector(Vector(0, 1, 0))
        // modifier_sect_guard_healing_ward_passive.applyOnly(healguard, this.GetCasterPlus(), this);
    }
}
@registerModifier()
export class modifier_sect_guard_taunt_ward_passive extends BaseModifier_Plus {
    public BeCreated(params?: IModifierTable): void {
        if (IsServer()) {
            this.AddTimer(3, () => {
                if (IsValid(this) && IsValid(this.GetParentPlus())) {
                    this.TauntCall();
                    return 3
                }

            })
        }
    }

    public TauntCall(): void {
        let caster = this.GetParentPlus();
        let radius = 400;
        caster.EmitSound("Hero_Axe.Berserkers_Call");
        let particle = ResHelper.CreateParticleEx("particles/econ/items/axe/axe_helm_shoutmask/axe_beserkers_call_owner_shoutmask.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster, caster);
        ParticleManager.SetParticleControl(particle, 2, Vector(radius, radius, radius));
        ParticleManager.ReleaseParticleIndex(particle);
        let enemies_in_radius = caster.FindUnitsInRadiusPlus(radius, null, null, null, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES);
        for (const [_, target] of GameFunc.iPair(enemies_in_radius)) {
            if (target.IsCreep()) {
                target.SetForceAttackTarget(caster);
                target.MoveToTargetToAttack(caster);
            } else {
                target.Stop();
                target.Interrupt();
                let newOrder = {
                    UnitIndex: target.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
                    TargetIndex: caster.entindex()
                }
                ExecuteOrderFromTable(newOrder);
            }
            target.AddNewModifier(caster, this.GetAbilityPlus(), "modifier_sect_guard_taunt_ward_enemy_debuff", {
                duration: 3
            });
        }
    }
}

@registerModifier()
export class modifier_sect_guard_taunt_ward_enemy_debuff extends BaseModifier_Plus {
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true
        };
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_beserkers_call.vpcf";
    }

    StatusEffectPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA;
    }

    IsHidden(): boolean {
        return false;
    }

    IsDebuff(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return false;
    }
}

@registerModifier()
export class modifier_sect_guard_healing_ward_passive extends BaseModifier_Plus {
    healing_ward_ambient_pfx: ParticleID;
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let healing_ward_aura_radius = 500
            let eruption_pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_juggernaut/juggernaut_healing_ward_eruption.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, parent, parent);
            ParticleManager.SetParticleControl(eruption_pfx, 0, parent.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(eruption_pfx);
            let res = "particles/econ/items/juggernaut/jugg_fall20_immortal/jugg_fall20_immortal_healing_ward.vpcf"
            this.healing_ward_ambient_pfx = ResHelper.CreateParticleEx(res, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent, parent);
            ParticleManager.SetParticleControl(this.healing_ward_ambient_pfx, 0, parent.GetAbsOrigin() as Vector);
            ParticleManager.SetParticleControl(this.healing_ward_ambient_pfx, 1, Vector(healing_ward_aura_radius, 1, 1));
            ParticleManager.SetParticleControlEnt(this.healing_ward_ambient_pfx, 2, parent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", parent.GetAbsOrigin(), true);
            EmitSoundOn("Hero_Juggernaut.HealingWard.Loop", this.GetParentPlus());
        }
    }

    IsHidden(): boolean {
        return true;
    }
    IsAura(): boolean {
        return true;
    }
    GetModifierAura(): string {
        return "modifier_sect_guard_healing_ward_aura";
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetAuraRadius(): number {
        return 500
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_LOW_ATTACK_PRIORITY]: true
        };
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            3: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(params: ModifierInstanceEvent): void {
        if (params.unit == this.GetParentPlus()) {
            ParticleManager.DestroyParticle(this.healing_ward_ambient_pfx, false);
            StopSoundOn("Hero_Juggernaut.HealingWard.Loop", this.GetParentPlus());
        }
    }

}
@registerModifier()
export class modifier_sect_guard_healing_ward_aura extends BaseModifier_Plus {
    public heal_per_sec: number;
    Init(p_0: any,): void {
        this.heal_per_sec = 1;
    }

    GetEffectName(): string {
        return "particles/units/heroes/hero_juggernaut/juggernaut_ward_heal.vpcf";
    }


    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW;
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE)
    CC_GetModifierHealthRegenPercentage(): number {
        return this.heal_per_sec * 0.01 * this.GetParentPlus().GetMaxHealth();

    }
}