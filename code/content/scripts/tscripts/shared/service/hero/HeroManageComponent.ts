
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";


@GReloadable
export class HeroManageComponent extends ET.Component {
    private _HeroUnits = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get HeroUnits() {
        return this._HeroUnits;
    }
    public set HeroUnits(data) {
        this._HeroUnits.copy(data);

    }

    @serializeETProps()
    HeroBanDesign: string[];
    public Character(): TCharacter { return this.GetParent<TCharacter>(); }
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
    onReload() {
        this.SyncClient();
    }
}