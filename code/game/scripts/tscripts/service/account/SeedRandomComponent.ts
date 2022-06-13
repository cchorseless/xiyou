import { ET, registerET } from "../../rules/Entity/Entity";
import { TCharacter } from "./TCharacter";

@registerET()
export class SeedRandomComponent extends ET.Component {
    BeginSeed: number;
    Seed: number;
    SeedCount: number;
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + TCharacter.name) as TCharacter;
        if (character && character.SeedRandomComp() == null) {
            // character.AddOneComponent(this);
        }
    }
}
