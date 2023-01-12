
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";


@GReloadable
export class CharacterDrawTreasureComponent extends ET.Component {

    private _TreasureTimes = new GDictionary<
        number,
        number
    >();
    @serializeETProps()
    public get TreasureTimes() {
        return this._TreasureTimes;
    }
    public set TreasureTimes(data) {
        this._TreasureTimes.copy(data);
    }


    private _FreeTimeStamp = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get FreeTimeStamp() {
        return this._FreeTimeStamp;
    }
    public set FreeTimeStamp(data) {
        this._FreeTimeStamp.copy(data);

    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntitySystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.SyncClient();
    }
}
