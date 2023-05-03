import { EEnum } from "../../Gen/Types";
import { ET, serializeETProps } from "../../lib/Entity";
import { TEquipItem } from "../bag/TItem";
import { THeroUnit } from "../hero/THeroUnit";




@GReloadable
export class HeroEquipComponent extends ET.Component {


    @serializeETProps()
    Equips: string[] = [];
    public get HeroUnit(): THeroUnit { return this.GetParent<THeroUnit>(); }


    GetEntityBySlot(slot: EEnum.EEquipSolt) {
        let instance = this.Equips[slot];
        if (instance) {
            return TEquipItem.GetOneInstanceById(instance);
        }
    }

    IsScepter(itemid: number) {
        let Scepter = this.GetEntityBySlot(EEnum.EEquipSolt.Scepter);
        return Scepter && Scepter.ConfigId == itemid;
    }

    static CheckPlayerIsScepter(playerid: PlayerID, itemid: number) {
        let allheroEquip = HeroEquipComponent.GetGroupInstance(playerid!);
        for (let heroEquip of allheroEquip) {
            if (heroEquip.IsScepter(itemid)) {
                return true;
            }
        }
        return false;
    }


    onSerializeToEntity() {
    }
}
