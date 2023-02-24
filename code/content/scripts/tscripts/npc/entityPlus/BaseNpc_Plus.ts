
import { GameFunc } from "../../GameFunc";
import { ResHelper } from "../../helper/ResHelper";
import { BaseItem_Plus } from "./BaseItem_Plus";
import { BaseNpc } from "./Base_Plus";
/**普通NPC单位基类 */
export class BaseNpc_Plus extends BaseNpc {

    EmitCasterSound?(tSoundNames: string[], fChancePct: number, flags: number, fCooldown: number = 0, sCooldownindex: string = "") {
        flags = flags || 0;
        if (fCooldown > 0 && sCooldownindex) {
            // if (this[sCooldownindex]) {
            //     return true;
            // } else {
            //     this[sCooldownindex] = true;
            //    GTimerHelper.AddTimer(fCooldown, GHandler.create(this, ()=> {
            //         this[sCooldownindex] = undefined;
            //     }));
            // }
        }
        if (fChancePct) {
            if (fChancePct <= math.random(1, 100)) {
                return false;
            }
        }
        if ((bit.band(flags, ResHelper.EDOTA_CAST_SOUND.FLAG_WHILE_DEAD) > 0) || this.IsAlive()) {
            let sound = GameFunc.ArrayFunc.RandomArray(tSoundNames)[0];
            if (bit.band(flags, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS) > 0) {
                this.EmitSound(sound);
            } else {
                StartSoundEventReliable(sound, this);
            }
        }
        return true;
    }



    TrueKilled?(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus) {
        if (caster.HasModifier("modifier_item_blade_mail_reflect")) {
            this.RemoveModifierByName("modifier_imba_purification_passive");
        }
        let nothlProtection = this.FindModifierByName("modifier_imba_dazzle_nothl_protection");
        if (nothlProtection && nothlProtection.GetStackCount() < 1) {
            nothlProtection.SetStackCount(1);
            nothlProtection.StartIntervalThink(1);
        }
        if (!(this.HasModifier("modifier_imba_reincarnation") || this.HasModifier("modifier_imba_reincarnation_wraith_form_buff") || this.HasModifier("modifier_imba_reincarnation_wraith_form"))) {
            this.Kill(ability, caster);
        }
        if (this.HasAbility("imba_huskar_berserkers_blood") && this.FindAbilityByName("imba_huskar_berserkers_blood").IsCooldownReady()) {
            this.FindAbilityByName("imba_huskar_berserkers_blood").StartCooldown(FrameTime());
        }
        this.RemoveModifierByName("modifier_invulnerable");
        this.RemoveModifierByName("modifier_imba_dazzle_shallow_grave");
        this.RemoveModifierByName("modifier_imba_aphotic_shield_buff_block");
        this.RemoveModifierByName("modifier_imba_spiked_carapace");
        this.RemoveModifierByName("modifier_borrowed_time");
        this.RemoveModifierByName("modifier_imba_centaur_return");
        this.RemoveModifierByName("modifier_item_greatwyrm_plate_unique");
        this.RemoveModifierByName("modifier_item_greatwyrm_plate_active");
        this.RemoveModifierByName("modifier_item_crimson_guard_unique");
        this.RemoveModifierByName("modifier_item_crimson_guard_active");
        this.RemoveModifierByName("modifier_item_vanguard_unique");
        this.RemoveModifierByName("modifier_item_imba_initiate_robe_stacks");
        this.RemoveModifierByName("modifier_imba_cheese_death_prevention");
        this.RemoveModifierByName("modifier_imba_rapier_cursed");
        this.RemoveModifierByName("modifier_imba_dazzle_nothl_protection_aura_talent");
        this.RemoveModifierByName("modifier_imba_battle_trance_720");
        this.RemoveModifierByName("modifier_imba_huskar_berserkers_blood_crimson_priest");
        if (!this.HasModifier("modifier_imba_reincarnation_wraith_form")) {
            this.Kill(ability, caster);
        }
    }

