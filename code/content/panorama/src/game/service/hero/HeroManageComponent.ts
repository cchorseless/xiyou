import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";
@registerET()
export class HeroManageComponent extends ET.Component {
    private _HeroUnits: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get HeroUnits() {
        return this._HeroUnits;
    }
    public set HeroUnits(data: Dictionary<number, string>) {
        this._HeroUnits.clear();
        for (let _d of data as any) {
            this._HeroUnits.add(_d[0], _d[1]);
        }
    }

    HeroBanDesign: string[];
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }

}