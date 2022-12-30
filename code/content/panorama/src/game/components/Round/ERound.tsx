import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
@GReloadable
export class ERound extends ET.Entity {
    configID: string;
    unitSpawned: number = 0;
    tTotalDamage: number = 0; // 回合总伤害
    tTowerDamage: { [entityIndex: string]: number } = {}; // 回合伤害


    onAwake() {

    }
}