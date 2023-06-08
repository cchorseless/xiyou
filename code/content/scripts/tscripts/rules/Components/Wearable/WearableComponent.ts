
import { KVHelper } from "../../../helper/KVHelper";
import { ET } from "../../../shared/lib/Entity";
import { WearableConfig } from "../../../shared/WearableConfig";
import { EWearableItem } from "./EWearableItem";

@GReloadable
export class WearableComponent extends ET.Component {
    readonly sHeroName: string;
    readonly replaceParticles: { [k: string]: string[] } = {};
    readonly WearBundleId: string;
    GetHeroConfig() {
        let wearSys = GWearableSystem.GetInstance();
        return wearSys.Allheroes[this.sHeroName];
    }

    onAwake(dotaHeroName: string): void {
        (this.sHeroName as any) = dotaHeroName;
        this.WearDefaults();
    }

    WearDefaults() {
        let Creature = KVHelper.GetUnitData(this.GetDomain<IBaseNpc_Plus>().GetUnitName(), "Creature") || {} as any;
        let wearConfig = Creature.AttachWearables;
        if (wearConfig) {
            for (let k in wearConfig) {
                let v = wearConfig[k];
                if (v.ItemDef) {
                    this.Wear(v.ItemDef, "default");
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
        return KVHelper.KvServerConfig.WearableConfig[sItemDef];
    }
    public Wear(sItemDef: string | number, wearlabel: string, sStyle: string = "0") {
        sItemDef = sItemDef + "";
        let config = this.GetWearConfig(sItemDef);
        if (!config) {
            return;
        }
        let sSlotName = config.itemSlot;
        // if (!this.IsPersona(sSlotName) && sSlotName != "persona_selector") {
        //     return;
        // }
        if (config.prefab == WearableConfig.EWearableType.bundle && config.bundle && config.bundle.length > 0) {
            if (this.WearBundleId == sItemDef) {
                return;
            }
            for (let slot in this.SlotWears) {
                this.TakeOffSlot(slot)
            }
            (this.WearBundleId as any) = sItemDef;
            this.GetDomain<IBaseNpc_Plus>().SetWearableBundle(GToNumber(sItemDef))
            const bundles = config.bundle.split("|");
            for (let sSubItemDef of bundles) {
                this.WearOneItem(sSubItemDef, sStyle, wearlabel);
            }

        }
        else {
            this.WearOneItem(sItemDef, sStyle, wearlabel);
        }
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
    private WearOneItem(sItemDef: string, sStyle: string = "0", wearlabel = "") {
        if (!sItemDef) {
            return;
        }
        let config = this.GetWearConfig(sItemDef);
        if (!config) {
            return;
        }
        let wearitem = this.FindWearItemByItemDef(sItemDef);
        if (wearitem) {
            return
        }
        let type = GGetRegClass<typeof EWearableItem>("EWearableItem");
        wearitem = this.AddChild(type, sItemDef, wearlabel);
        let slot = wearitem.getSlot();
        if (this.SlotWears[slot] == null) {
            this.SlotWears[slot] = [];
        }
        wearitem.dressUp(sStyle);
        if (!this.SlotWears[slot].includes(wearitem.Id)) {
            this.SlotWears[slot].push(wearitem.Id);
        }
        let npc = this.GetDomain<IBaseNpc_Plus>();
        // npc.NotifyWearablesOfModelChange(true);
        // npc.NotifyWearablesOfModelChange(true);
        // npc.ManageModelChanges();
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
                entity.Dispose();
            }
        }
        this.SlotWears[sSlotName] = [];
    }

    //  复制英雄饰品
    public WearCopy(hUnitOrigin: WearableComponent) {
        for (let slotname of Object.keys(hUnitOrigin.SlotWears)) {
            let entity = hUnitOrigin.GetDressWearItem(slotname);
            if (entity) {
                this.Wear(entity.itemDef, entity.wearLabel, entity.style);
            }
        }
    }

    public AddDrawEffect(show = true) {
        let all = this.GetAllDressWearItem().filter((entity) => { return entity.wearLabel != "default" });
        for (let entity of all) {
            if (show) {
                entity.model.RemoveEffects(EntityEffects.EF_NODRAW);
            } else {
                entity.model.AddEffects(EntityEffects.EF_NODRAW);
            }
        }
    }
    // todo
    public AddInvisEffect(noshow = true) {
        let all = this.GetAllDressWearItem().filter((entity) => { return entity.wearLabel != "default" });
        for (let entity of all) {
            if (noshow) {
                entity.model.SetRenderMode(0);
                // entity.model.SetRenderColor(0, 0, 0);
            } else {
                // entity.model.AddEffects(EntityEffects.EF_NODRAW);
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

declare global {
    type IWearableComponent = WearableComponent;
}