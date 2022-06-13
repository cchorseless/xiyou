import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "./TCharacter";

@registerET()
export class CharacterDataComponent extends ET.Component {
    MetaStone: number;
    StarStone: number;
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + TCharacter.name);
        if (character) {
            character.AddOneComponent(this);
        }
    }
}
