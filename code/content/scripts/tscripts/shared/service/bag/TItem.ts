import { JSONConfig } from "../../Gen/JsonConfig";
import { ET } from "../../lib/Entity";


@GReloadable
export class TItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public ConfigId: number;

    public CreateTime: string;

    public ItemCount: number;

    public ItemQuality: number;

    /// <summary>
    /// 是否锁定
    /// </summary>
    public IsLock: boolean;
    public IsValid: boolean;

    public get Config() {
        return JSONConfig.ItemConfig.get(this.ConfigId)
    }

}
