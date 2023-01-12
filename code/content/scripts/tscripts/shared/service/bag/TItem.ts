import { JSONConfig } from "../../Gen/JsonConfig";
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

    /// <summary>
    /// 是否锁定
    /// </summary>
    @serializeETProps()
    public IsLock: boolean;
    @serializeETProps()
    public IsValid: boolean;

    public get Config() {
        return JSONConfig.ItemConfig.get(this.ConfigId)!;
    }

}
