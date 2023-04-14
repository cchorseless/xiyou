import { ResHelper } from "../helper/ResHelper";

export module Assert_MsgEffect {
    export enum EMsgEffect {
        MSG_BLOCK = "particles/msg_fx/msg_block.vpcf",
        MSG_ORIT = "particles/msg_fx/msg_crit.vpcf",
        MSG_DAMAGE = "particles/msg_fx/msg_damage.vpcf",
        MSG_EVADE = "particles/msg_fx/msg_evade.vpcf",
        MSG_GOLD = "particles/msg_fx/msg_gold.vpcf",
        MSG_HEAL = "particles/msg_fx/msg_heal.vpcf",
        MSG_MANA_ADD = "particles/msg_fx/msg_mana_add.vpcf",
        MSG_MANA_LOSS = "particles/msg_fx/msg_mana_loss.vpcf",
        MSG_MISS = "particles/msg_fx/msg_miss.vpcf",
        MSG_POISION = "particles/msg_fx/msg_poison.vpcf",
        MSG_SPELL = "particles/msg_fx/msg_spell.vpcf",
        MSG_XP = "particles/msg_fx/msg_xp.vpcf",
    }


    export function CreateNumberEffect(entity: IBaseNpc_Plus, number: number, duration: number, msg_type: EMsgEffect, color: Vector = null, icon_type: number = 9) {
        // 判断实体
        if (!IsValid(entity) || !entity.IsAlive()) {
            return;
        }
        if (color == null) {
            color = Vector(255, 255, 255);
        }
        // 处理数字
        number = math.floor(number);
        let number_count = ("" + number).length + 1;
        // 创建特效
        let particle = ResHelper.CreateParticle(
            new ResHelper.ParticleInfo()
                .set_iAttachment(ParticleAttachment_t.PATTACH_CUSTOMORIGIN_FOLLOW)
                .set_resPath(msg_type)
                .set_owner(entity)
                .set_validtime(duration)
        );
        ParticleManager.SetParticleControlEnt(particle, 0, entity, 5, "attach_hitloc", entity.GetOrigin(), true);
        ParticleManager.SetParticleControl(particle, 1, Vector(10, number, icon_type));
        ParticleManager.SetParticleControl(particle, 2, Vector(duration, number_count, 0));
        ParticleManager.SetParticleControl(particle, 3, color);
    }
}
