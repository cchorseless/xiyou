import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { reloadable } from "../../GameCache";

@reloadable
export class GhostEntityComponent extends ET.Component {
    public ServerId: number;

    public EntityType: string;
}
