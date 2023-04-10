export module PublicBagConfig {
    export const DOTA_ITEM_BAG_MIN = 35;
    export const DOTA_ITEM_BAG_MAX = 50;
    export const CUSTOM_COMBINE_SLOT_MIN = 51;
    export const CUSTOM_COMBINE_SLOT_MAX = 53;
    export const DOTA_ITEM_ARTIFACT_MIN = 54;
    export const DOTA_ITEM_ARTIFACT_MAX = 68;
    export const PUBLIC_ITEM_SLOT_MIN = 69;
    export const PUBLIC_ITEM_SLOT_MAX = 80;
    export const Ground_ITEM_SLOT_MIN = 1000;
    export const Ground_ITEM_SLOT_MAX = 10000;
    /**神器最大数量 */
    export const PLAYER_MAX_ARTIFACT_WITH_EXTRA = DOTA_ITEM_ARTIFACT_MAX - DOTA_ITEM_ARTIFACT_MIN + 1;

    export enum EBagItemType {
        COMMON = "COMMON",
        ARTIFACT = "ARTIFACT",
    }
    export enum EBagSlotType {
        ArtifactSlot = "ArtifactSlot",
        BackPackSlot = "BackPackSlot",
        PublicBagSlot = "PublicBagSlot",
        InventorySlot = "InventorySlot",
        OverHeadSlot = "OverHeadSlot",
        EquipCombineSlot = "EquipCombineSlot",
        GroundSlot = "GroundSlot",
    }

    export enum EPublicShopTypeNumber {
        GoldShop = 1,
        WoodShop = 2,
        RoundShop = 3,
        RandomShop = 4,
    }




    export enum EPublicShopType {
        GoldShop = "GoldShop",
        WoodShop = "WoodShop",
        RoundShop = "RoundShop",
        RandomShop = "RandomShop",
    }

}