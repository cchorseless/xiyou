import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { CombinationConfig } from "../../../shared/CombinationConfig";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { PlayerCreateUnitEntityRoot, PlayerCreateUnitType } from "../Player/PlayerCreateUnitEntityRoot";

export class AbilityEntityRoot extends PlayerCreateUnitEntityRoot {
    public readonly IsSerializeEntity: boolean = true;
    public readonly CombinationLabels: string[] = [];

    onAwake() {
        let ability = this.GetDomain<BaseAbility_Plus>();
        (this as any).Playerid = ability.GetOwnerPlus().GetPlayerOwnerID();
        (this as any).ConfigID = ability.GetAbilityName();
        (this as any).EntityId = ability.GetEntityIndex();
        ability.SetActivated(true);
        this.regSelfToM()
    }

    private regSelfToM() {
        let item = this.GetDomain<BaseAbility_Plus>();
        let owner = item.GetOwnerPlus();
        let config = this.config();
        if (config && config.CombinationLabel && config.CombinationLabel.length > 0) {
            config.CombinationLabel.split("|").forEach((labels) => {
                if (labels && labels.length > 0 && !this.CombinationLabels.includes(labels)) {
                    this.CombinationLabels.push(labels);
                }
            });
        }
        if (owner != null && owner.ETRoot &&
            owner.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().AbilityManagerComp()
        ) {
            owner.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().AbilityManagerComp().addAbilityRoot(this)
        }
    }



    onDestroy(): void {
        let ability = this.GetDomain<BaseAbility_Plus>();
        if (!GameFunc.IsValid(ability)) { return }
        ability.SafeDestroy();
    }

    config() {
        return KVHelper.KvConfig().building_ability_tower["" + this.ConfigID];
    }

    isCombinationLabel(label: string): boolean {
        return this.CombinationLabels.includes(label);
    }

    isManaEnoughForActive() {
        let needmana = this.config().AbilityActiveMana;
        if (needmana) {
            let ability = this.GetDomain<BaseAbility_Plus>();
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
        let ability = this.GetDomain<BaseAbility_Plus>();
        let npc = ability.GetOwnerPlus();
        if (this.isCombinationLabel(CombinationConfig.ECombinationLabel.suck_blood)) {
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
