import { EEnum } from "../../Gen/Types";
import { ET, serializeETProps } from "../../lib/Entity";
import { TItem } from "../bag/TItem";
import { HeroEquipComponent } from "../equip/HeroEquipComponent";
import { HeroTalentComponent } from "./HeroTalentComponent";



@GReloadable
export class THeroUnit extends ET.Entity {


    @serializeETProps()
    public ConfigId: string;
    @serializeETProps()
    public Level: number = 1;
    @serializeETProps()
    public Exp: number = 0;
    @serializeETProps()
    public TotalExp: number = 0;
    @serializeETProps()
    public BattleScore: number;
    @serializeETProps()
    public SkinConfigId: string;

    private _Skins = new GDictionary<
        string,
        string
    >();
    @serializeETProps()
    public get Skins() {
        return this._Skins;
    }
    public set Skins(data) {
        this._Skins.copy(data);

    }

    private _Equips = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get Equips() {
        return this._Equips;
    }
    public set Equips(data) {
        this._Equips.copy(data);

    }

    public get HeroTalentComp(): HeroTalentComponent {
        return HeroTalentComponent.GetOneInstanceById(this.Id)
    }
    public get HeroEquipComp(): HeroEquipComponent {
        return HeroEquipComponent.GetOneInstanceById(this.Id)
    }

    /**
     * 皮肤是否解锁
     * @param skinid 
     * @returns 
     */
    IsSkinlock(skinid: string | number) {
        if (this.Skins.containsKey(skinid + "")) {
            const time = this.Skins.get(skinid + "");
            if (time == "-1" || GTimerHelper.NowUnix() < GToNumber(time)) {
                return false
            }
        }
        return true
    }

    /**
     * 获取装备
     * @param slot 
     * @returns 
     */
    GetEuqipBySlot(slot: EEnum.EEquipSolt) {
        let instance = this.Equips.get(slot);
        if (instance) {
            return TItem.GetOneInstanceById(instance);
        }
    }



    onSerializeToEntity() {
        this.onReload();
    }
    onReload() {
        this.SyncClient();
    }

}
