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
}
