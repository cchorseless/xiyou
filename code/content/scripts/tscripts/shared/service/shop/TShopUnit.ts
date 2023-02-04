
import { ET, ETEntitySystem, serializeETProps } from "../../lib/Entity";
import { TShopSellItem } from "./TShopSellItem";


@GReloadable
export class TShopUnit extends ET.Entity {

    @serializeETProps()
    public ConfigId: number;
    @serializeETProps()
    public IsValid: boolean;
    @serializeETProps()
    public CharacterId: number;
    private _ShopSellItem = new GDictionary<
        number,
        string
    >();
    @serializeETProps()
    public get ShopSellItem() {
        return this._ShopSellItem;
    }
    public set ShopSellItem(data) {
        this._ShopSellItem.copy(data);
    }
    public get Config() {
        return GJSONConfig.ShopConfig.get(this.ConfigId);
    }

    getAllSellItems() {
        let items: TShopSellItem[] = [];
        this.ShopSellItem.forEach((k, v) => {
            let item = ETEntitySystem.GetEntity(v + "TShopSellItem")
            if (item) {
                items.push(item as any);
            }
        });
        items.sort((a, b) => { return a.ConfigId - b.ConfigId })
        return items;
    }

    onReload(): void {
        this.SyncClient()
    }
}

declare global {
    var GTShopUnit: typeof TShopUnit;
}
if (_G.GTShopUnit == null) {
    _G.GTShopUnit = TShopUnit;
}