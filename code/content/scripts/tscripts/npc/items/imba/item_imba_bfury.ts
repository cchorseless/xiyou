
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";



// 狂战斧
@registerAbility()
export class item_imba_bfury extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_bfury_passive";
    }

}
@registerModifier()
export class modifier_item_imba_bfury_passive extends BaseModifier_Plus {


    public Init(params?: IModifierTable): void {
        this.bonus_damage = this.GetSpecialValueFor("bonus_damage");
        this.mana_regen = this.GetSpecialValueFor("bonus_mana_regen");
        this.hp_regen = this.GetSpecialValueFor("bonus_health_regen");
        // this.cleave_damage_percent = this.GetSpecialValueFor("cleave_damage_percent");


    }



    // BattleFuryHit(keys) {
    //     let caster = keys.caster;
    //     let target = keys.target;
    //     let damage = keys.damage;
    //     let ability = keys.ability;
    //     let ability_level = ability.GetLevel() - 1;
    //     let modifier_cleave = keys.modifier_cleave;
    //     let particle_cleave = keys.particle_cleave;
    //     if (target.IsBuilding()) {
    //         return;
    //     }
    //     let cleave_damage = ability.GetLevelSpecialValueFor("ranged_cleave_damage", ability_level);
    //     let quelling_bonus = ability.GetLevelSpecialValueFor("quelling_bonus", ability_level);
    //     let cleave_radius = ability.GetLevelSpecialValueFor("cleave_radius", ability_level);
    //     let target_loc = target.GetAbsOrigin();
    //     if (!caster.IsRangedAttacker() || caster.HasModifier("modifier_imba_berserkers_rage")) {
    //         cleave_damage = ability.GetLevelSpecialValueFor("melee_cleave_damage", ability_level);
    //     }
    //     let cleave_stacks = caster.findBuffStack(modifier_cleave, caster);
    //     cleave_damage = cleave_damage * cleave_stacks;
    //     quelling_bonus = quelling_bonus * cleave_stacks;
    //     if (!(target.IsRealUnit() || target.IsBuilding() || target.IsRoshan())) {
    //         ApplyDamage({
    //             attacker: caster,
    //             victim: target,
    //             ability: ability,
    //             damage: damage * quelling_bonus * 0.01,
    //             damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
    //         });
    //     }
    //     damage = damage * cleave_damage * 0.01;
    //     let cleave_pfx = ResHelper.CreateParticleEx(particle_cleave, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
    //     ParticleManager.SetParticleControl(cleave_pfx, 0, target_loc);
    //     let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_loc, undefined, cleave_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
    //     for (const [_, enemy] of GameFunc.iPair(enemies)) {
    //         if (enemy != target && !enemy.IsAttackImmune()) {
    //             ApplyDamage({
    //                 attacker: caster,
    //                 victim: enemy,
    //                 ability: ability,
    //                 damage: damage,
    //                 damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
    //             });
    //         }
    //     }
    // }



    bonus_damage: number;
    mana_regen: number;
    hp_regen: number;

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierBonusStats_Agility(): number {
        return this.hp_regen;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(params: ModifierAttackEvent): void { }
}











