import { GameFunc } from "../../../GameFunc";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { WearableConfig } from "../../System/Wearable/WearableConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { EWearableItem } from "./EWearableItem";

@registerET()
export class WearableComponent extends ET.Component {
    readonly sHeroName: string;
    readonly replaceParticles: { [k: string]: string[] } = {};

    GetHeroConfig() {
        let wearSys = GameRules.Addon.ETRoot.WearableSystem();
        return wearSys.Allheroes[this.sHeroName];
    }

    onAwake(dotaHeroName: string): void {
        (this as any).sHeroName = dotaHeroName;
        if (dotaHeroName == null || dotaHeroName.length == 0) {
            return
        }
        let wearConfig;
        let etroot = this.Domain.ETRoot;
        if (etroot.AsValid<BuildingEntityRoot>("BuildingEntityRoot")) {
            wearConfig = etroot.As<BuildingEntityRoot>().Config().Creature?.AttachWearables;
        }
        else if (etroot.AsValid<EnemyUnitEntityRoot>("EnemyUnitEntityRoot")) {
            wearConfig = etroot.As<EnemyUnitEntityRoot>().Config().Creature?.AttachWearables;
        }
        if (wearConfig) {
            for (let k in wearConfig) {
                let v = wearConfig[k];
                if (v.ItemDef) {
                    this.Wear(v.ItemDef);
                }
            }
        }
        // TimerHelper.addTimer(5, () => {
        //     this.Wear(21182);
        //     // this.Wear(4336);
        //     // this.Wear(4337);
        //     // this.Wear(4338);
        // let domain = this.GetDomain<BaseNpc_Plus>();
        // domain.NotifyWearablesOfModelChange(true)
        // }, this)
        // TimerHelper.addTimer(10, () => {
        //     this.SwitchPersona(true);
        //     // this.Wear(4336);
        //     // this.Wear(4337);
        //     // this.Wear(4338);
        // let domain = this.GetDomain<BaseNpc_Plus>();
        // domain.NotifyWearablesOfModelChange(true)
        // },this)
    }

