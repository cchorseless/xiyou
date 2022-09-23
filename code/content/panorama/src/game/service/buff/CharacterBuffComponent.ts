import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterBuffComponent extends ET.Component {
    public Buffs: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _Buffs(data: Dictionary<number, string>) {
        this.Buffs.copy(data);
    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

}
