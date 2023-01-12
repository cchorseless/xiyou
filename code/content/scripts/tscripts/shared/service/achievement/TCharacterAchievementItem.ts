

import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterAchievementComponent } from "./CharacterAchievementComponent";

@GReloadable
export class TCharacterAchievementItem extends ET.Entity {

    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public IsAchieve: boolean;
    @serializeETProps()
    public IsPrizeGet: boolean;
    get AchievementComp(): CharacterAchievementComponent { return this.GetParent<CharacterAchievementComponent>(); }
    onSerializeToEntity() {

    }
}
