import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class CharacterInGameDataComponent extends ET.Component {
    NumericType: number;
    NumericValue: number;



    onSerializeToEntity() {

    }
}
