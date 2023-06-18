import { GameProtocol } from "../../GameProtocol";
import { GameServiceConfig } from "../../GameServiceConfig";
import { ET, serializeETProps } from "../../lib/Entity";
import { GEventHelper } from "../../lib/GEventHelper";
import { NumericComponent } from "../common/NumericComponent";
import { CharacterInGameDataComponent } from "./CharacterInGameDataComponent";


@GReloadable
export class CharacterDataComponent extends ET.Component {
    AllCouriers: string[] = [];

    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
        if (character != null) {
            return character.BelongPlayerid;
        }
        return -1;
    }
    onSerializeToEntity() {
        GTCharacter.GetOneInstance(this.BelongPlayerid).AddOneComponent(this);
        this.onReload();
    }

    onReload(): void {
        this.SyncClient();
        GEventHelper.FireEvent(this.GetType(), null, null, this);
    }
    private _GameRecord = new GDictionary<
        string,
        string
    >();
    @serializeETProps()
    public get GameRecord() {
        return this._GameRecord;
    }
    public set GameRecord(data: IGDictionary<string, string>) {
        this._GameRecord.copy(data);
    }
    getAllCourierNames() {
        const courierNames: string[] = [];
        courierNames.push(GameServiceConfig.DefaultCourier);
        this.AllCouriers.forEach(item => {
            if (!courierNames.includes(item)) {
                courierNames.push(item)
            }
        })
        return courierNames
    }
    getGameRecord(key: GameProtocol.ECharacterGameRecordKey, d: string = ""): string {
        return this.GameRecord.get(key) || d;
    }
    getGameRecordAsNumber(key: GameProtocol.ECharacterGameRecordKey, d: number = 0) {
        const value = this.GameRecord.get(key)
        if (value) {
            return GToNumber(value)
        }
        return d
    }

    getDifficultyChapter() {
        return this.getGameRecordAsNumber(GameProtocol.ECharacterGameRecordKey.iDifficultyMaxChapter, GameServiceConfig.EDifficultyChapter.n1)
    }
    getDifficultyLevel() {
        return this.getGameRecordAsNumber(GameProtocol.ECharacterGameRecordKey.iDifficultyMaxLevel)
    }
    getCourierInUse() {
        return this.getGameRecord(GameProtocol.ECharacterGameRecordKey.sCourierIDInUse, GameServiceConfig.DefaultCourier)
    }
    get NumericComp() {
        return this.GetComponentByName<NumericComponent>("NumericComponent");
    }
    get InGameDataComp() {
        return this.GetComponentByName<CharacterInGameDataComponent>("CharacterInGameDataComponent");
    }

}

declare global {
    type ICharacterDataComponent = CharacterDataComponent;
    var GCharacterDataComponent: typeof CharacterDataComponent;
}
if (_G.GCharacterDataComponent == null) {
    _G.GCharacterDataComponent = CharacterDataComponent;
}