import { BaseItem } from "./Base_Plus";

export class BaseItem_Plus extends BaseItem {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__: string;
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: any;
    /**使用报错提示信息 */
    public errorStr: string;
    GetCustomCastErrorTarget(target: CDOTA_BaseNPC): string {
        return this.errorStr;
    }
    GetCustomCastError() {
        return this.errorStr;
    }
    GetCustomCastErrorLocation(location: Vector): string {
        return this.errorStr;
    }
    /**
     * @client
     * @returns 
     */
    // public GetAbilityTextureName(): string {
    //     // 默认使用dota默认技能ICON
    //     if (this.__IN_DOTA_NAME__) {
    //         return this.__IN_DOTA_NAME__;
    //     }
    //     return super.GetAbilityTextureName();
    //     // let iconpath = ResHelper.GetAbilityTextureReplacement("", this.GetCaster());
    //     // if (iconpath == null) {
    //     //     iconpath = super.GetAbilityTextureName();
    //     // }
    //     // return iconpath;
    // }

}
declare global {
    type IBaseItem_Plus = BaseItem_Plus;
}