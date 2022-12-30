import { NetHelper } from "../../../helper/NetHelper";
import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";


@GReloadable
export class FHeroCombinationManagerComponent extends CombinationManagerComponent {
    onSerializeToEntity(): void {
        GFakerHeroEntityRoot.GetOneInstance(this.BelongPlayerid)?.AddOneComponent(this);
    }
}