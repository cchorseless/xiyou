export module PublicBagConfig {
    export const DOTA_ITEM_BAG_MIN = 20;
    export const DOTA_ITEM_BAG_MAX = 50;
    export const CUSTOM_COMBINE_SLOT_MIN = 51;
    export const CUSTOM_COMBINE_SLOT_MAX = 53;
    export const DOTA_ITEM_ARTIFACT_MIN = 54;
    export const DOTA_ITEM_ARTIFACT_MAX = 68;
    export const PUBLIC_ITEM_SLOT_MIN = 69;
    export const PUBLIC_ITEM_SLOT_MAX = 80;
    /**神器最大数量 */
    export const PLAYER_MAX_ARTIFACT_WITH_EXTRA = DOTA_ITEM_ARTIFACT_MAX - DOTA_ITEM_ARTIFACT_MIN + 1;

    export enum EBagItemType {
        COMMON = 1,
        ARTIFACT = 2,

    }


    export enum EPublicShopType {
        COMMON = 1,
        POINT = 2,
        RANDOM = 3,
        CANDY = 4,
    }

}