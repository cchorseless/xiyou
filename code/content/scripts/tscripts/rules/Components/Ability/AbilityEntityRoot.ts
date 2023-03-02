import { KVHelper } from "../../../helper/KVHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { CombinationConfig } from "../../../shared/CombinationConfig";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";

export class AbilityEntityRoot extends BaseEntityRoot {
    public readonly CombinationLabels: string[] = [];

    static TryToActive(ability: IBaseAbility_Plus) {
        if (IsServer()) {
            if (ability == null) return;
            const abilityname = ability.GetAbilityName();
            if (abilityname.includes("_empty")) {
                return;
            }
            AbilityEntityRoot.Active(ability);
        }
    }

    onAwake() {
        let ability = this.GetDomain<IBaseAbility_Plus>();
        (this.BelongPlayerid as any) = ability.GetOwnerPlus().GetPlayerOwnerID();
        (this.ConfigID as any) = ability.GetAbilityName();
        (this.EntityId as any) = ability.GetEntityIndex();
        ability.SetActivated(true);
        this.regSelfToM()
    }

    private regSelfToM() {
        let item = this.GetDomain<IBaseAbility_Plus>();
        let owner = item.GetOwnerPlus();
        let config = this.config();
        if (config) {
            let CombinationLabel = config.CombinationLabel as string;
            if (CombinationLabel && CombinationLabel.length > 0) {
                CombinationLabel.split("|").forEach((labels) => {
                    if (labels && labels.length > 0 && !this.CombinationLabels.includes(labels)) {
                        this.CombinationLabels.push(labels);
                    }
                });
            }
            if (owner != null && owner.ETRoot &&
                owner.ETRoot.As<IBattleUnitEntityRoot>().AbilityManagerComp()
            ) {
                owner.ETRoot.As<IBattleUnitEntityRoot>().AbilityManagerComp().addAbilityRoot(this)
            }
        }
    }



    onDestroy(): void {
        let ability = this.GetDomain<IBaseAbility_Plus>();
        if (!GFuncEntity.IsValid(ability)) { return }
        GFuncEntity.SafeDestroyAbility(ability);
    }

    config() {
        return KVHelper.KvAbilitys["" + this.ConfigID];
    }

    isCombinationLabel(label: string): boolean {
        return this.CombinationLabels.includes(label);
    }

    isManaEnoughForActive() {
        let needmana = this.config().AbilityActiveMana as string;
        if (needmana) {
            let ability = this.GetDomain<IBaseAbility_Plus>();
            if (needmana.includes("|")) {
                let _mana = needmana.split("|");
                needmana = _mana[math.max(ability.GetLevel(), _mana.length) - 1]
            }
            if (needmana) {
                let caster = ability.GetCasterPlus();
                return tonumber("" + needmana) <= caster.GetMana();
            }
        }
        return true;
    }
    OnRoundStartBattle() {
        let ability = this.GetDomain<IBaseAbility_Plus>();
        let npc = ability.GetOwnerPlus();
        if (this.isCombinationLabel(CombinationConfig.ECombinationLabel.sect_suck_blood)) {
            EmitSoundOn("dac.warlock.soul_ring", npc);
            ResHelper.CreateParticle(new ResHelper.ParticleInfo().set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_owner(npc)
                .set_resPath("particles/items2_fx/soul_ring.vpcf")
                .set_validtime(2)
            )
            npc.StartGestureWithPlaybackRate(GameActivity_t.ACT_DOTA_CAST_ABILITY_1, 1)
            npc.SetHealth(npc.GetHealth() * 0.8)
            let u_mana = npc.GetMana() + 40
            if (u_mana > 100) {
                u_mana = 100
            }
            npc.SetMana(u_mana)
        }

    }
}
declare global {
    type IAbilityEntityRoot = AbilityEntityRoot;
    var GAbilityEntityRoot: typeof AbilityEntityRoot;
}

if (_G.GAbilityEntityRoot == undefined) {
    _G.GAbilityEntityRoot = AbilityEntityRoot;
}