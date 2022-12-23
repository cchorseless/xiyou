import { JSONConfig } from "../../../../../../game/scripts/tscripts/shared/Gen/JsonConfig";
import { ET, registerET } from "../../../libs/Entity";
import { BagComponent } from "./BagComponent";

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
    public IsValid: boolean;

    public get BagComp(): BagComponent { return this.GetParent<BagComponent>(); }

    public get Config() {
        return JSONConfig.ItemConfig.get(this.ConfigId)
    }
}
