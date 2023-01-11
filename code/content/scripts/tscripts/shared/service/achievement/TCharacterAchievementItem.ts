

import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterAchievementComponent } from "./CharacterAchievementComponent";

@GReloadable
export class TCharacterAchievementItem extends ET.Entity {

    @serializeETProps()
    public ConfigId: number;
    public IsAchieve: boolean;
    public IsPrizeGet: boolean;
    get AchievementComp(): CharacterAchievementComponent { return this.GetParent<CharacterAchievementComponent>(); }
    onSerializeToEntity() {

    }
}
