import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { EnemyState } from "../../System/Enemy/EnemyState";
import { EnemySystem } from "../../System/Enemy/EnemySystem";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

export class EnemyManagerComponent extends ET.Component {

    tPlayerKills: number = 0;
    tPlayerMissing: number = 0;
    tAllEnemy: string[] = [];

    iMaxEnemyBonus: number = 0;
    iMaxEnemyBonusEach: number = 0;
    readonly PlayerID: number;

    onAwake(...args: any[]): void {
        let domain = this.GetDomain<BaseNpc_Hero_Plus>();
        (this as any).PlayerID = domain.GetPlayerID();
        this.iMaxEnemyBonus = tonumber(KVHelper.KvServerConfig.building_config.MAX_ENERMY_EACH_PLAYER.configValue);
        EnemySystem.RegComponent(this);
    }
    GetEnemySpawnPos() {
        return EnemyState.SpawnEnemyPoint[this.PlayerID];
    }
    addEnemy(enemyName: string, roundid: string, pos: Vector = null) {
        if (enemyName == "" || enemyName == null) {
            throw new Error("cant find emeny name");
        }
        if (pos == null) { pos = this.GetEnemySpawnPos() };
        if (pos == null) {
            throw new Error("cant find emeny spawn pos");
        }
        let enemy = EntityHelper.CreateEntityByName(enemyName, pos, DOTATeam_t.DOTA_TEAM_BADGUYS) as BaseNpc_Plus;
        enemy.SetNeverMoveToClearSpace(false);
        ET.EntityRoot.Active(enemy);
        enemy.ETRoot.AddComponent(EnemyUnitComponent, this.PlayerID, roundid, enemyName);
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.ETRoot.AddDomainChild(enemy.ETRoot);
        this.tAllEnemy.push(enemy.ETRoot.Id)
        return enemy;
    }
    killAllEnemy() {

    }


    killEnemy(etroot: ET.EntityRoot) {
        this.tPlayerKills += 1;
        this.removeEnemy(etroot);
    }

    missEnemy(etroot: ET.EntityRoot) {
        this.tPlayerMissing += 1;
        this.removeEnemy(etroot);
    }

    private removeEnemy(etroot: ET.EntityRoot) {
        let index = this.tAllEnemy.indexOf(etroot.Id);
        this.tAllEnemy.splice(index, 1);
        let domain = etroot.GetDomain<BaseNpc_Plus>();
        etroot.Dispose();
        domain.SafeDestroy();
    }

}