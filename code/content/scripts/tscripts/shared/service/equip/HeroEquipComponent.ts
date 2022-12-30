import { ET } from "../../lib/Entity";
import { THeroUnit } from "../hero/THeroUnit";


export enum EEquipSolt {

    Weapon = 0,

    Helm = 1,

    Necklace = 2,

    Medal = 3,

    Armor = 4,

    BraceletL = 5,

    BraceletR = 6,

    RingL = 7,

    RingR = 8,

    Belt = 9,

    Amulet = 10,

    Shoes = 11,

    SlotMax = 12
}

@GReloadable
export class HeroEquipComponent extends ET.Component {
    public readonly IsSerializeEntity: boolean = true;

    Equips: string[];
    public get HeroUnit(): THeroUnit { return this.GetParent<THeroUnit>(); }

    onSerializeToEntity() {
    }
}
