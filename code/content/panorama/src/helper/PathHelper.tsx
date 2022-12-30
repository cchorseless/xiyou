import { GameEnum } from "../../../scripts/tscripts/shared/GameEnum";
import { EEnum } from "../../../scripts/tscripts/shared/Gen/Types";


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
            case EEnum.EMoneyType.Gold:
                return `common/money.png`;
            case EEnum.EMoneyType.Wood:
                return `common/wood_png.png`;
            default:
                return "";
        }
    }

    export function getRaretyFrameUrl(str: string) {
        return `rarity/frame_${str.toLowerCase()}.png`
    }

}
