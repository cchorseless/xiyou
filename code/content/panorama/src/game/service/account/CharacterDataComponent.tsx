import { GameProtocol } from "../../../../../../game/scripts/tscripts/shared/GameProtocol";
import Dictionary from "../../../helper/DataContainerHelper";
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
    public GameDataStrDic: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();
    public set _GameDataStrDic(data: Dictionary<string, string>) {
        this.GameDataStrDic.copy(data);
    }

    getGameDataStr(key: GameProtocol.EGameDataStrDicKey) {
        return this.GameDataStrDic.get(key)
    }



    get NumericComp() {
        return this.GetComponentByName<NumericComponent>("NumericComponent");
    }
    get InGameDataComp() {
        return this.GetComponentByName<CharacterInGameDataComponent>("CharacterInGameDataComponent");
    }

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }

}
