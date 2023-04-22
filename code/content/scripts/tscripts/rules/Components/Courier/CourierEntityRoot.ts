
import { ResHelper } from "../../../helper/ResHelper";
import { modifier_courier } from "../../../npc/courier/modifier_courier";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { serializeETProps } from "../../../shared/lib/Entity";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { InventoryComponent } from "../Inventory/InventoryComponent";
import { ERoundBoard } from "../Round/ERoundBoard";
import { CourierBagComponent } from "./CourierBagComponent";
import { CourierShopComponent } from "./CourierShopComponent";

export class CourierEntityRoot extends BaseEntityRoot implements IRoundStateCallback {
    @serializeETProps()
    health: number = 100;
    @serializeETProps()
    maxHealth: number = 100;
    @serializeETProps()
    steamID: string;
    @serializeETProps()
    damage: number = 0;
    /**出生点 */
    firstSpawnPoint: Vector;

    onAwake() {
        let hero = this.GetDomain<IBaseNpc_Hero_Plus>();
        (this.BelongPlayerid as any) = hero.GetPlayerID();
        (this.ConfigID as any) = hero.GetUnitName();
        (this.EntityId as any) = hero.GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(GGetRegClass<typeof InventoryComponent>("InventoryComponent"));
        this.AddComponent(GGetRegClass<typeof CourierBagComponent>("CourierBagComponent"));
        this.AddComponent(GGetRegClass<typeof CourierShopComponent>("CourierShopComponent"));
        this.RefreshCourier();
        this.firstSpawnPoint = hero.GetAbsOrigin();
        this.steamID = PlayerResource.GetSteamAccountID(this.BelongPlayerid).toString();
        modifier_wait_portal.applyOnly(hero, hero);
        this.SyncClient(true, true)
    }
    IsCourierRoot() {
        return true;
    }

    ApplyDamageByEnemy(damage: number) {
        let hero = this.GetDomain<IBaseNpc_Hero_Plus>();
        this.health -= damage;
        hero.SetHealth(this.health);
        this.SyncClient(true, true)
        if (this.health <= 0) {
            this.onKilled({})
        }
    }

    onKilled(e: any) {
        let hHero = this.GetDomain<IBaseNpc_Hero_Plus>();
        hHero.StartGesture(GameActivity_t.ACT_DOTA_DIE);
        hHero.ForceKill(false);
        let isgameend = true;
        CourierEntityRoot.GetAllInstance().forEach((instance) => {
            if (instance.health > 0) {
                isgameend = false;
            }
        });
        if (isgameend) {
            GGameScene.Defeat();
        }
    }
    RefreshCourier() {
        let hHero = this.GetDomain<IBaseNpc_Hero_Plus>();
        if (!IsValid(hHero) || !hHero.IsAlive()) {
            return
        }
        let sCurrentCourierName = this.GetCourierName()
        let sCourierName = GGameServiceSystem.GetInstance().tPlayerGameSelection[this.BelongPlayerid + ""].Courier;
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
        if (IsValid(hModifier)) {
            return hModifier.GetCourierName() || GameServiceConfig.DefaultCourier;
        }
        return GameServiceConfig.DefaultCourier;
    }
    onVictory() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (IsValid(npc)) {
            npc.Stop();
            npc.StartGesture(GameActivity_t.ACT_DOTA_VICTORY);
        }
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

    OnRound_Start(round?: ERoundBoard): void {
        this.AbilityManagerComp().OnRound_Start(round);
        this.CourierShopComp().refreshRoundShopItem();
        this.CourierShopComp().SyncClient();
    };
    OnRound_Battle(): void { }

    OnRound_Prize(round: ERoundBoard) {
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
    OnRound_WaitingEnd() { }
}

declare global {
    type ICourierEntityRoot = CourierEntityRoot;
}