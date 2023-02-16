import { BaseEntityRoot } from "../../../libs/BaseEntityRoot";

export class BattleUnitEntityRoot extends BaseEntityRoot {
    public iLevel: number = 1;
    public iStar: number = 1;
    public IsShowOverhead: boolean = false;
    public PrimaryAttribute: number = 1;
}
