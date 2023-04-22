
import { LogHelper } from "../../../helper/LogHelper";
import { ActiveRootAbility } from "../../../npc/abilities/ActiveRootAbility";
import { ET } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";
import { AbilityEntityRoot } from "./AbilityEntityRoot";

@GReloadable
export class AbilityManagerComponent extends ET.Component implements IRoundStateCallback {
    public allAbilityRoot: string[] = [];
    onAwake(...args: any[]): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        let len = npc.GetAbilityCount();
        for (let i = 0; i < len; i++) {
            let ability = npc.GetAbilityByIndex(i) as IBaseAbility_Plus;
            if (ability) {
                if (ability.ETRoot == null) {
                    AbilityEntityRoot.TryToActive(ability)
                }
                this.addAbilityRoot(ability.ETRoot as IAbilityEntityRoot);
            }
        }
    }
    OnRound_Start(round?: ERoundBoard): void {
        let allability = this.getAllBaseAbility();
        allability.forEach(ability => {
            if (ability.OnRound_Start) {
                ability.OnRound_Start(round)
            }
        })

    }
    OnRound_WaitingEnd(): void { };
    // 战吼
    OnRound_Battle() {
        let allability = this.getAllBaseAbility();
        allability.forEach(ability => {
            if (ability.OnRound_Battle) {
                ability.OnRound_Battle()
            }
        })
    }

    OnRound_Prize(round: ERoundBoard) {
        let allability = this.getAllBaseAbility();
        allability.forEach(ability => {
            if (ability.OnRound_Prize) {
                ability.OnRound_Prize(round)
            }
        })
    }


    cloneAbility(source: AbilityManagerComponent) {
        let allability = source.getAllBaseAbility();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        allability.forEach(ability => {
            let abilityname = ability.GetAbilityName();
            if (npc.FindAbilityByName(abilityname) == null) {
                npc.addAbilityPlus(abilityname)
            }
        })
    }

    extraAbility: IAbilityEntityRoot;
    tryLearnExtraAbility(abilityname: string) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (this.extraAbility) {
            if (this.extraAbility.ConfigID == abilityname) {
                return false;
            }
            this.removeAbilityRoot(this.extraAbility);
            this.extraAbility = null;
        }
        let ability = npc.addAbilityPlus(abilityname);
        if (ability.ETRoot) {
            this.extraAbility = ability.ETRoot as IAbilityEntityRoot;
            return true
        }
        else {
            LogHelper.error("ability has no etroot")
            return false
        }
    }

    clearAllAbility() {
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let ability = battleunit.GetDomainChild<IAbilityEntityRoot>(str);
            if (ability) {
                ability.Dispose()
            }
        });
        this.allAbilityRoot = [];
    }

    getAllBaseAbility() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
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
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        return battleunit.GetDomainChild<IAbilityEntityRoot>(childid);
    }

    addAbilityRoot(root: IAbilityEntityRoot) {
        if (root == null) return;
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        if (root.DomainParent || root.DomainParent == battleunit) {
            return;
        }
        battleunit.AddDomainChild(root);
        this.allAbilityRoot.push(root.Id);
        if (battleunit.CombinationComp && battleunit.CombinationComp()) {
            battleunit.CombinationComp().addAbilityRoot(root);
        }
    }

    removeAbilityRoot(root: IAbilityEntityRoot) {
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        if (root.DomainParent != battleunit) {
            return;
        }
        battleunit.RemoveDomainChild(root);
        let index = this.allAbilityRoot.indexOf(root.Id);
        this.allAbilityRoot.splice(index, 1);
        if (battleunit.CombinationComp && battleunit.CombinationComp()) {
            battleunit.CombinationComp().removeAbilityRoot(root);
        }
        root.Dispose();
    }

    /**
     * 设置所有技能等级
     * @param istar 
     */
    setAllAbilityLevel(istar: number) {
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let abilityroot = battleunit.GetDomainChild<IAbilityEntityRoot>(str);
            let ability = abilityroot.GetDomain<IBaseAbility_Plus>();
            if (abilityroot.CheckCanActivate()) {
                ability.SetActivated(true);
                let requiredStar = abilityroot.GetRequiredStar();
                if (requiredStar > 0) {
                    ability.SetLevel(istar - requiredStar + 1);
                }
                else {
                    ability.SetLevel(math.min(istar, 4));
                }
            }
            else {
                ability.SetActivated(false);
            }
        })
    }


    getAllCanCastAbility() {
        let r: ActiveRootAbility[] = [];
        let caster = this.GetDomain<IBaseNpc_Plus>();
        if (caster == null || caster.IsIllusion()) {
            return r;
        }
        let battleunit = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBattleUnitEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let abilityroot = battleunit.GetDomainChild<IAbilityEntityRoot>(str);
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