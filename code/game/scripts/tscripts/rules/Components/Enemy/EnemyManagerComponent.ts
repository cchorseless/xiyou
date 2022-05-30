import { ISpawnEffectInfo, SpawnEffectModifier } from "../../../assert/Assert_SpawnEffect";
import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_spawn_breaksoil } from "../../../npc/modifier/spawn/modifier_spawn_breaksoil";
import { modifier_spawn_fall } from "../../../npc/modifier/spawn/modifier_spawn_fall";
import { modifier_spawn_torrent } from "../../../npc/modifier/spawn/modifier_spawn_torrent";
import { ET, registerET } from "../../Entity/Entity";
import { EnemyState } from "../../System/Enemy/EnemyState";
import { EnemyUnitComponent } from "./EnemyUnitComponent";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";

@registerET()
export class EnemyManagerComponent extends ET.Component {
    tPlayerKills: number = 0;
    tPlayerMissing: number = 0;
    tAllEnemy: string[] = [];

    iMaxEnemyBonus: number = 0;
    iMaxEnemyBonusEach: number = 0;

    onAwake(...args: any[]): void {
        let domain = this.GetDomain<BaseNpc_Hero_Plus>();
        (this as any).PlayerID = domain.GetPlayerID();
        this.iMaxEnemyBonus = tonumber(KVHelper.KvServerConfig.building_config.MAX_ENERMY_EACH_PLAYER.configValue);
    }
    GetEnemySpawnPos() {
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        return EnemyState.SpawnEnemyPoint[playerid];
    }

    public getAllEnemy() {
        return this.GetDomain<BaseNpc_Plus>().ETRoot.GetDomainChilds(EnemyUnitEntityRoot)
    }

    addEnemy(enemyName: string, roundid: string, onlykey: string = null, pos: Vector = null, spawnEffect: ISpawnEffectInfo = null) {
        if (enemyName == "" || enemyName == null) {
            throw new Error("cant find emeny name");
        }
        if (pos == null) {
            pos = this.GetEnemySpawnPos();
        }
        if (pos == null) {
            throw new Error("cant find emeny spawn pos");
        }
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        let enemy = EntityHelper.CreateEntityByName(enemyName, pos, DOTATeam_t.DOTA_TEAM_BADGUYS) as BaseNpc_Plus;
        enemy.SetNeverMoveToClearSpace(false);
        EnemyUnitEntityRoot.Active(enemy);
        enemy.ETRoot.As<EnemyUnitEntityRoot>().SetConfigId(playerid, enemyName, roundid, onlykey);
        enemy.ETRoot.AddComponent(EnemyUnitComponent);
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.ETRoot.AddDomainChild(enemy.ETRoot);
        this.tAllEnemy.push(enemy.ETRoot.Id);
        if (spawnEffect != null) {
            enemy.addSpawnedHandler(
                ET.Handler.create(this, () => {
                    if (spawnEffect.tp_sound != null) {
                        EmitSoundOn(spawnEffect.tp_sound, enemy);
                    }
                    if (spawnEffect.modifier != null) {
                        switch (spawnEffect.modifier) {
                            case SpawnEffectModifier.spawn_breaksoil:
                                modifier_spawn_breaksoil.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                });
                                break;
                            case SpawnEffectModifier.spawn_fall:
                                modifier_spawn_fall.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                });
                                break;
                            case SpawnEffectModifier.spawn_torrent:
                                modifier_spawn_torrent.applyOnly(enemy, enemy, null, {
                                    vx: pos.x,
                                    vy: pos.y,
                                });
                                break;
                        }
                    }
                })
            );
        }
        return enemy;
    }
    killAllEnemy() {

    }

    
    killEnemy(etroot: EnemyUnitEntityRoot) {
        this.tPlayerKills += 1;
        this.removeEnemy(etroot);
    }

    missEnemy(etroot: EnemyUnitEntityRoot) {
        this.tPlayerMissing += 1;
        this.removeEnemy(etroot);
    }

    private removeEnemy(etroot: EnemyUnitEntityRoot) {
        let index = this.tAllEnemy.indexOf(etroot.Id);
        this.tAllEnemy.splice(index, 1);
        etroot.Dispose();
        if (this.tAllEnemy.length == 0) {
            this.Domain.ETRoot.AsPlayer().RoundManagerComp().getCurrentBoardRound().OnPrize();
        }
    }
}
