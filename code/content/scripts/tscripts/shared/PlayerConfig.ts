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



    export enum EProtocol {
        reqApplyPopuLevelUp = "reqApplyPopuLevelUp",
        reqApplyTechLevelUp = "reqApplyTechLevelUp",
    }
}
