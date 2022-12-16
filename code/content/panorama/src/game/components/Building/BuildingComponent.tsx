import { ET, registerET } from "../../../libs/Entity";
import { ChessDataComponent } from "../ChessControl/ChessDataComponent";


/**塔防组件 */
@registerET()
export class BuildingComponent extends ChessDataComponent {
    public PrimaryAttribute: number = 1;

}