import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";
@registerET()
export class HeroManageComponent extends ET.Component {
    public HeroUnits: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();

    public set _HeroUnits(data: Dictionary<number, string>) {
        this.HeroUnits.copy(data);
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