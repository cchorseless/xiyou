import { GameProtocol } from "../../GameProtocol";
import { ET, serializeETProps } from "../../lib/Entity";
import { NumericComponent } from "../common/NumericComponent";
import { CharacterInGameDataComponent } from "./CharacterInGameDataComponent";


@GReloadable
export class CharacterDataComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }

    onReload(): void {
        this.SyncClient();
    }
    private _GameDataStrDic = new GDictionary<
        string,
        string
    >();
    @serializeETProps()
    public get GameDataStrDic() {
        return this._GameDataStrDic;
    }
    public set GameDataStrDic(data: any) {
        this._GameDataStrDic.copy(data);
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

}
