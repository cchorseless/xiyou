
import { Assert_Color } from "../../assert/Assert_Color";
import { ResHelper } from "../../helper/ResHelper";
import { BaseItem_Plus } from "./BaseItem_Plus";
import { BaseNpc } from "./Base_Plus";
/**普通NPC单位基类 */
export class BaseNpc_Plus extends BaseNpc {
    /**
     * 文字气泡弹出
     * @param bubble 
     * @param speech 
     * @param duration 
     * @param unOffsetX 
     * @param unOffsetY 
     */
    AddSpeechBubblePlus?(bubble: number, speech: string, duration: number, unOffsetX: number, unOffsetY: number): void {
        if (!IsValid(this)) return;
        if (!this.IsAlive()) { return; }
        ResHelper.CreateParticleEx("particles/speechbubbles/speech_voice.vpcf",
            ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this, this, 3);
    }

    GetAllCanCastAbility?() {
        let r: IBaseAbility_Plus[] = [];
        if (!IsValid(this) || this.IsIllusion()) {
            return r;
        }
        let len = this.GetAbilityCount();
        for (let ability_id = 0; ability_id < len; ability_id++) {
            let ability = this.GetAbilityByIndex(ability_id) as IBaseAbility_Plus;
            if (IsValid(ability) && ability.IsAbilityReady()) {
                r.push(ability)
            }
        }
        r.sort((a, b) => { return b.GetCooldown(b.GetLevel()) - a.GetCooldown(a.GetLevel()) });
        return r;
    }
    GetAllCanCastItem?() {
        let r: IBaseItem_Plus[] = [];
        if (!IsValid(this) || this.IsIllusion()) {
            return r;
        }
        for (let item_id = 0; item_id <= 5; item_id++) {
            let item_in_caster = this.GetItemInSlot(item_id) as IBaseItem_Plus;
            if (IsValid(item_in_caster) && item_in_caster.IsAbilityReady()) {
                r.push(item_in_caster)
            }
        }
        r.sort((a, b) => { return b.GetCooldown(b.GetLevel()) - a.GetCooldown(a.GetLevel()) });
        return r;
    }



    /**
     * todo
     * @param slot 
     * @returns 
     */
    GetTogglableWearablePlus?(slot: DOTASlotType_t): CBaseFlex | undefined {
        return
    }
    /**
     * @Both
     */
    GetHeroType?(): string {
        if (this.GetKVData("GibType")) {
            return this.GetKVData("GibType");
        } else {
            return "default";
        }
    }
    GetHeroColorPrimary?() {
        let heroname = this.GetUnitName();
        for (let k in Assert_Color.hero_theme) {
            if (heroname.includes(k)) {
                return Assert_Color.hero_theme[k as keyof typeof Assert_Color.hero_theme];
            };
        }

    }
    GetHeroColorSecondary?() {
        let heroname = this.GetUnitName();
        for (let k in Assert_Color.hero_theme_second) {
            if (heroname.includes(k)) {
                return Assert_Color.hero_theme_second[k as keyof typeof Assert_Color.hero_theme_second];
            };
        }
    }
    GetFittingColor?() {
        if (this.FindModifierByName("modifier_item_imba_rapier_cursed")) {
            return Vector(1, 1, 1);
        } else if (this.FindModifierByName("modifier_item_imba_skadi")) {
            return Vector(50, 255, 255);
        } else if (this.IsHero()) {
            let hero_color = this.GetHeroColorPrimary();
            if (hero_color) {
                return hero_color;
            }
            let r = this.GetStrength();
            let g = this.GetAgility();
            let b = this.GetIntellect();
            let highest = math.max(r, math.max(g, b));
            r = math.max(255 - (highest - r) * 20, 0);
            g = math.max(255 - (highest - g) * 20, 0);
            b = math.max(255 - (highest - b) * 20, 0);
            return Vector(r, g, b);
        } else {
            return Vector(253, 144, 63);
        }
    }

    /**
     * todo
     * @returns 
     */
    WillReincarnatePlus?() {
        return true;
    }

    GetIllusionBounty?() {
        return this.GetLevel() * 2;
    }

    IsRoshan?() {
        return false;
    }