    WearDefaults(bPersona: boolean) {
        let hHeroInfo = this.GetHeroConfig();
        if (hHeroInfo && hHeroInfo.Slots) {
            for (let sSlotName in hHeroInfo.Slots) {
                let hSlot = hHeroInfo.Slots[sSlotName];
                let _p = false;
                if (bPersona) {
                    _p = this.IsPersona(sSlotName);
                } else {
                    _p = !this.IsPersona(sSlotName);
                }
                if (hSlot && hSlot.DefaultItem && _p) {
                    this.Wear(hSlot.DefaultItem);
                }
            }
        }
    }
    //  是否子槽位 todo
    IsPersona(sSlotName: string) {
        return string.sub(sSlotName, -10) == "_persona_1";
    }
    IsDisplayInLoadout(sSlotName: string) {
        let hHeroInfo = this.GetHeroConfig();
        let heroSlots = hHeroInfo.Slots;
        let Slot = heroSlots[sSlotName];
        if (!Slot || Slot.DisplayInLoadout == 0) {
            return false;
        }
        return true;
    }
    SwitchPersona(bPersona: boolean) {
        // for (let sSlotName in this.Slots) {
        //     this.TakeOffSlot(sSlotName);
        // }
        // this.WearDefaults(bPersona);
    }
    SlotWears: { [slot: string]: string[] } = {}
    public GetWearConfig(sItemDef: string) {
        return KVHelper.KvServerConfig.shipin_config[sItemDef];
    }
    public Wear(sItemDef: string | number, sStyle: string = "0") {
        sItemDef = sItemDef + "";
        let config = this.GetWearConfig(sItemDef);
        if (!config) {
            return;
        }
        let sSlotName = config.item_slot;
        // if (!this.IsPersona(sSlotName) && sSlotName != "persona_selector") {
        //     return;
        // }
        if (config.prefab == WearableConfig.EWearableType.bundle && config.bundle) {
            let bundles = config.bundle.split("|");
            for (let sSubItemDef of bundles) {
                this.WearOneItem(sSubItemDef, sStyle);
            }
            return;
        }
        this.WearOneItem(sItemDef, sStyle);
    }
    public GetDressWearItem(sSlotName: string) {
        if (!this.SlotWears[sSlotName]) {
            return
        }
        let entityids = this.SlotWears[sSlotName];
        for (let entityid of entityids) {
            let entity = this.GetChild<EWearableItem>(entityid);
            if (entity.isDressUp) {
                return entity;
            }
        }
    }
    public GetAllDressWearItem() {
        let r: EWearableItem[] = [];
        for (let sSlotName in this.SlotWears) {
            let entityids = this.SlotWears[sSlotName];
            for (let entityid of entityids) {
                let entity = this.GetChild<EWearableItem>(entityid);
                if (entity.isDressUp) {
                    r.push(entity);
                }
            }
        }
        return r;
    }
    private WearOneItem(sItemDef: string, sStyle: string = "0") {
        if (!sItemDef) {
            return;
        }
        let config = this.GetWearConfig(sItemDef);
        if (!config) {
            return;
        }
        let wearitem = this.FindWearItemByItemDef(sItemDef);
        if (wearitem == null) {
            let type = PrecacheHelper.GetRegClass<typeof EWearableItem>("EWearableItem");
            wearitem = this.AddChild(type, sItemDef);
        }
        let slot = wearitem.getSlot();
        if (this.SlotWears[slot] == null) {
            this.SlotWears[slot] = [];
        }
        wearitem.dressUp(sStyle);
        if (!this.SlotWears[slot].includes(wearitem.Id)) {
            this.SlotWears[slot].push(wearitem.Id);
        }
    }
    public FindWearItemByItemDef(sItemDef: string) {
        if (!sItemDef) {
            return;
        }
        for (let k in this.SlotWears) {
            for (let entityid of this.SlotWears[k]) {
                let entity = this.GetChild<EWearableItem>(entityid);
                if (entity && entity.itemDef == sItemDef) {
                    return entity
                }
            }
        }
    }
    public FindWearItemByModel(modelname: string) {
        if (!modelname) {
            return;
        }
        for (let k in this.SlotWears) {
            for (let entityid of this.SlotWears[k]) {
                let entity = this.GetChild<EWearableItem>(entityid);
                if (entity && entity.model && entity.model.GetModelName() == modelname) {
                    return entity
                }
            }
        }
    }
    //  脱下饰品
    public TakeOffSlot(sSlotName: string) {
        if (!this.SlotWears[sSlotName]) {
            return
        }
        let entityids = this.SlotWears[sSlotName];
        for (let entityid of entityids) {
            let entity = this.GetChild<EWearableItem>(entityid);
            if (entity) {
                entity.takeOff();
            }
        }
    }

    //  复制英雄饰品
    public WearCopy(hUnitOrigin: WearableComponent) {
        for (let slotname of Object.keys(hUnitOrigin.SlotWears)) {
            let entity = hUnitOrigin.GetDressWearItem(slotname);
            if (entity) {
                this.Wear(entity.itemDef, entity.style);
            }
        }
    }

    public GetAbilityTextureReplacement(str: string) {
        let all = this.GetAllDressWearItem();
        for (let entity of all) {
            if (entity.replaceAbilityIcon[str]) {
                return entity.replaceAbilityIcon[str];
            }
        }
        return str;
    }
    public GetSoundReplacement(str: string) {
        let all = this.GetAllDressWearItem();
        for (let entity of all) {
            if (entity.replaceSounds[str]) {
                return entity.replaceSounds[str];
            }
        }
        return str;
    }
    public GetModelReplacement(str: string) {
        let all = this.GetAllDressWearItem();
        for (let entity of all) {
            if (entity.replaceModel[str]) {
                return entity.replaceModel[str];
            }
        }
        return str;
    }
    public GetParticleReplacement(str: string) {
        let all = this.GetAllDressWearItem();
        for (let entity of all) {
            if (entity.replaceParticles[str]) {
                return entity.replaceParticles[str];
            }
        }
        return str;
    }
}
