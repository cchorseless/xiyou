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
        static readonly UploadCharacterGameRecord = "/UploadCharacterGameRecord";
        // js-clientlua
        static readonly custom_call_get_ability_data = "custom_call_get_ability_data";
        static readonly custom_call_get_unit_data = "custom_call_get_unit_data";
        static readonly custom_call_get_player_data = "custom_call_get_player_data";
        //#region DEBUG
        static readonly ChangeHostTimescale = "/ChangeHostTimescale";
        static readonly PauseRoundStage = "/PauseRoundStage";
        static readonly NextRoundStage = "/NextRoundStage";
        static readonly req_DebugGameOver = "/req_DebugGameOver";
        static readonly req_DebugReload = "/req_DebugReload";
        static readonly req_DebugRestart = "/req_DebugRestart";
        static readonly req_DebugClearAll = "/req_DebugClearAll";
        static readonly req_DebugAddItem = "/req_DebugAddItem";
        static readonly req_DebugAddAbility = "/req_DebugAddAbility";
        static readonly req_DebugAddSect = "/req_DebugAddSect";
        static readonly req_DebugAddHero = "/req_DebugAddHero";
        static readonly req_DebugAddEnemy = "/req_DebugAddEnemy";
        static readonly req_DebugAddDummyTarget = "/req_DebugAddDummyTarget";
        static readonly req_DebugRemoveDummyTarget = "/req_DebugRemoveDummyTarget";
        static readonly req_DebugMakeChessAttack = "/req_DebugMakeChessAttack";
        static readonly req_DebugAddGold = "/req_DebugAddGold";
        static readonly req_DebugWTF = "/req_DebugWTF";
        static readonly req_DebugRemoveAllAbility = "/req_DebugRemoveAllAbility";
        static readonly req_DebugRemoveAllItem = "/req_DebugRemoveAllItem";
        static readonly req_DebugChangeServerPing = "/req_DebugChangeServerPing";
        static readonly req_KEY_DOWN = "/req_KEY_DOWN";
        static readonly req_KEY_UP = "/req_KEY_UP";
        /**添加机器人 */
        static readonly req_addBot = "/req_addBot";
        //#endregion DEBUG
        /**道具位置改变 */
        static readonly req_ITEM_SLOT_CHANGE = "req_ITEM_SLOT_CHANGE";
        /**道具给他人 */
        static readonly req_ITEM_GIVE_NPC = "req_ITEM_GIVE_NPC";
        /**道具仍在地上 */
        static readonly req_ITEM_DROP_POSITION = "req_ITEM_DROP_POSITION";
        /**摄像机环绕 */
        static readonly req_Camera_Yaw_Change = "req_Camera_Yaw_Change";
        static readonly req_Mouse_Event = "req_Mouse_Event";
        static readonly req_Mouse_Position = "req_Mouse_Position";
        static readonly req_Update_Setting = "req_Update_Setting";

        // 开局
        static readonly req_LoginGame = "/req_LoginGame";
        static readonly SelectDifficultyChapter = "/SelectDifficultyChapter";
        static readonly SelectDifficultyEndlessLevel = "/SelectDifficultyEndlessLevel";
        static readonly SelectCourier = "/SelectCourier";
        static readonly SelectReady = "/SelectReady";

        // 公共背包
        static readonly req_BuyPublicBagItem = "/req_BuyPublicBagItem";
        static readonly req_SetBuyItem2Bag = "/req_SetBuyItem2Bag";
        static readonly req_sellAllItem = "/req_sellAllItem";
        static readonly req_sellOneItem = "/req_sellOneItem";
        // 移动物品
        static readonly req_MoveItem = "/req_MoveItem";





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
