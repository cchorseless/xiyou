
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";
import { THeroUnit } from "./THeroUnit";


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
    onReload() {
        this.SyncClient(true);
    }


    GetHeroUnit(id: string) {
        let config = GJSONConfig.BuildingLevelUpConfig.get(id);
        if (config !== null) {
            let heroUnits = THeroUnit.GetGroupInstance(this.BelongPlayerid);
            return heroUnits.find((hero) => { return hero.BindHeroName() == id })
        }
    }
}