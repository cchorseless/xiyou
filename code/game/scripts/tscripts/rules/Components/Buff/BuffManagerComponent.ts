import { reloadable } from "../../../GameCache";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";

@reloadable
export class BuffManagerComponent extends ET.Component {

    RuntimeCloneBuff: string[] = [];
    addRuntimeCloneBuff(buffName: string) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let etroot = domain.ETRoot.As<PlayerCreateBattleUnitEntityRoot>()
        if (etroot.IsBuilding()) {
            if (!this.RuntimeCloneBuff.includes(buffName)) {
                this.RuntimeCloneBuff.push(buffName)
            }
        }
    }

    cloneRuntimeBuff(comp: BuffManagerComponent) {
        if (comp.RuntimeCloneBuff && comp.RuntimeCloneBuff.length > 0) {
            let domain = this.GetDomain<BaseNpc_Plus>();
            let target = comp.GetDomain<BaseNpc_Plus>();
            for (let buffName of (comp.RuntimeCloneBuff)) {
                let modifier = target.findBuff(buffName);
                if (modifier) {
                    let buff = domain.addBuff(buffName, modifier.GetCasterPlus(), modifier.GetAbilityPlus())
                    buff.SetStackCount(modifier.GetStackCount())
                }
            }
        }
    }
}