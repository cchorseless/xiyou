import { KVHelper } from "../../helper/KVHelper";
import { ET } from "../../shared/lib/Entity";
import { WearableConfig } from "../../shared/WearableConfig";

@GReloadable
export class WearableSystemComponent extends ET.SingletonComponent {

    readonly Allheroes: { [k: string]: WearableConfig.IHeroInfo } = {};
    readonly Allitems: { [k: string]: WearableConfig.IOneItemInfo } = {}; //  所有饰品信息
    readonly AllitemsModelMap: { [k: string]: number } = {}; //  所有饰品信息
    readonly Allbundles: { [k: string]: number[] } = {}; //  捆绑包
    readonly Allcouriers: { [k: string]: any } = {}; //  信使
    readonly Allwards: { [k: string]: any } = {}; //  守卫
    readonly Allprismatics: { [k: string]: any } = {}; //  棱彩宝石
    readonly PrismaticParticles: { [k: string]: any } = {};
    readonly DefaultPrismatic: { [k: string]: any } = {};
    readonly AllcontrolPoints: { [k: string]: any };

    public onAwake() {
        this.LoadHero();
        this.LoadItem();
    }

    LoadHero() {
        let npc_heroes: { [k: string]: any } = LoadKeyValues("scripts/npc/npc_heroes.txt");
        for (let heroname in npc_heroes) {
            if (heroname != "Version") {
                let hero = npc_heroes[heroname];
                this.Allheroes[heroname] = {};
                this.Allheroes[heroname].Bundles = [];
                this.Allheroes[heroname].Slots = {};
                this.Allheroes[heroname].SlotIndex2Name = {};
                this.Allheroes[heroname].ModelScale = hero.ModelScale;
                let heroSlots = this.Allheroes[heroname].Slots;
                let SlotIndex2Name = this.Allheroes[heroname].SlotIndex2Name;
                if (hero.ItemSlots) {
                    for (let key in hero.ItemSlots) {
                        let Slot: WearableConfig.IItemSlot = hero.ItemSlots[key];
                        let heroSlot: WearableConfig.IItemSlot = {};
                        heroSlot.SlotIndex = Slot.SlotIndex; //  number
                        heroSlot.SlotText = Slot.SlotText;
                        heroSlot.ItemDefs = [];
                        if (Slot.DisplayInLoadout) {
                            heroSlot.DisplayInLoadout = Slot.DisplayInLoadout;
                        }
                        heroSlots[Slot.SlotName] = heroSlot;
                        SlotIndex2Name["" + Slot.SlotIndex] = Slot.SlotName;
                    }
                }
            }
        }
    }
    LoadItem() {
        let items_game: { [k: string]: any } = KVHelper.KvServerConfig.shipin_config;
        let name2itemdef_Map: { [K: string]: number } = {};
        for (let itemDef in items_game) {
            let item = items_game[itemDef];
            let used_by_heroes = item.used_by_heroes;
            if (used_by_heroes == null || type(used_by_heroes) != "table") {
                continue;
            }
            let itemDef_number = tonumber(itemDef);
            if (item.model_player) {
                this.AllitemsModelMap[item.model_player] = itemDef_number;
            }
            let item_slot = item.item_slot;
            if (!item_slot) {
                item_slot = WearableConfig.EWearableType.weapon;
            }
            for (let heroname in used_by_heroes) {
                let activated = used_by_heroes[heroname];
                if (activated != 1) {
                    continue;
                }
                switch (item.prefab) {
                    case WearableConfig.EWearableType.wearable:
                        name2itemdef_Map[item.name] = itemDef_number;
                        let heroSlot = this.Allheroes[heroname].Slots[item_slot];
                        if (heroSlot) {
                            heroSlot.ItemDefs.push(itemDef_number);
                            //  添加款式信息，将用于UI更新
                            if (item.visuals && item.visuals.styles) {
                                if (!heroSlot.styles) {
                                    heroSlot.styles = {};
                                }
                                heroSlot.styles[itemDef] = {};
                                for (let style in item.visuals.styles) {
                                    let style_table = item.visuals.styles[style];
                                    heroSlot.styles[itemDef][style] = {};
                                    heroSlot.styles[itemDef][style].name = style_table.name;
                                    if (style_table.alternate_icon && item.visuals.alternate_icons && item.visuals.alternate_icons[tostring(style_table.alternate_icon)]) {
                                        heroSlot.styles[itemDef][style].icon_path = item.visuals.alternate_icons[tostring(style_table.alternate_icon)].icon_path;
                                    }
                                }
                            } else if (item.visuals && item_slot == "shapeshift") {
                                //  龙骑变身款式
                                if (!heroSlot.styles) {
                                    heroSlot.styles = {};
                                }
                                if (!heroSlot.styles[itemDef]) {
                                    heroSlot.styles[itemDef] = {};
                                    for (let style = 1; style <= 3; style++) {
                                        heroSlot.styles[itemDef][style - 1] = {};
                                        heroSlot.styles[itemDef][style - 1].name = tostring(style);
                                    }
                                }
                            }
                        }
                        break;
                    //  嘲讽
                    case WearableConfig.EWearableType.taunt:
                        item_slot = WearableConfig.EWearableType.taunt;
                        let heroSlot_taunt = this.Allheroes[heroname].Slots[item_slot];
                        if (heroSlot_taunt) {
                            heroSlot_taunt.ItemDefs.push(itemDef_number);
                        }
                        break;
                    //  默认饰品
                    case WearableConfig.EWearableType.default_item:
                        if (this.Allheroes[heroname]) {
                            let heroSlot_default = this.Allheroes[heroname].Slots[item_slot];
                            if (heroSlot_default) {
                                heroSlot_default.DefaultItem = itemDef_number;
                                heroSlot_default.ItemDefs.push(itemDef_number);
                            }
                            if (item_slot == "shapeshift") {
                                //  龙骑变身款式
                                if (!heroSlot_default.styles) {
                                    heroSlot_default.styles = {};
                                }
                                if (!heroSlot_default.styles[itemDef]) {
                                    heroSlot_default.styles[itemDef] = {};
                                    for (let style = 1; style <= 3; style++) {
                                        heroSlot_default.styles[itemDef][style - 1] = {};
                                        heroSlot_default.styles[itemDef][style - 1].name = tostring(style);
                                    }
                                }
                            }
                        } else if (heroname == "all") {
                            for (let hero of Object.values(this.Allheroes)) {
                                let heroSlot_all = hero.Slots[item_slot];
                                if (heroSlot_all) {
                                    heroSlot_all.DefaultItem = itemDef_number;
                                    heroSlot_all.ItemDefs.push(itemDef_number);
                                }
                            }
                        }
                        break;
                    //  捆绑包
                    case WearableConfig.EWearableType.bundle:
                        this.Allheroes[heroname].Bundles.push(itemDef_number);
                        this.Allbundles[itemDef] = [];
                        for (let subItemName in item.bundle) {
                            let subItem_activated = item.bundle[subItemName];
                            if (subItem_activated == 1) {
                                let subItemDef = name2itemdef_Map[subItemName];
                                this.Allbundles[itemDef].push(subItemDef);
                            }
                        }
                        break;
                    //  信使
                    case WearableConfig.EWearableType.courier:
                        this.Allcouriers[itemDef] = {};
                        let item_table = this.Allcouriers[itemDef];
                        //  添加款式信息，将用于UI更新
                        if (item.visuals && item.visuals.styles) {
                            item_table.styles = item_table.styles || {};
                            for (let style in item.visuals.styles) {
                                let style_table = item.visuals.styles[style];
                                item_table.styles[style] = {};
                                item_table.styles[style].name = style_table.name;
                                if (style_table.alternate_icon && item.visuals.alternate_icons && item.visuals.alternate_icons[tostring(style_table.alternate_icon)]) {
                                    item_table.styles[style].icon_path = item.visuals.alternate_icons[tostring(style_table.alternate_icon)].icon_path;
                                }
                            }
                        }
                        break;
                    //  守卫
                    case WearableConfig.EWearableType.ward:
                        this.Allwards[itemDef] = {};
                        let ward_table = this.Allwards[itemDef];
                        //  添加款式信息，将用于UI更新
                        if (item.visuals && item.visuals.styles) {
                            ward_table.styles = ward_table.styles || {};
                            for (let style in item.visuals.styles) {
                                let style_table = item.visuals.styles[style];
                                ward_table.styles[style] = {};
                                ward_table.styles[style].name = style_table.name;
                                if (style_table.alternate_icon && item.visuals.alternate_icons && item.visuals.alternate_icons[tostring(style_table.alternate_icon)]) {
                                    ward_table.styles[style].icon_path = item.visuals.alternate_icons[tostring(style_table.alternate_icon)].icon_path;
                                }
                            }
                        }
                        break;
                }
            }
        }
    }
    LoadOldItem() {
        let items_game: { [k: string]: any } = LoadKeyValues("scripts/items/items_game.txt");
        let _controlPoints = items_game.attribute_controlled_attached_particles;
        let _new_controlPoints = {} as any;
        for (let k in _controlPoints) {
            let _controlPointsInfo = _controlPoints[k] as any;
            if (_controlPointsInfo.system) {
                _new_controlPoints[_controlPointsInfo.system] = _controlPointsInfo;
            }
        }
        (this.AllcontrolPoints as any) = _new_controlPoints;
        let name2itemdef_Map: { [K: string]: number } = {};
        (this.Allitems as any) = items_game.items; //  所有饰品信息
        for (let itemDef in this.Allitems) {
            let item = this.Allitems[itemDef];
            let used_by_heroes = item.used_by_heroes;
            if (used_by_heroes == null || type(used_by_heroes) != "table") {
                continue;
            }
            let itemDef_number = tonumber(itemDef);
            if (item.model_player) {
                this.AllitemsModelMap[item.model_player] = itemDef_number;
            }
            let item_slot = item.item_slot;
            if (!item_slot) {
                item_slot = WearableConfig.EWearableType.weapon;
            }
            for (let heroname in used_by_heroes) {
                let activated = used_by_heroes[heroname];
                if (activated != 1) {
                    continue;
                }
                switch (item.prefab) {
                    case WearableConfig.EWearableType.wearable:
                        name2itemdef_Map[item.name] = itemDef_number;
                        let heroSlot = this.Allheroes[heroname].Slots[item_slot];
                        if (heroSlot) {
                            heroSlot.ItemDefs.push(itemDef_number);
                            //  添加款式信息，将用于UI更新
                            if (item.visuals && item.visuals.styles) {
                                if (!heroSlot.styles) {
                                    heroSlot.styles = {};
                                }
                                heroSlot.styles[itemDef] = {};
                                for (let style in item.visuals.styles) {
                                    let style_table = item.visuals.styles[style];
                                    heroSlot.styles[itemDef][style] = {};
                                    heroSlot.styles[itemDef][style].name = style_table.name;
                                    if (style_table.alternate_icon && item.visuals.alternate_icons && item.visuals.alternate_icons[tostring(style_table.alternate_icon)]) {
                                        heroSlot.styles[itemDef][style].icon_path = item.visuals.alternate_icons[tostring(style_table.alternate_icon)].icon_path;
                                    }
                                }
                            } else if (item.visuals && item_slot == "shapeshift") {
                                //  龙骑变身款式
                                if (!heroSlot.styles) {
                                    heroSlot.styles = {};
                                }
                                if (!heroSlot.styles[itemDef]) {
                                    heroSlot.styles[itemDef] = {};
                                    for (let style = 1; style <= 3; style++) {
                                        heroSlot.styles[itemDef][style - 1] = {};
                                        heroSlot.styles[itemDef][style - 1].name = tostring(style);
                                    }
                                }
                            }
                        }
                        break;
                    //  嘲讽
                    case WearableConfig.EWearableType.taunt:
                        item_slot = WearableConfig.EWearableType.taunt;
                        let heroSlot_taunt = this.Allheroes[heroname].Slots[item_slot];
                        if (heroSlot_taunt) {
                            heroSlot_taunt.ItemDefs.push(itemDef_number);
                        }
                        break;
                    //  默认饰品
                    case WearableConfig.EWearableType.default_item:
                        if (this.Allheroes[heroname]) {
                            let heroSlot_default = this.Allheroes[heroname].Slots[item_slot];
                            if (heroSlot_default) {
                                heroSlot_default.DefaultItem = itemDef_number;
                                heroSlot_default.ItemDefs.push(itemDef_number);
                            }
                            if (item_slot == "shapeshift") {
                                //  龙骑变身款式
                                if (!heroSlot_default.styles) {
                                    heroSlot_default.styles = {};
                                }
                                if (!heroSlot_default.styles[itemDef]) {
                                    heroSlot_default.styles[itemDef] = {};
                                    for (let style = 1; style <= 3; style++) {
                                        heroSlot_default.styles[itemDef][style - 1] = {};
                                        heroSlot_default.styles[itemDef][style - 1].name = tostring(style);
                                    }
                                }
                            }
                        } else if (heroname == "all") {
                            for (let hero of Object.values(this.Allheroes)) {
                                let heroSlot_all = hero.Slots[item_slot];
                                if (heroSlot_all) {
                                    heroSlot_all.DefaultItem = itemDef_number;
                                    heroSlot_all.ItemDefs.push(itemDef_number);
                                }
                            }
                        }
                        break;
                    //  捆绑包
                    case WearableConfig.EWearableType.bundle:
                        this.Allheroes[heroname].Bundles.push(itemDef_number);
                        this.Allbundles[itemDef] = [];
                        for (let subItemName in item.bundle) {
                            let subItem_activated = item.bundle[subItemName];
                            if (subItem_activated == 1) {
                                let subItemDef = name2itemdef_Map[subItemName];
                                this.Allbundles[itemDef].push(subItemDef);
                            }
                        }
                        break;
                    //  信使
                    case WearableConfig.EWearableType.courier:
                        this.Allcouriers[itemDef] = {};
                        let item_table = this.Allcouriers[itemDef];
                        //  添加款式信息，将用于UI更新
                        if (item.visuals && item.visuals.styles) {
                            item_table.styles = item_table.styles || {};
                            for (let style in item.visuals.styles) {
                                let style_table = item.visuals.styles[style];
                                item_table.styles[style] = {};
                                item_table.styles[style].name = style_table.name;
                                if (style_table.alternate_icon && item.visuals.alternate_icons && item.visuals.alternate_icons[tostring(style_table.alternate_icon)]) {
                                    item_table.styles[style].icon_path = item.visuals.alternate_icons[tostring(style_table.alternate_icon)].icon_path;
                                }
                            }
                        }
                        break;
                    //  守卫
                    case WearableConfig.EWearableType.ward:
                        this.Allwards[itemDef] = {};
                        let ward_table = this.Allwards[itemDef];
                        //  添加款式信息，将用于UI更新
                        if (item.visuals && item.visuals.styles) {
                            ward_table.styles = ward_table.styles || {};
                            for (let style in item.visuals.styles) {
                                let style_table = item.visuals.styles[style];
                                ward_table.styles[style] = {};
                                ward_table.styles[style].name = style_table.name;
                                if (style_table.alternate_icon && item.visuals.alternate_icons && item.visuals.alternate_icons[tostring(style_table.alternate_icon)]) {
                                    ward_table.styles[style].icon_path = item.visuals.alternate_icons[tostring(style_table.alternate_icon)].icon_path;
                                }
                            }
                        }
                        break;
                }
            }
        }
        //  棱彩宝石
        for (let color_key in items_game.colors) {
            let color_table = items_game.colors[color_key];
            if (string.sub(color_key, 1, 8) == "unusual_") {
                this.Allprismatics[color_key] = color_table;
            }
        }
    }

    GetItemDefByModelName(model: string) {
        return this.AllitemsModelMap[model];
    }
}
declare global {
    /**
     * @ServerOnly
     */
    var GWearableSystem: typeof WearableSystemComponent;
}
if (_G.GWearableSystem == undefined) {
    _G.GWearableSystem = WearableSystemComponent;
}