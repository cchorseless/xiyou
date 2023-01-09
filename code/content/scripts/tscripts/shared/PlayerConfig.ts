export module PlayerConfig {
    /**玩家颜色 */
    export const playerColor: [number, number, number][] = [
        [255, 0, 0],
        [0, 46, 197],
        [128, 128, 128],
        [255, 255, 192],
        [288, 192, 64],
        [17, 232, 234],
        [255, 100, 200],
        [255, 156, 156],
        [255, 0, 255],
    ];

    export function colorRGBtoHex(rgb: [number, number, number]) {
        const r = rgb[0];
        const g = rgb[1];
        const b = rgb[2];
        const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }
    /**
     * 玩家颜色
     */
    export function GetPlayerColor(playerid: PlayerID) {
        return colorRGBtoHex(playerColor[playerid])
    }


    export enum EProtocol {
        reqApplyPopuLevelUp = "reqApplyPopuLevelUp",
        reqApplyTechLevelUp = "reqApplyTechLevelUp",
    }
}
