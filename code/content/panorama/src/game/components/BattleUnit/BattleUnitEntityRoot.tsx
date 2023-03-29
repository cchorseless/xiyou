import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";

export class BattleUnitEntityRoot extends BaseEntityRoot {
    public iLevel: number = 1;
    public iStar: number = 1;
    public IsShowOverhead: boolean = false;
    HasOverhead(): boolean {
        if (this.IsShowOverhead) {
            return Entities.IsValidEntity(this.EntityId) && Entities.IsAlive(this.EntityId) && !Entities.IsInvisible(this.EntityId);
        }
        return false;
        // return Entities.IsValidEntity(this.EntityId) && Entities.IsAlive(this.EntityId) && !Entities.NoHealthBar(this.EntityId);
    }

    HasHpUI(): boolean {
        return Entities.IsValidEntity(this.EntityId) && Entities.IsAlive(this.EntityId) && !Entities.NoHealthBar(this.EntityId);
    }
}
declare global {
    type IBattleUnitEntityRoot = BattleUnitEntityRoot;
}