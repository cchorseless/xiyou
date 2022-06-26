import { ET, registerET } from "../../../libs/Entity";


/**塔防组件 */
@registerET()
export class BuildingComponent extends ET.Component {
    public iStar: number = 1;
    public PrimaryAttribute: number = 1;
    
 }