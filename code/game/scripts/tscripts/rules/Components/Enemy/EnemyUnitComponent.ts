import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { building_unit_enemy } from "../../../kvInterface/building/building_unit_enemy";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { EnemyConfig } from "../../System/Enemy/EnemyConfig";
import { PlayerSystem } from "../../System/Player/PlayerSystem";
import { RoundSystem } from "../../System/Round/RoundSystem";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { ERound } from "../Round/ERound";
import { RoundEnemyComponent } from "../Round/RoundEnemyComponent";
import { EnemyKillPrizeComponent } from "./EnemyKillPrizeComponent";
import { EnemyMoveComponent } from "./EnemyMoveComponent";
import { EnemyPropsComponent } from "./EnemyPropsComponent";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";

@registerET()
export class EnemyUnitComponent extends ET.Component {
    config: building_unit_enemy.OBJ_2_1;

    onAwake(): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let configid = domain.ETRoot.As<EnemyUnitEntityRoot>().ConfigID;
        this.config = KVHelper.KvServerConfig.building_unit_enemy[configid];
        // domain.ETRoot.AddComponent(EnemyMoveComponent);
        domain.ETRoot.AddComponent(EnemyKillPrizeComponent);
        domain.ETRoot.AddComponent(EnemyPropsComponent);
        domain.ETRoot.AddComponent(ChessComponent);
        domain.ETRoot.AddComponent(RoundEnemyComponent);
        domain.SetForwardVector(Vector(0, -1, 0));
    }



    GetPlayerId() {
        return this.Domain.ETRoot.As<EnemyUnitEntityRoot>().Playerid;
    }

    EnemyUnitType() {
        return this.config.UnitLabel;
    }

    IsWave() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.wave;
    }
    IsBoss() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.BOSS;
    }
    IsGOLD_BOSS() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.GOLD_BOSS;
    }
    IsCANDY_BOSS() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.CANDY_BOSS;
    }
    IsCANDY_WAVE() {
        return this.EnemyUnitType() == EnemyConfig.EEnemyUnitType.CANDY_WAVE;
    }
}
