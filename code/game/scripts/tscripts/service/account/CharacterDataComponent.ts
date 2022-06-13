import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { TCharacter } from "./TCharacter";

@registerET()
export class CharacterDataComponent extends ET.Component {
    @serializeETProps()
    MetaStone: number;
    @serializeETProps()
    StarStone: number;
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + TCharacter.name);
        if (character) {
            character.AddOneComponent(this);
        }
    }
}
