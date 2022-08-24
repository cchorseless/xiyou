import Dictionary from "../../helper/DataContainerHelper";
import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class GhostEntityComponent extends ET.Component {
    public ServerId: number;

    public EntityType: string;
}
