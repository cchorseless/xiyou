import { reloadable } from "../../../GameCache";
import { LogHelper } from "../../../helper/LogHelper";
import { ActiveRootAbility } from "../../../npc/abilities/ActiveRootAbility";
import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { BaseItem_Plus } from "../../../npc/entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { AbilityEntityRoot } from "./AbilityEntityRoot";

@reloadable
export class AbilityManagerComponent extends ET.Component {
    public allAbilityRoot: string[] = [];
    onAwake(...args: any[]): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let len = npc.GetAbilityCount();
        for (let i = 0; i < len; i++) {
            let ability = npc.GetAbilityByIndex(i) as BaseAbility_Plus;
            if (ability && ability.ETRoot) {
                this.addAbilityRoot(ability.ETRoot as AbilityEntityRoot);
            }
        }
    }
    // 战吼
    OnBoardRound_Battle() {
        let allability = this.getAllBaseAbility();
        allability.forEach(ability => {
            if (ability.OnRoundStartBattle) {
                ability.OnRoundStartBattle()
            }
        })
    }

    OnBoardRound_Prize(round: ERoundBoard) {
        let allability = this.getAllBaseAbility();
        allability.forEach(ability => {
            if (ability.OnRoundStartPrize) {
                ability.OnRoundStartPrize(round)
            }
        })
    }


    cloneAbility(source: AbilityManagerComponent) {
        let allability = source.getAllBaseAbility();
        let npc = this.GetDomain<BaseNpc_Plus>();
        allability.forEach(ability => {
            let abilityname = ability.GetAbilityName();
            if (npc.FindAbilityByName(abilityname) == null) {
                npc.addAbilityPlus(abilityname)
            }
        })
    }

    extraAbility: AbilityEntityRoot;
    tryLearnExtraAbility(abilityname: string) {
        let npc = this.GetDomain<BaseNpc_Plus>();
        if (this.extraAbility) {
            if (this.extraAbility.ConfigID == abilityname) {
                return false;
            }
            this.removeAbilityRoot(this.extraAbility);
            this.extraAbility = null;
        }
        let ability = npc.addAbilityPlus(abilityname);
        if (ability.ETRoot) {
            this.extraAbility = ability.ETRoot as AbilityEntityRoot;
            return true
        }
        else {
            LogHelper.error("ability has no etroot")
            return false
        }
    }

    clearAllAbility() {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let ability = battleunit.GetDomainChild<AbilityEntityRoot>(str);
            if (ability) {
                ability.Dispose()
            }
        });
        this.allAbilityRoot = [];
    }

    getAllBaseAbility() {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let r: ActiveRootAbility[] = [];
        let len = npc.GetAbilityCount();
        for (let i = 0; i < len; i++) {
            let ability = npc.GetAbilityByIndex(i) as ActiveRootAbility;
            if (ability) {
                r.push(ability);
            }
        }
        return r;
    }

    getAbilityRoot(childid: string) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        return battleunit.GetDomainChild<AbilityEntityRoot>(childid);
    }

    addAbilityRoot(root: AbilityEntityRoot) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (root.DomainParent || root.DomainParent == battleunit) {
            return;
        }
        battleunit.AddDomainChild(root);
        this.allAbilityRoot.push(root.Id);
        if (battleunit.CombinationComp()) {
            battleunit.CombinationComp().addAbilityRoot(root);
        }
    }

    removeAbilityRoot(root: AbilityEntityRoot) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (root.DomainParent != battleunit) {
            return;
        }
        battleunit.RemoveDomainChild(root);
        let index = this.allAbilityRoot.indexOf(root.Id);
        this.allAbilityRoot.splice(index, 1);
        if (battleunit.CombinationComp()) {
            battleunit.CombinationComp().removeAbilityRoot(root);
        }
        root.Dispose();
    }

    levelUpAllAbility() {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let ability = battleunit.GetDomainChild<AbilityEntityRoot>(str);
            ability.GetDomain<BaseAbility_Plus>().UpgradeAbility(true);
        })
    }


    setAllAbilityLevel(level: number) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let ability = battleunit.GetDomainChild<AbilityEntityRoot>(str);
            ability.GetDomain<BaseAbility_Plus>().SetLevel(level);
        })
    }


    getAllCanCastAbility() {
        let r: ActiveRootAbility[] = [];
        let caster = this.GetDomain<BaseNpc_Plus>();
        if (caster.IsIllusion()) {
            return r;
        }
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let abilityroot = battleunit.GetDomainChild<AbilityEntityRoot>(str);
            if (abilityroot) {
                let ability = abilityroot.GetDomain<ActiveRootAbility>()
                if (ability.IsAbilityReady()) {
                    r.push(ability)
                }
            }
        });
        return r;
    }
}