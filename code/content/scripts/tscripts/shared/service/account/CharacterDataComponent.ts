import { GameProtocol } from "../../GameProtocol";
import { ET, serializeETProps } from "../../lib/Entity";
import { GEventHelper } from "../../lib/GEventHelper";
import { NumericComponent } from "../common/NumericComponent";
import { CharacterInGameDataComponent } from "./CharacterInGameDataComponent";


@GReloadable
export class CharacterDataComponent extends ET.Component {
    onGetBelongPlayerid() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
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

    getGameRecord(key: GameProtocol.ECharacterGameRecordKey): string {
        return this.GameRecord.get(key)
    }
    getGameRecordAsNumber(key: GameProtocol.ECharacterGameRecordKey) {
        const value = this.GameRecord.get(key)
        if (value) {
            return Number(value)
        }
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