import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterDrawTreasureComponent extends ET.Component {

    private _TreasureTimes: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();
    public get TreasureTimes() {
        return this._TreasureTimes;
    }
    public set TreasureTimes(data: Dictionary<number, number>) {
        this._TreasureTimes.clear();
        for (let _d of data as any) {
            this.TreasureTimes.add(_d[0], _d[1]);
        }
    }



    private _FreeTimeStamp: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get FreeTimeStamp() {
        return this._FreeTimeStamp;
    }
    public set FreeTimeStamp(data: Dictionary<number, string>) {
        this._FreeTimeStamp.clear();
        for (let _d of data as any) {
            this._FreeTimeStamp.add(_d[0], _d[1]);
        }
    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

}
