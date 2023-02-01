export module GameProtocol {
    export class Protocol {
        static readonly AccountLoginKey = "/AccountLoginKey";
        static readonly LoginRealm = "/LoginRealm";
        static readonly LoginGate = "/LoginGate";
        static readonly CreateGameRecord = "/CreateGameRecord";
        static readonly UploadGameRecord = "/UploadGameRecord";
        static readonly RefreshToken = "/RefreshToken";
        static readonly Ping = "/Ping";
        static readonly LoginOut = "/LoginOut";
        static readonly SetServerKey = "/SetServerKey";
        static readonly Buy_ShopItem = "/Buy_ShopItem";
        static readonly UploadCharacterGameRecord = "UploadCharacterGameRecord";
        // debug
        static readonly ChangeHostTimescale = "/ChangeHostTimescale";
        static readonly PauseRoundStage = "/PauseRoundStage";

        // 开局
        static readonly SelectDifficultyChapter = "/SelectDifficultyChapter";
        static readonly SelectDifficultyEndlessLevel = "/SelectDifficultyEndlessLevel";
        static readonly SelectCourier = "/SelectCourier";
        static readonly SelectReady = "/SelectReady";


    }

    // export const HTTP_URL = "http://139.196.182.10:8080";
    export const HTTP_URL = "http://127.0.0.1:11199";

    export function LoginUrl() {
        return "http://127.0.0.1:11002";
        // return "http://139.196.182.10:10002";
    }

    /**服务器存的key */
    export enum ECharacterGameRecordKey {
        /**當前信使 */
        sCourierIDInUse = "sCourierIDInUse",
        /**当前信使特效 */
        sCourierIDInUseFx = "sCourierIDInUseFx",
        /**通关的最大难度章节 */
        iDifficultyMaxChapter = "iDifficultyMaxChapter",
        /**通关的无尽最大难度层数 */
        iDifficultyMaxLevel = "iDifficultyMaxLevel",
    }

}
