import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterTitleComponent extends ET.Component {
    public DressTitleConfigId: number;

    public Titles: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _Titles(data: Dictionary<number, string>) {
        this.Titles.copy(data);
    }

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

}