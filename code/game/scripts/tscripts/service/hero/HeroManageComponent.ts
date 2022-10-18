import Dictionary from "../../helper/DataContainerHelper";
import { ET } from "../../rules/Entity/Entity";
import { TCharacter } from "../account/TCharacter";
import { reloadable } from "../../GameCache";

@reloadable
export class HeroManageComponent extends ET.Component {
    private _HeroUnits: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public get HeroUnits() {
        return this._HeroUnits;
    }
    public set HeroUnits(data: Dictionary<number, string>) {
        this._HeroUnits.copyData((data as any)[0], (data as any)[1]);

    }

    HeroBanDesign: string[];
    public Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }
    onReload() {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }
}