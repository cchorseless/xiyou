import { ET, registerET } from "../../../libs/Entity";
import { BattleUnitComponent } from "../BattleUnit/BattleUnitComponent";


/**塔防组件 */
@registerET()
export class BuildingComponent extends BattleUnitComponent {
    public PrimaryAttribute: number = 1;

}