    EmitCasterSound?(tSoundNames: string[], fChancePct: number, flags: number, fCooldown: number = 0, sCooldownindex: string = "") {
        flags = flags || 0;
        if (fCooldown > 0 && sCooldownindex) {
            let key = `EmitCasterSound_${sCooldownindex}`;
            if (this.TempData()[key]) {
                return true;
            }
            else {
                this.TempData()[key] = true;
                GTimerHelper.AddTimer(fCooldown, GHandler.create(this, () => {
                    delete this.TempData()[key];
                }));
            }
        }
        if (fChancePct) {
            if (fChancePct <= math.random(1, 100)) {
                return false;
            }
        }
        if ((bit.band(flags, ResHelper.EDOTA_CAST_SOUND.FLAG_WHILE_DEAD) > 0) || this.IsAlive()) {
            let sound = GFuncRandom.RandomArray(tSoundNames)[0];
            if (bit.band(flags, ResHelper.EDOTA_CAST_SOUND.FLAG_BOTH_TEAMS) > 0) {
                this.EmitSound(sound);
            } else {
                StartSoundEventReliable(sound, this);
            }
        }
        return true;
    }


    TrueKilled?(caster: IBaseNpc_Plus, ability: CDOTABaseAbility) {
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
    CreateIllusion?(
        copyunit: IBaseNpc_Plus,
        hModifierKeys: CreateIllusionsModifierKeys & { outgoingPect?: number, incomingPect?: number, duration?: number },
        nNumIllusions: number = 1,
        vLocation: Vector = null,
        bFindClearSpace = true,
    ) {
        let r: IBaseNpc_Plus[] = [];
        if (!IsValid(copyunit) || IsClient()) {
            return r;
        }
        vLocation = vLocation || copyunit.GetAbsOrigin();
        for (let i = 0; i < nNumIllusions; i++) {
            let illusion = BaseNpc_Plus.CreateUnitByName(copyunit.GetUnitName(), vLocation, this, bFindClearSpace) as IBaseNpc_Plus;
            illusion.MakeIllusion()
            // illusion.SetControllableByPlayer(this.GetPlayerID(), !bFindClearSpace)
            illusion.SetForwardVector(copyunit.GetForwardVector())
            illusion.SetBaseDamageMin(copyunit.GetBaseDamageMin())
            illusion.SetBaseDamageMax(copyunit.GetBaseDamageMax())
            illusion.SetAttackCapability(copyunit.GetAttackCapability())
            illusion.SetRangedProjectileName(copyunit.GetRangedProjectileName())
            illusion.SetModel(copyunit.GetModelName())
            illusion.SetOriginalModel(copyunit.GetModelName())
            illusion.SetModelScale(copyunit.GetModelScale());
            // buff
            let modifiers = copyunit.FindAllModifiers() as IBaseModifier_Plus[];
            for (let modifier of (modifiers)) {
                if (modifier.AllowIllusionDuplicate && modifier.AllowIllusionDuplicate()) {
                    let buff = illusion.addBuff(modifier.GetName(), modifier.GetCasterPlus(), modifier.GetAbilityPlus())
                    buff.SetStackCount(modifier.GetStackCount())
                }
            }
            for (let i = 0; i <= copyunit.GetAbilityCount() - 1; i++) {
                let ability = copyunit.GetAbilityByIndex(i)
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
                let item = copyunit.GetItemInSlot(i)
                if (item != null) {
                    let illusion_item = BaseItem_Plus.CreateItem(item.GetAbilityName(), illusion as any, illusion as any)
                    if (IsValid(illusion_item)) {
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
            illusion.addBuff("modifier_illusion", this, null, { duration: hModifierKeys.duration });
            illusion.addBuff("modifier_generic_illusion", this, null, hModifierKeys);
            illusion.SetHealth(copyunit.GetHealth())
            illusion.SetMana(copyunit.GetMana())
            let particleID = ParticleManager.CreateParticle("particles/generic_gameplay/illusion_created.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, illusion)
            ParticleManager.ReleaseParticleIndex(particleID);
            r.push(illusion);
        }
        let BattleUnitManager: IBattleUnitManagerComponent;
        if (this.ETRoot && this.ETRoot.BelongPlayerid >= 0) {
            BattleUnitManager = GGameScene.GetPlayer(this.ETRoot.BelongPlayerid).BattleUnitManagerComp();
        }
        if (BattleUnitManager) {
            r.forEach(unit => {
                BattleUnitManager.RegIllusion(unit);
            })
        }
        return r;
    }

    /**
     * @Server 
     * @param fDuration 
     * @returns 
     */
    SetIllusionDuration?(fDuration: number, iscover = true) {
        if (!IsServer()) { return }
        if (this.IsIllusion()) {
            let hModifier = this.FindModifierByName("modifier_illusion");
            if (hModifier) {
                fDuration = iscover ? fDuration : hModifier.GetRemainingTime() + fDuration;
                hModifier.SetDuration(fDuration, true);
            }
            hModifier = this.FindModifierByName("modifier_generic_illusion");
            if (hModifier) {
                fDuration = iscover ? fDuration : hModifier.GetRemainingTime() + fDuration;
                hModifier.SetDuration(fDuration, true);
            }
        }
    }

    CreateCloneUnit?(vLocation: Vector, fDuration: number) {
        if (!IsServer()) { return };
        let hSummon = BaseNpc_Plus.CreateUnitByName(this.GetUnitName(), vLocation, this, true, this.GetTeam())
        if (fDuration > 0) {
            hSummon.addBuff("modifier_kill", this, null, { duration: fDuration });
        }
        else {
            fDuration = null
        }
        return hSummon as IBaseNpc_Plus;
    }

    /**
     * 创建召唤物
     * @param sUnitName
     * @param hCaster
     * @param vLocation
     * @param fDuration
     * @param bFindClearSpace
     * @param iTeamNumber
     * @returns
     */
    CreateSummon?(sUnitName: string, vLocation: Vector, fDuration: number, bFindClearSpace: boolean = true, iTeamNumber: DOTATeam_t = null) {
        if (!IsServer()) { return };
        iTeamNumber = iTeamNumber || this.GetTeamNumber()
        let hSummon = BaseNpc_Plus.CreateUnitByName(sUnitName, vLocation, this, bFindClearSpace, iTeamNumber)
        if (fDuration > 0) {
            fDuration = GPropertyCalculate.GetSummonDuration(this, fDuration)
            hSummon.addBuff("modifier_kill", this, null, { duration: fDuration });
        }
        else {
            fDuration = null
        }
        hSummon.addBuff("modifier_generic_summon", this, null, { duration: fDuration });
        let BattleUnitManager: IBattleUnitManagerComponent;
        if (this.ETRoot && this.ETRoot.BelongPlayerid >= 0) {
            BattleUnitManager = GGameScene.GetPlayer(this.ETRoot.BelongPlayerid).BattleUnitManagerComp();
        }
        if (BattleUnitManager) {
            BattleUnitManager.RegSummon(hSummon);
        }
        return hSummon as IBaseNpc_Plus;
    }
    /**
     * 
     * @param vLocation 
     * @param fDuration 
     * @param isPerma 
     * @returns 
     */
    CreateDummyUnit?(vLocation: Vector, fDuration: number, isPerma = false) {
        if (!IsServer()) { return };
        let sUnitName = isPerma ? "npc_imba_dummy_unit_perma" : "npc_imba_dummy_unit";
        let iTeamNumber = this.GetTeamNumber()
        let hDummy = BaseNpc_Plus.CreateUnitByName(sUnitName, vLocation, this, false, iTeamNumber)
        hDummy.AddNewModifier(this, null, "modifier_dummy_unit", { duration: fDuration < 0 ? null : fDuration })
        if (fDuration > 0) {
            hDummy.addBuff("modifier_kill", this, null, { duration: fDuration });
        }
        return hDummy as IBaseNpc_Plus;
    }


    FindAbilityWithHighestCooldown?() {
        let highest_cd_ability: CDOTABaseAbility;
        for (let i = 0; i <= 24; i += 1) {
            let ability = this.GetAbilityByIndex(i);
            if (ability) {
                if (highest_cd_ability == null) {
                    highest_cd_ability = ability;
                }
                else if (ability.IsTrained()) {
                    if (ability.GetCooldownTimeRemaining() > highest_cd_ability.GetCooldownTimeRemaining()) {
                        highest_cd_ability = ability;
                    }
                }
            }
        }
        return highest_cd_ability;
    }

}
declare global {
    type IBaseNpc_Plus = BaseNpc_Plus;
}



