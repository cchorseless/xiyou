

import { ET } from "../../lib/Entity";
import { CharacterAchievementComponent } from "./CharacterAchievementComponent";

@GReloadable
export class TCharacterAchievementItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public IsAchieve: boolean;
    public IsPrizeGet: boolean;
    get AchievementComp(): CharacterAchievementComponent { return this.GetParent<CharacterAchievementComponent>(); }
    onSerializeToEntity() {

    }
}
