import { GetRegClass } from "../../../GameCache";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { ItemManagerComponent } from "../Item/ItemManagerComponent";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { CourierDataComponent } from "./CourierDataComponent";


export class CourierEntityRoot extends PlayerCreateBattleUnitEntityRoot {
    onAwake() {
        let hero = this.GetDomain<BaseNpc_Hero_Plus>();
        (this as any).Playerid = hero.GetPlayerOwnerID();
        (this as any).ConfigID = hero.GetUnitName();
        (this as any).EntityId = hero.GetEntityIndex();
        this.AddComponent(GetRegClass<typeof CourierDataComponent>("CourierDataComponent"));
        this.AddComponent(GetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(GetRegClass<typeof ItemManagerComponent>("ItemManagerComponent"));
    }

    CourierDataComp() {
        return this.GetComponentByName<CourierDataComponent>("CourierDataComponent");
    }

    AbilityManagerComp() {
        return this.GetComponentByName<AbilityManagerComponent>("AbilityManagerComponent");
    }
    ItemManagerComp() {
        return this.GetComponentByName<ItemManagerComponent>("ItemManagerComponent");
    }

    OnRoundStartPrize(round: ERoundBoard) {
        let hero = this.GetDomain<BaseNpc_Hero_Plus>();
        if (round.isWin) {
            this.onVictory();
            // 音效
            ResHelper.CreateParticle(new ResHelper.ParticleInfo()
                .set_resPath("effect/winaround/1/shovel_baby_roshan_spawn.vpcf")
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_owner(hero)
                .set_validtime(3)
            );
            ResHelper.CreateParticle(new ResHelper.ParticleInfo()
                .set_resPath("particles/units/heroes/hero_legion_commander/legion_commander_duel_victory.vpcf")
                .set_iAttachment(ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW)
                .set_owner(hero)
                .set_validtime(3)
            )
        }
    }
}