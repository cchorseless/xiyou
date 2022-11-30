import { ET, registerET } from "../../../libs/Entity";
import { NumericComponent } from "../common/NumericComponent";
import { CharacterInGameDataComponent } from "./CharacterInGameDataComponent";
import { TCharacter } from "./TCharacter";

@registerET()
export class CharacterDataComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

    get NumericComp() {
        return this.GetComponentByName<NumericComponent>("NumericComponent");
    }
    get InGameDataComp() {
        return this.GetComponentByName<CharacterInGameDataComponent>("CharacterInGameDataComponent");
    }

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }

}
