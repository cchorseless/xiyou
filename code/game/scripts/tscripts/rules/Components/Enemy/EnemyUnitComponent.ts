import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { building_unit_enemy } from "../../../kvInterface/building/building_unit_enemy";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { RoundSystem } from "../../System/Round/RoundSystem";
import { ERound } from "../Round/ERound";
import { EnemyKillPrizeComponent } from "./EnemyKillPrizeComponent";
import { EnemyManagerComponent } from "./EnemyManagerComponent";
import { EnemyMoveComponent } from "./EnemyMoveComponent";
import { EnemyPropsComponent } from "./EnemyPropsComponent";

export enum EEnemyUnitType {
    wave = "wave",
    BOSS = "BOSS",
    GOLD_BOSS = "GOLD_BOSS",
    CANDY_BOSS = "CANDY_BOSS",
    CANDY_WAVE = "CANDY_WAVE",
}

export class EnemyUnitComponent extends ET.Component {

    configid: string;
    config: building_unit_enemy.OBJ_2_1;
    readonly PlayerID: number;
    readonly RoundID: string;

    onAwake(playerid: number, roundid: string, enemyName: string): void {
        (this as any).PlayerID = playerid;
        (this as any).RoundID = roundid;
        this.configid = enemyName;
        this.config = KVHelper.KvServerConfig.building_unit_enemy[enemyName as "wave_1"];
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.ETRoot.AddComponent(EnemyMoveComponent);
        domain.ETRoot.AddComponent(EnemyKillPrizeComponent);
        domain.ETRoot.AddComponent(EnemyPropsComponent);
    }

    get EnemyUnitManager(): EnemyManagerComponent {
        let domain = this.GetDomain<BaseNpc_Plus>();
        return domain.ETRoot.DomainParent.GetComponentByName<EnemyManagerComponent>("EnemyManagerComponent");
    }

    get Round(): ERound {
        return RoundSystem.AllManager[this.PlayerID].RoundInfo[this.RoundID];
    }


    get EnemyUnitType() {
        return this.config.UnitLabel
    }

    get IsWave() {
        return this.EnemyUnitType == EEnemyUnitType.wave;
    }
    get IsBoss() {
        return this.EnemyUnitType == EEnemyUnitType.BOSS;
    }
    get IsGOLD_BOSS() {
        return this.EnemyUnitType == EEnemyUnitType.GOLD_BOSS;
    }
    get IsCANDY_BOSS() {
        return this.EnemyUnitType == EEnemyUnitType.CANDY_BOSS;
    }
    get IsCANDY_WAVE() {
        return this.EnemyUnitType == EEnemyUnitType.CANDY_WAVE;
    }
}
