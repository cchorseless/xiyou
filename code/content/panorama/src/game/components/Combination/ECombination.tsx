import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";


@GReloadable
export class ECombination extends ET.Entity {
    public combinationName: string;
    public combinationId: string;
    public activeNeedCount: number;
    public uniqueConfigList: string[] = [];

    onSerializeToEntity(): void {
        this.onReload();
    }
    onReload() {
        if (this.IsEmpty()) { return; }
        GGameScene.GetPlayer(this.BelongPlayerid).CombinationManager.addOneCombination(this);
    }

    isFakerCombination() {
        return false;
    }
    IsActive() {
        return this.uniqueConfigList.length >= this.activeNeedCount;
    }
    IsEmpty() {
        return this.uniqueConfigList.length == 0;
    }
}