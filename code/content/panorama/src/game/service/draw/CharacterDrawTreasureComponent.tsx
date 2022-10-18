import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";

@registerET()
export class CharacterDrawTreasureComponent extends ET.Component {

    public TreasureTimes: Dictionary<number, number> = new Dictionary<
        number,
        number
    >();

    public set _TreasureTimes(data: Dictionary<number, number>) {
        this.TreasureTimes.copy(data);
    }



    public FreeTimeStamp: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public set _FreeTimeStamp(data: Dictionary<number, string>) {
        this.FreeTimeStamp.copy(data);
    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

}
