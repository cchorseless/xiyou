import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class BagComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + TCharacter.name);
        if (character) {
            character.AddOneComponent(this);
        }
    }
    public Items: string[];
}
