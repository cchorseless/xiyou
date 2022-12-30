
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { modifier_courier } from "../../../npc/courier/modifier_courier";
import { GameProtocol } from "../../../shared/GameProtocol";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { InventoryComponent } from "../Inventory/InventoryComponent";
import { ERoundBoard } from "../Round/ERoundBoard";
import { CourierBagComponent } from "./CourierBagComponent";
import { CourierDataComponent } from "./CourierDataComponent";
import { CourierShopComponent } from "./CourierShopComponent";

export class CourierEntityRoot extends BattleUnitEntityRoot {
    onAwake() {
        let hero = this.GetDomain<IBaseNpc_Hero_Plus>();
        (this.BelongPlayerid as any) = hero.GetPlayerOwnerID();
        (this.ConfigID as any) = hero.GetUnitName();
        (this.EntityId as any) = hero.GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof CourierDataComponent>("CourierDataComponent"));
        this.AddComponent(GGetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(GGetRegClass<typeof InventoryComponent>("InventoryComponent"));
        this.AddComponent(GGetRegClass<typeof CourierBagComponent>("CourierBagComponent"));
        this.AddComponent(GGetRegClass<typeof CourierShopComponent>("CourierShopComponent"));
        // this.RefreshCourier()

    }

    RefreshCourier() {
        let hHero = this.GetDomain<IBaseNpc_Hero_Plus>();
        if (!GameFunc.IsValid(hHero) || !hHero.IsAlive()) {
            return
        }
        let sCurrentCourierName = this.GetCourierName()
        let sCourierName = this.GetPlayerCourierInUse()
        if (sCurrentCourierName == sCourierName && modifier_courier.findIn(hHero)) {
            return
        }
        modifier_courier.remove(hHero);
        modifier_courier.applyOnly(hHero, hHero, null, { courier_name: sCourierName });
    }

    // - 获取当前生效的信使
    GetCourierName() {
        let hero = this.GetDomain<IBaseNpc_Hero_Plus>();
        let hModifier = modifier_courier.findIn(hero);
        if (GameFunc.IsValid(hModifier)) {
            return hModifier.GetCourierName() || GameServiceConfig.DefaultCourier;
        }
        return GameServiceConfig.DefaultCourier;
    }

    // - 获取现在服务器上存的数据玩家装备的线
    GetPlayerCourierInUse() {
        return this.GetPlayer().TCharacter().DataComp.getGameDataStr(GameProtocol.EGameDataStrDicKey.sCourierIDInUse) || GameServiceConfig.DefaultCourier;
    }

    // - 获取玩家正在使用的信使特效
    GetPlayerCourierFxInUse() {
        return this.GetPlayer().TCharacter().DataComp.getGameDataStr(GameProtocol.EGameDataStrDicKey.sCourierIDInUseFx) || "";
    }

    CourierDataComp() {
        return this.GetComponentByName<CourierDataComponent>("CourierDataComponent");
    }

    AbilityManagerComp() {
        return this.GetComponentByName<AbilityManagerComponent>("AbilityManagerComponent");
    }
    InventoryComp() {
        return this.GetComponentByName<InventoryComponent>("InventoryComponent");
    }
    CourierBagComp() {
        return this.GetComponentByName<CourierBagComponent>("CourierBagComponent");
    }
    CourierShopComp() {
        return this.GetComponentByName<CourierShopComponent>("CourierShopComponent");
    }
    OnRoundStartPrize(round: ERoundBoard) {
        let hero = this.GetDomain<IBaseNpc_Hero_Plus>();
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

declare global {
    type ICourierEntityRoot = CourierEntityRoot;
}