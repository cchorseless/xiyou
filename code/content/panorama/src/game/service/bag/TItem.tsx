import { ET, registerET } from "../../../libs/Entity";

@registerET()
export class TItem extends ET.Entity {
    public ConfigId: number;

    public CreateTime: string;

    public ItemCount: number;

    public ItemQuality: number;

    /// <summary>
    /// 是否锁定
    /// </summary>
    public IsLock: boolean;
}
