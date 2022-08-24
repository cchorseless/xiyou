import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class CharacterInGameDataComponent extends ET.Component {
    NumericType: number;
    NumericValue: number;
    onSerializeToEntity() {

    }
}
