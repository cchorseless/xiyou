import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterActivityComponent extends ET.Component {
    public ActivityData: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public set _ActivityData(data: Dictionary<number, string>) {
        this.ActivityData.copy(data);
    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

}
