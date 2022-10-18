import { reloadable } from "../../GameCache";
import { ET } from "../../rules/Entity/Entity";

@reloadable
export class CharacterInGameDataComponent extends ET.Component {
    NumericType: number;
    NumericValue: number;
    onSerializeToEntity() {

    }
}
