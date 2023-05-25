
import { ET } from "../../../shared/lib/Entity";

@GReloadable
export class BuffManagerComponent extends ET.Component {

    RuntimeCloneBuff: string[] = [];
    addRuntimeCloneBuff(buffName: string) {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let etroot = domain.ETRoot.As<IBattleUnitEntityRoot>()
        if (etroot.IsBuilding()) {
            if (!this.RuntimeCloneBuff.includes(buffName)) {
                this.RuntimeCloneBuff.push(buffName)
            }
        }
    }

    cloneRuntimeBuff(comp: BuffManagerComponent) {
        let buffnames = comp.RuntimeCloneBuff;
        if (buffnames && buffnames.length > 0) {
            let domain = this.GetDomain<IBaseNpc_Plus>();
            let target = comp.GetDomain<IBaseNpc_Plus>();
            for (let buffName of buffnames) {
                let modifier = target.findBuff(buffName);
                if (modifier) {
                    let buff = domain.addBuff(buffName, modifier.GetCasterPlus(), modifier.GetAbilityPlus())
                    buff.SetStackCount(modifier.GetStackCount())
                }
            }
        }
    }

    cloneAllBuff(npc: IBaseNpc_Plus) {
        let allm = npc.FindAllModifiers() as IBaseModifier_Plus[];
        for (let m of allm) {
            if (IsValid(m)) {
                m.Destroy();
            }
        }
    }
}