
import { ECombination } from "../Combination/ECombination";

@GReloadable
export class FHeroCombination extends ECombination {
    onSerializeToEntity(): void {
        this.onReload();
    }

    onReload() {
        if (this.IsEmpty()) { return; }
        let player = GFakerHeroEntityRoot.GetOneInstance(this.BelongPlayerid)
        player!.FHeroCombinationManager.addOneCombination(this);
    }
    isFakerCombination() {
        return true;
    }
}