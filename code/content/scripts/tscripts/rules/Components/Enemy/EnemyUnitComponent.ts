
import { EnemyConfig } from "../../../shared/EnemyConfig";
import { ChessDataComponent } from "../ChessControl/ChessDataComponent";

@GReloadable
export class EnemyUnitComponent extends ChessDataComponent {

    onAwake(): void {
        super.onAwake();
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.SetForwardVector(Vector(0, -1, 0));
        domain.addSpawnedHandler(
            GHandler.create(this, () => {
                // modifier_no_health_bar.applyOnly(domain, domain);
            })
        );
    }

    GetPlayerId() {
        return this.Domain.ETRoot.As<IEnemyUnitEntityRoot>().BelongPlayerid;
    }
    EnemyUnitType() {
        return this.Domain.ETRoot.As<IEnemyUnitEntityRoot>().Config().UnitLabel;
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
