import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { reloadable } from "../../GameCache";

@reloadable
export class CharacterDrawTreasureComponent extends ET.Component {

    private _TreasureTimes: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();
    public get TreasureTimes() {
        return this._TreasureTimes;
    }
    public set TreasureTimes(data: Dictionary<number, number>) {
        this._TreasureTimes.copyData((data as any)[0], (data as any)[1]);

    }



    private _FreeTimeStamp: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get FreeTimeStamp() {
        return this._FreeTimeStamp;
    }
    public set FreeTimeStamp(data: Dictionary<number, string>) {
        this._FreeTimeStamp.copyData((data as any)[0], (data as any)[1]);

    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character != null) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }
}
