import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { PlayerCreateUnitEntityRoot, PlayerCreateUnitType } from "../Player/PlayerCreateUnitEntityRoot";

export class AbilityEntityRoot extends PlayerCreateUnitEntityRoot {
    public readonly IsSerializeEntity: boolean = true;

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
        if (owner != null && owner.ETRoot &&
            owner.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().AbilityManagerComp()
        ) {
            owner.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().AbilityManagerComp().addAbilityRoot(this)
        }
    }



    onDestroy(): void {
        let ability = this.GetDomain<BaseAbility_Plus>();
        let owner = ability.GetOwnerPlus();
        if (owner) {
            owner.RemoveAbilityByHandle(ability);
        }
        ability.Destroy();
        UTIL_Remove(ability);
    }

    config() {
        return KVHelper.KvConfig().building_ability_tower["" + this.ConfigID];
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
}
