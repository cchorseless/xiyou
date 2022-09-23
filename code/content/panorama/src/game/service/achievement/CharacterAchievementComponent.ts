import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterAchievementComponent extends ET.Component {
    public Achievements: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public set _Achievements(data: Dictionary<number, string>) {
        this.Achievements.copy(data);
    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }
}
