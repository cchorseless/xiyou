import { reloadable } from "../../GameCache";
import Dictionary from "../../helper/DataContainerHelper";
import { ET, serializeETProps } from "../../rules/Entity/Entity";
import { GameProtocol } from "../../shared/GameProtocol";
import { NumericComponent } from "../common/NumericComponent";
import { CharacterInGameDataComponent } from "./CharacterInGameDataComponent";
import { TCharacter } from "./TCharacter";


@reloadable
export class CharacterDataComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }

    onReload(): void {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }
    @serializeETProps()
    private _GameDataStrDic: Dictionary<string, string> = new Dictionary<
        string,
        string
    >();
    public get GameDataStrDic() {
        return this._GameDataStrDic;
    }
    public set GameDataStrDic(data: Dictionary<string, string>) {
        this._GameDataStrDic.copyData((data as any)[0], (data as any)[1]);
    }

    getGameDataStr(key: GameProtocol.EGameDataStrDicKey) {
        return this.GameDataStrDic.get(key)
    }


    NumericComp() {
        return this.GetComponentByName<NumericComponent>("NumericComponent");
    }
    InGameDataComp() {
        return this.GetComponentByName<CharacterInGameDataComponent>("CharacterInGameDataComponent");
    }

    public Character(): TCharacter { return this.GetParent<TCharacter>(); }

}
