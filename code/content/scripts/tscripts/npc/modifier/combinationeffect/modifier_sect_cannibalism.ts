import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_cannibalism_base_a extends modifier_combination_effect {
    prop_pect: number;
    Init() {
        this.prop_pect = this.getSpecialData("prop_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cannibalism || { prop_pect: 0 };
        t.prop_pect += this.prop_pect;
        parent.TempData().sect_cannibalism = t;
        this.buff_fx = ResHelper.CreateParticleEx("particles/sect/sect_cannibalism/sect_cannibalism1.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        modifier_sect_cannibalism_eatfriend.applyOnly(parent, parent)

    }
}
@registerModifier()
export class modifier_sect_cannibalism_base_b extends modifier_combination_effect {
    prop_pect: number;
    Init() {
        this.prop_pect = this.getSpecialData("prop_pect");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_cannibalism || { prop_pect: 0 };
        t.prop_pect += this.prop_pect;
        parent.TempData().sect_cannibalism = t;
    }
}
@registerModifier()
export class modifier_sect_cannibalism_base_c extends modifier_sect_cannibalism_base_b {
}

@registerModifier()
export class modifier_sect_cannibalism_eatfriend extends BaseModifier_Plus {
    atkadd: number = 0;

    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.AddTimer(0.1, () => {
                let parent = this.GetParentPlus();
                let t = parent.TempData().sect_cannibalism || { prop_pect: 0 };
                let prop_pect = t.prop_pect;
                if (parent.ETRoot) {
                    let enemyroot = parent.ETRoot as IBattleUnitEntityRoot;
                    if (enemyroot.ChessComp()) {
                        let chessnpc = enemyroot.ChessComp().FindAroundFriendChess();
                        let hpadd = 0;
                        let atkadd = 0;
                        for (let npc of chessnpc) {
                            if (npc.IsAlive() && npc.IsFriendly(parent) &&
                                npc.TempData().sect_cannibalism_eatfriend == null &&
                                !npc.HasModifier("modifier_sect_cannibalism_eatfriend")) {
                                npc.TempData().sect_cannibalism_eatfriend = true;
                                hpadd += npc.GetMaxHealth();
                                atkadd += npc.GetBaseDamageMax();
                                npc.ETRoot.Dispose();
                            }
                        }
                        hpadd = hpadd * prop_pect / 100;
                        atkadd = atkadd * prop_pect / 100;
                        parent.ModifyMaxHealth(hpadd);
                        this.atkadd = atkadd;
                        NetTablesHelper.SetDotaEntityData(parent.GetEntityIndex(), { atkadd: atkadd }, "sect_cannibalism")
                    }
                }
            })

        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_BASEATTACK_BONUSDAMAGE() {
        if (IsServer()) {
            return this.atkadd;
        }
        else {
            let data = NetTablesHelper.GetDotaEntityData(this.GetParentPlus().GetEntityIndex(), "sect_cannibalism") || {};
            return data.atkadd;
        }
    }


}