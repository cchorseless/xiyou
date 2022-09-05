import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class CharacterSteamComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }
}
