import { reloadable } from "../../../GameCache";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_no_health_bar } from "../../../npc/modifier/modifier_no_health_bar";
import { ET } from "../../Entity/Entity";
import { EnemyConfig } from "../../System/Enemy/EnemyConfig";
import { BattleUnitComponent } from "../BattleUnit/BattleUnitComponent";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";

@reloadable
export class EnemyUnitComponent extends BattleUnitComponent {
    readonly IsSerializeEntity: boolean = true;

    onAwake(): void {
        super.onAwake();
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.SetForwardVector(Vector(0, -1, 0));
        domain.addSpawnedHandler(
            ET.Handler.create(this, () => {
                // modifier_no_health_bar.applyOnly(domain, domain);
            })
        );
    }

    GetPlayerId() {
        return this.Domain.ETRoot.As<EnemyUnitEntityRoot>().Playerid;
    }
    EnemyUnitType() {
        return this.Domain.ETRoot.As<EnemyUnitEntityRoot>().Config().UnitLabel;
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
