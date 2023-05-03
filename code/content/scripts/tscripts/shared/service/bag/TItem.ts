import { ET, serializeETProps } from "../../lib/Entity";


@GReloadable
export class TItem extends ET.Entity {


    @serializeETProps()
    public ConfigId: number;

    @serializeETProps()
    public CreateTime: string;

    @serializeETProps()
    public ItemCount: number;

    @serializeETProps()
    public ItemQuality: number;

    @serializeETProps()
    public CharacterId: string;
    /// <summary>
    /// 是否锁定
    /// </summary>
    @serializeETProps()
    public IsLock: boolean;
    @serializeETProps()
    public IsValid: boolean;

    public get Config() {
        return GJSONConfig.ItemConfig.get(this.ConfigId)!;
    }

    onSerializeToEntity(): void {
        // 新增道具 BelongPlayerid == -1
        let bagcomp = GBagComponent.GetOneInstanceById(this.CharacterId);
        if (this.BelongPlayerid == -1) {
            if (bagcomp && this.Parent == null) {
                bagcomp.addItem(this)
            }
        }
        this.onReload()
    }

    onReload(): void {
        this.SyncClient()
    }

    static GetItemById(entiyid: string): TItem | null {
        let item = TItem.GetOneInstanceById(entiyid);
        if (item == null) {
            item = TEquipItem.GetOneInstanceById(entiyid);;
        }
        return item as TItem
    }


    IsValidItem(): boolean {
        return this.IsValid && this.ItemCount > 0 && this.Config != null
    }

    IsCanUse(): boolean {
        if (this.Config.UseScript == GEEnum.EItemUseScript.None) {
            return false
        }
        return true
    }
}

@GReloadable
export class TMoneyItem extends TItem {

}

@GReloadable
export class TEquipItem extends TItem {
    @serializeETProps()
    public Props: string[];
}