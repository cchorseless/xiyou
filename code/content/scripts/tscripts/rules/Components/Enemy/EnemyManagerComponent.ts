import { Assert_Color } from "../../../assert/Assert_Color";
import { Assert_MsgEffect } from "../../../assert/Assert_MsgEffect";
import { IProjectileEffectInfo } from "../../../assert/Assert_ProjectileEffect";
import { ISpawnEffectInfo, SpawnEffectModifier } from "../../../assert/Assert_SpawnEffect";

import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_spawn_breaksoil } from "../../../npc/modifier/spawn/modifier_spawn_breaksoil";
import { modifier_spawn_fall } from "../../../npc/modifier/spawn/modifier_spawn_fall";
import { modifier_spawn_torrent } from "../../../npc/modifier/spawn/modifier_spawn_torrent";
import { ET } from "../../../shared/lib/Entity";
import { PlayerScene } from "../Player/PlayerScene";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";

@GReloadable
export class EnemyManagerComponent extends ET.Component {
    tPlayerKills: number = 0;
    tPlayerMissing: number = 0;
    tAllEnemyNameList: string[] = [];

    iMaxEnemyBonus: number = 0;
    iMaxEnemyBonusEach: number = 0;

    GetEnemySpawnPos() {
        return GEnemySystem.GetInstance().SpawnEnemyPoint[this.BelongPlayerid];
    }

    ApplyDamageHero(damage: number, projectileInfo: IProjectileEffectInfo) {
        if (damage > 0) {
            let hero = this.GetDomain<PlayerScene>().ETRoot.Hero;
            let heroroot = hero.ETRoot.As<ICourierEntityRoot>();
            Assert_MsgEffect.CreateNumberEffect(hero, damage, 2, Assert_MsgEffect.EMsgEffect.MSG_MISS, Assert_Color.red);
            EmitSoundOn(projectileInfo.sound, hero);
            heroroot.ApplyDamageByEnemy(damage);
        }
    }

    AddEnemy(enemyName: string, roundid: string, onlykey: string = null, pos: Vector = null, angle: Vector = null, spawnEffect: ISpawnEffectInfo = null, npcOwner: IBaseNpc_Plus = null) {
        if (enemyName == "" || enemyName == null) {
            GLogHelper.error("cant find emeny name");
        }
        if (pos == null) {
            pos = this.GetEnemySpawnPos();
        }
        if (pos == null) {
            GLogHelper.error("cant find emeny spawn pos");
        }
        let enemy = BaseNpc_Plus.CreateUnitByName(enemyName, pos, npcOwner, true, DOTATeam_t.DOTA_TEAM_BADGUYS);
        enemy.SetUnitOnClearGround();
        EnemyUnitEntityRoot.Active(enemy, this.BelongPlayerid, enemyName, roundid, onlykey);
        if (angle != null && angle.Length2D() > 0) {
            enemy.SetForwardVector(angle);
        }
        let domain = GGameScene.GetPlayer(this.BelongPlayerid)
        domain.AddDomainChild(enemy.ETRoot);
        this.tAllEnemyNameList.push(enemyName);
        enemy.addSpawnedHandler(
            GHandler.create(this, () => {
                let hander = GHandler.create(this, () => {
                    enemy.ETRoot.SyncClient();
                })
                if (spawnEffect == null) {
                    hander.run();
                }
                else {
                    if (spawnEffect.tp_sound != null) {
                        EmitSoundOn(spawnEffect.tp_sound, enemy);
                    }
                    if (spawnEffect.modifier != null) {
                        switch (spawnEffect.modifier) {
                            case SpawnEffectModifier.spawn_breaksoil:
                                modifier_spawn_breaksoil.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                }).DestroyHandler = hander;
                                return;
                            case SpawnEffectModifier.spawn_fall:
                                modifier_spawn_fall.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                }).DestroyHandler = hander;
                                return;
                            case SpawnEffectModifier.spawn_torrent:
                                modifier_spawn_torrent.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                }).DestroyHandler = hander;
                                return;
                        }
                    }
                };
            })
        );
        return enemy;
    }

    killEnemy(etroot: IEnemyUnitEntityRoot) {
        this.tPlayerKills += 1;
    }

    removeAllEnemy() {
        let domain = GGameScene.GetPlayer(this.BelongPlayerid);
        domain.BattleUnitManagerComp().GetAllEnemyUnitEntityRoot().forEach((entity) => {
            entity.Dispose();
        });
        domain.BattleUnitManagerComp().ClearSummonIllusion(DOTATeam_t.DOTA_TEAM_BADGUYS)
        this.tAllEnemyNameList = [];
    }

}
