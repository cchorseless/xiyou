import { EEnum } from "../../Gen/Types";
import { ET, serializeETProps } from "../../lib/Entity";
import { THeroUnit } from "../hero/THeroUnit";
import { TEquipItem } from "./TEquipItem";




@GReloadable
export class HeroEquipComponent extends ET.Component {


    @serializeETProps()
    Equips: string[] = [];
    public get HeroUnit(): THeroUnit { return this.GetParent<THeroUnit>(); }


    GetEntityBySlot(slot: EEnum.EEquipSolt): TEquipItem {
        let instance = this.Equips[slot];
        if (instance) {
            return TEquipItem.GetOneInstanceById(instance);
        }
    }

    IsScepter(itemid: number): boolean {
        let Scepter = this.GetEntityBySlot(EEnum.EEquipSolt.Scepter);
        return Scepter && Scepter.ConfigId === itemid;
    }

    onSerializeToEntity() {
    }
}
