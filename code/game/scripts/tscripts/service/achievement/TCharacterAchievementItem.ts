import { reloadable } from "../../GameCache";
import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { CharacterAchievementComponent } from "./CharacterAchievementComponent";

@reloadable
export class TCharacterAchievementItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;
    public IsAchieve: boolean;
    public IsPrizeGet: boolean;
    public AchievementComp(): CharacterAchievementComponent { return this.GetParent<CharacterAchievementComponent>(); }
    onSerializeToEntity() {

    }
}
