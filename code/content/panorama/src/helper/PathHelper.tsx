

export module PathHelper {

    export function getMoneyIcon(str: number) {
        switch (str) {
            case GEEnum.EMoneyType.Gold:
                return `common/money.png`;
            case GEEnum.EMoneyType.Wood:
                return `common/wood_png.png`;
            default:
                return "";
        }
    }

    export function getRaretyFrameUrl(str: string) {
        return `rarity/frame_${str.toLowerCase()}.png`
    }
    export function getCustomImageUrl(str: string) {
        return `url("file://{images}/custom_game/${str}")`;
    }
    export function getCustomShopItemImageUrl(str: string) {
        return `url("file://{images}/custom_game/shop_items/${str}.png")`;
    }
    export function getItemImageUrl(str: string) {
        return `url("file://{images}/items/${str}")`;
    }



    export function setBgImageUrl(node: React.RefObject<Panel>, str: string) {
        if (node.current == null) {
            return;
        }
        node.current.style.backgroundImage = `url("file://{images}/${str}")`;
    }
    export function setPanelBgImageUrl(panel: Panel, str: string) {
        if (panel && !panel.IsValid()) {
            return;
        }
        panel.style.backgroundImage = `url("file://{images}/${str}")`;
    }
    export function setImagePanelUrl(panel: ImagePanel, str: string) {
        if (panel && !panel.IsValid()) {
            return;
        }
        panel.SetImage(`file://{images}/${str}`);
    }
}
