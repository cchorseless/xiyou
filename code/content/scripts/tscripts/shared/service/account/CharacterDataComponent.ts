import { GameProtocol } from "../../GameProtocol";
import { GameServiceConfig } from "../../GameServiceConfig";
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
        this.SyncClient(true, true);
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

    // - 获取现在服务器上存的数据玩家装备的线
    GetPlayerCourierInUse() {
        return this.getGameDataStr(GameProtocol.EGameDataStrDicKey.sCourierIDInUse) || GameServiceConfig.DefaultCourier;
    }

    // - 获取玩家正在使用的信使特效
    GetPlayerCourierFxInUse() {
        return this.getGameDataStr(GameProtocol.EGameDataStrDicKey.sCourierIDInUseFx) || "";
    }


    get NumericComp() {
        return this.GetComponentByName<NumericComponent>("NumericComponent");
    }
    get InGameDataComp() {
        return this.GetComponentByName<CharacterInGameDataComponent>("CharacterInGameDataComponent");
    }

}

declare global {
    var GCharacterDataComponent: typeof CharacterDataComponent;
}
if (_G.GCharacterDataComponent == null) {
    _G.GCharacterDataComponent = CharacterDataComponent;
}