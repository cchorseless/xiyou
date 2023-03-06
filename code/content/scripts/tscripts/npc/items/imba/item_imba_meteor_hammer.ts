
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_meteor_hammer extends BaseItem_Plus {
    public caster: IBaseNpc_Plus;
    public burn_dps_buildings: any;
    public burn_dps_units: any;
    public burn_duration: number;
    public stun_duration: number;
    public burn_interval: number;
    public land_time: number;
    public impact_radius: number;
    public max_duration: number;
    public impact_damage_buildings: number;
    public impact_damage_units: number;
    public targetFlag: any;
    public particle: any;
    public particle2: any;
    public position: any;
    public particle3: any;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_meteor_hammer";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("impact_radius");
    }
    OnSpellStart(): void {
        this.caster = this.GetCasterPlus();
        this.burn_dps_buildings = this.GetSpecialValueFor("burn_dps_buildings");
        this.burn_dps_units = this.GetSpecialValueFor("burn_dps_units");
        this.burn_duration = this.GetSpecialValueFor("burn_duration");
        this.stun_duration = this.GetSpecialValueFor("stun_duration");
        this.burn_interval = this.GetSpecialValueFor("burn_interval");
        this.land_time = this.GetSpecialValueFor("land_time");
        this.impact_radius = this.GetSpecialValueFor("impact_radius");
        this.max_duration = this.GetSpecialValueFor("max_duration");
        this.impact_damage_buildings = this.GetSpecialValueFor("impact_damage_buildings");
        this.impact_damage_units = this.GetSpecialValueFor("impact_damage_units");
        if (this.GetLevel() >= 4) {
            this.targetFlag = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES;
        } else {
            this.targetFlag = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
        }
        if (!IsServer()) {
            return;
        }
        let position = this.GetCursorPosition();
        this.caster.EmitSound("DOTA_Item.MeteorHammer.Channel");
        AddFOWViewer(this.caster.GetTeam(), position, this.impact_radius, 3.8, false);
        this.particle = ParticleManager.CreateParticleForTeam("particles/items4_fx/meteor_hammer_aoe.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.caster, this.caster.GetTeam());
        ParticleManager.SetParticleControl(this.particle, 0, position);
        ParticleManager.SetParticleControl(this.particle, 1, Vector(this.impact_radius, 1, 1));
        this.particle2 = ResHelper.CreateParticleEx("particles/items4_fx/meteor_hammer_cast.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.caster);
        this.caster.StartGesture(GameActivity_t.ACT_DOTA_GENERIC_CHANNEL_1);
    }
    OnChannelFinish(bInterrupted: boolean): void {
        if (!IsServer()) {
            return;
        }
        this.position = this.GetCursorPosition();
        this.caster.RemoveGesture(GameActivity_t.ACT_DOTA_GENERIC_CHANNEL_1);
        if (bInterrupted) {
            this.caster.StopSound("DOTA_Item.MeteorHammer.Channel");
            ParticleManager.DestroyParticle(this.particle, true);
            ParticleManager.DestroyParticle(this.particle2, true);
        } else {
            this.caster.EmitSound("DOTA_Item.MeteorHammer.Cast");
            this.particle3 = ResHelper.CreateParticleEx("particles/items4_fx/meteor_hammer_spell.vpcf", ParticleAttachment_t.PATTACH_WORLDORIGIN, this.caster);
            ParticleManager.SetParticleControl(this.particle3, 0, this.position + Vector(0, 0, 1000));
            ParticleManager.SetParticleControl(this.particle3, 1, this.position);
            ParticleManager.SetParticleControl(this.particle3, 2, Vector(this.land_time, 0, 0));
            ParticleManager.ReleaseParticleIndex(this.particle3);
            this.AddTimer(this.land_time, () => {
                if (!this.IsNull()) {
                    GridNav.DestroyTreesAroundPoint(this.position, this.impact_radius, true);
                    EmitSoundOnLocationWithCaster(this.position, "DOTA_Item.MeteorHammer.Impact", this.caster);
                    let enemies = FindUnitsInRadius(this.caster.GetTeamNumber(), this.position, undefined, this.impact_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, this.targetFlag, FindOrder.FIND_ANY_ORDER, false);
                    for (const [_, enemy] of GameFunc.iPair(enemies)) {
                        enemy.EmitSound("DOTA_Item.MeteorHammer.Damage");
                        enemy.AddNewModifier(this.caster, this, "modifier_stunned", {
                            duration: this.stun_duration * (1 - enemy.GetStatusResistance())
                        });
                        enemy.AddNewModifier(this.caster, this, "modifier_item_imba_meteor_hammer_burn", {
                            duration: this.burn_duration
                        });
                        let impactDamage = this.impact_damage_units;
                        if (enemy.IsBuilding()) {
                            impactDamage = this.impact_damage_buildings;
                        }
                        let damageTable = {
                            victim: enemy,
                            damage: impactDamage,
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                            attacker: this.caster,
                            ability: this
                        }
                        ApplyDamage(damageTable);
                    }
                }
            });
        }
        ParticleManager.ReleaseParticleIndex(this.particle);
        ParticleManager.ReleaseParticleIndex(this.particle2);
    }
}
@registerModifier()
export class modifier_item_imba_meteor_hammer extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public bonus_strength: number;
    public bonus_intellect: number;
    public bonus_health_regen: number;
    public bonus_mana_regen: number;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        if (this.ability == undefined) {
            return;
        }
        this.bonus_strength = this.ability.GetSpecialValueFor("bonus_strength");
        this.bonus_intellect = this.ability.GetSpecialValueFor("bonus_intellect");
        this.bonus_health_regen = this.ability.GetSpecialValueFor("bonus_health_regen");
        this.bonus_mana_regen = this.ability.GetSpecialValueFor("bonus_mana_regen");
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.bonus_health_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
}
@registerModifier()
export class modifier_item_imba_meteor_hammer_burn extends BaseModifier_Plus {
    public ability: IBaseItem_Plus;
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public burn_dps_buildings: any;
    public burn_dps_units: any;
    public burn_duration: number;
    public stun_duration: number;
    public burn_interval: number;
    public land_time: number;
    public impact_radius: number;
    public max_duration: number;
    public impact_damage_buildings: number;
    public impact_damage_units: number;
    public spell_reduction_pct: number;
    public affectedUnits: any;
    public burn_dps: any;
    public damageTable: ApplyDamageOptions;
    GetEffectName(): string {
        return "particles/items4_fx/meteor_hammer_spell_debuff.vpcf";
    }
    IgnoreTenacity() {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.ability = this.GetItemPlus();
        this.caster = this.GetCasterPlus();
        this.parent = this.GetParentPlus();
        if (this.ability == undefined) {
            return;
        }
        this.burn_dps_buildings = this.ability.GetSpecialValueFor("burn_dps_buildings");
        this.burn_dps_units = this.ability.GetSpecialValueFor("burn_dps_units");
        this.burn_duration = this.ability.GetSpecialValueFor("burn_duration");
        this.stun_duration = this.ability.GetSpecialValueFor("stun_duration");
        this.burn_interval = this.ability.GetSpecialValueFor("burn_interval");
        this.land_time = this.ability.GetSpecialValueFor("land_time");
        this.impact_radius = this.ability.GetSpecialValueFor("impact_radius");
        this.max_duration = this.ability.GetSpecialValueFor("max_duration");
        this.impact_damage_buildings = this.ability.GetSpecialValueFor("impact_damage_buildings");
        this.impact_damage_units = this.ability.GetSpecialValueFor("impact_damage_units");
        this.spell_reduction_pct = this.ability.GetSpecialValueFor("spell_reduction_pct");
        this.affectedUnits = {}
        table.insert(this.affectedUnits, this.parent);
        this.burn_dps = this.burn_dps_units;
        if (this.parent.IsBuilding()) {
            this.burn_dps = this.burn_dps_buildings;
        }
        this.damageTable = {
            victim: this.parent,
            damage: this.burn_dps,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
            attacker: this.caster,
            ability: this.ability
        }
        if (!IsServer()) {
            return;
        }
        this.StartIntervalThink(this.burn_interval);
    }
    OnIntervalThink(): void {
        if (!IsServer()) {
            return;
        }
        ApplyDamage(this.damageTable);
        SendOverheadEventMessage(undefined, DOTA_OVERHEAD_ALERT.OVERHEAD_ALERT_BONUS_SPELL_DAMAGE, this.parent, this.burn_dps, undefined);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {}
        if (this != undefined && this.ability != undefined && !this.ability.IsNull() && this.ability.GetLevel() >= 2) {
            state = {
                [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
            }
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let decFuncs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        }
        return Object.values(decFuncs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this != undefined && this.ability != undefined && !this.ability.IsNull() && this.ability.GetLevel() >= 3) {
            return this.spell_reduction_pct * (-1);
        }
    }
}