    GetPlayerID?() {
        return this.GetPlayerOwnerID();
    }
    SetUnitOnClearGround?() {
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            let pos = this.GetAbsOrigin();
            this.SetAbsOrigin(Vector(pos.x, pos.y, GetGroundPosition(pos, this).z));
            FindClearSpaceForUnit(this, this.GetAbsOrigin(), true);
            ResolveNPCPositions(this.GetAbsOrigin(), 64);
        }));
    }

    GetSource?() {
        if (this.IsSummoned() || this.IsClone() || this.IsIllusion()) {
            return GameFunc.IsValid(this.GetSummoner()) && this.GetSummoner() || this;
        }
        return this
    }
    /**
     *
     * @returns todo
     */
    GetSummoner?() {
        return this
    }
    /**
      * 创建幻象
      * @param vLocation
      * @param bFindClearSpace
      * @param hNPCOwner
      * @param hUnitOwner
      * @param iTeamNumber
      * @param fDuration
      * @param fOutgoingDamage
      * @param fIncomingDamage
      * @returns
      */
    CreateIllusion?(vLocation: Vector,
        bFindClearSpace: boolean,
        hNPCOwner: IBaseNpc_Plus,
        hUnitOwner: IBaseNpc_Plus,
        iTeamNumber: DOTATeam_t,
        fDuration: number,
        fOutgoingDamage: number,
        fIncomingDamage: number) {
        let illusion = BaseNpc_Plus.CreateUnitByName(this.GetUnitName(), vLocation, iTeamNumber, bFindClearSpace, hNPCOwner, hUnitOwner) as IBaseNpc_Plus;
        illusion.MakeIllusion()
        illusion.SetForwardVector(this.GetForwardVector())
        if (hUnitOwner != null) {
            illusion.SetControllableByPlayer(hUnitOwner.GetPlayerOwnerID(), !bFindClearSpace)
        }
        let iLevel = this.GetLevel();
        illusion.SetBaseDamageMin(this.GetBaseDamageMin())
        illusion.SetBaseDamageMax(this.GetBaseDamageMax())
        illusion.SetAttackCapability(this.GetAttackCapability())
        illusion.SetRangedProjectileName(this.GetRangedProjectileName())
        illusion.SetModel(this.GetModelName())
        illusion.SetOriginalModel(this.GetModelName())
        illusion.SetModelScale(this.GetModelScale());
        // buff
        let modifiers = this.FindAllModifiers() as IBaseModifier_Plus[];
        for (let modifier of (modifiers)) {
            if (modifier.AllowIllusionDuplicate && modifier.AllowIllusionDuplicate()) {
                let buff = illusion.addBuff(modifier.GetName(), modifier.GetCasterPlus(), modifier.GetAbilityPlus())
                buff.SetStackCount(modifier.GetStackCount())
            }
        }
        for (let i = 0; i <= this.GetAbilityCount() - 1; i++) {
            let ability = this.GetAbilityByIndex(i)
            if (ability != null) {
                let illusion_ability = illusion.FindAbilityByName(ability.GetAbilityName())
                if (illusion_ability == null) {
                    illusion_ability = illusion.addAbilityPlus(ability.GetAbilityName())
                }
                if (illusion_ability != null) {
                    if (illusion_ability.GetLevel() < ability.GetLevel()) {
                        while (illusion_ability.GetLevel() < ability.GetLevel()) {
                            illusion_ability.UpgradeAbility(true)
                        }
                    }
                    else if (illusion_ability.GetLevel() >= ability.GetLevel()) {
                        illusion_ability.SetLevel(ability.GetLevel())
                        if (illusion_ability.GetLevel() == 0) {
                            if (illusion_ability.GetAutoCastState()) {
                                illusion_ability.ToggleAutoCast()
                            }
                            if (illusion_ability.GetToggleState()) {
                                illusion_ability.ToggleAbility()
                            }
                            illusion.RemoveModifierByName(illusion_ability.GetIntrinsicModifierName() || "")
                        }
                    }
                }
            }
        }
        for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i++) {
            let item = illusion.GetItemInSlot(i)
            if (item != null) {
                UTIL_Remove(item)
            }
        }
        for (let i = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; i <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; i++) {
            let item = this.GetItemInSlot(i)
            if (item != null) {
                let illusion_item = BaseItem_Plus.CreateItem(item.GetName(), illusion as any, illusion as any)
                if (GameFunc.IsValid(illusion_item)) {
                    illusion_item.EndCooldown()
                    illusion_item.SetPurchaser(null)
                    illusion_item.SetShareability(EShareAbility.ITEM_FULLY_SHAREABLE)
                    illusion_item.SetPurchaseTime(item.GetPurchaseTime())
                    illusion_item.SetCurrentCharges(item.GetCurrentCharges())
                    illusion_item.SetItemState(item.GetItemState())
                    if (illusion_item.GetToggleState() != item.GetToggleState()) {
                        illusion_item.ToggleAbility()
                    }
                    if (illusion_item.GetAutoCastState() != item.GetAutoCastState()) {
                        illusion_item.ToggleAutoCast()
                    }
                    illusion.AddItem(illusion_item)
                    for (let j = DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_1; j <= DOTAScriptInventorySlot_t.DOTA_ITEM_SLOT_9; j++) {
                        let _item = illusion.GetItemInSlot(j)
                        if (_item == illusion_item) {
                            if (i != j) {
                                illusion.SwapItems(i, j)
                            }
                            break
                        }
                    }
                }
            }
        }
        illusion.addBuff("modifier_illusion", hUnitOwner, null, { duration: fDuration, outgoing_damage: fOutgoingDamage, incoming_damage: fIncomingDamage })
        illusion.SetHealth(this.GetHealth())
        illusion.SetMana(this.GetMana())
        let particleID = ParticleManager.CreateParticle("particles/generic_gameplay/illusion_created.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, illusion)
        ParticleManager.ReleaseParticleIndex(particleID)
        return illusion
    }
}
declare global {
    type IBaseNpc_Plus = BaseNpc_Plus;
}



