import { GameEnum } from "../../../../game/scripts/tscripts/shared/GameEnum";


export module PathHelper {
    export function getRaretyIndex(str: string) {
        switch (str.toUpperCase()) {
            case "R":
                return 3;
            case "SR":
                return 4;
            case "SSR":
                return 5;
            default:
                return 1;
        }
    }
    export function getMoneyIcon(str: number) {
        switch (str) {
            case GameEnum.Item.EItemIndex.Gold:
                return `common/money.png`;
            case GameEnum.Item.EItemIndex.Wood:
                return `common/wood_png.png`;
            default:
                return "";
        }
    }

    export function getRaretyFrameUrl(str: string) {
        return `common/rarity/frame_${str.toUpperCase()}.png`
    }

}
