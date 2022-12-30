import { NetHelper } from "../../../helper/NetHelper";
import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";

@GReloadable
export class BuildingManagerComponent extends ET.Component {
    onSerializeToEntity(): void {
        GGameScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }


}
