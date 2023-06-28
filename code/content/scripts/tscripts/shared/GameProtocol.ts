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

        static readonly UploadCharacterGameRecord = "/UploadCharacterGameRecord";
        // 背包 使用道具
        static readonly Use_BagItem = "/Use_BagItem";
        // 背包 添加道具
        static readonly Add_BagItem = "/Add_BagItem";

        // 商店
        static readonly Buy_ShopItem = "/Buy_ShopItem";

        // 随机敌人
        static readonly DrawEnemy_GetEnemyInfo = "/DrawEnemy_GetEnemyInfo";
        // 上传阵容数据
        static readonly DrawEnemy_UploadEnemyInfo = "/DrawEnemy_UploadEnemyInfo";
        // 上传战斗结果数据
        static readonly DrawEnemy_UploadBattleResult = "/DrawEnemy_UploadBattleResult";
        // 排行榜
        static readonly Rank_CurRankDataInfo = "/Rank_CurRankDataInfo";
        // 获取自己的排行榜数据
        static readonly Rank_CharacterRankDataInfo = "/Rank_CharacterRankDataInfo";
        // 邮件
        static readonly Handle_CharacterMail = "/Handle_CharacterMail";
        // 战令
        static readonly BattlePass_GetPrize = "/BattlePass_GetPrize";
        static readonly GetPrize_TaskPrize = "/GetPrize_TaskPrize";
        static readonly BattlePass_ChargePrize = "/BattlePass_ChargePrize";
        // 档案奖励
        static readonly InfoPass_GetInfoPassPrize = "/InfoPass_GetInfoPassPrize";
        // 活动
        // 七日登录
        static readonly GetPrize_ActivitySevenDayLogin = "/GetPrize_ActivitySevenDayLogin";
        // 每月登录
        static readonly GetPrize_ActivityMonthLogin = "/GetPrize_ActivityMonthLogin";
        // 每月登录累计
        static readonly GetPrize_ActivityMonthTotalLogin = "/GetPrize_ActivityMonthTotalLogin";
        // 礼包码
        static readonly GetPrize_ActivityGiftCommond = "/GetPrize_ActivityGiftCommond";
        // 在线奖励
        static readonly GetPrize_ActivityDailyOnlinePrize = "/GetPrize_ActivityDailyOnlinePrize";
        // 原石投资
        static readonly GetPrize_ActivityInvestMetaStone = "/GetPrize_ActivityInvestMetaStone";
        // 累计充值
        static readonly GetPrize_ActivityTotalGainMetaStone = "/GetPrize_ActivityTotalGainMetaStone";

        // js-clientlua
        static readonly custom_call_get_ability_data = "custom_call_get_ability_data";
        static readonly custom_call_get_unit_data = "custom_call_get_unit_data";
        static readonly custom_call_get_player_data = "custom_call_get_player_data";
        //#region DEBUG
        static readonly req_DebugChangeHostTimescale = "/req_DebugChangeHostTimescale";
        static readonly req_DebugPauseRoundStage = "/req_DebugPauseRoundStage";
        static readonly req_DebugNextRoundStage = "/req_DebugNextRoundStage";
        static readonly req_DebugJumpToRound = "/req_DebugJumpToRound";
        static readonly req_DebugGameOver = "/req_DebugGameOver";
        static readonly req_DebugReload = "/req_DebugReload";
        static readonly req_DebugRestart = "/req_DebugRestart";
        static readonly req_DebugClearAll = "/req_DebugClearAll";
        static readonly req_DebugAddItem = "/req_DebugAddItem";
        static readonly req_DebugAddAbility = "/req_DebugAddAbility";
        static readonly req_DebugAddWearableBundle = "/req_DebugAddWearableBundle";
        static readonly req_DebugAddSect = "/req_DebugAddSect";
        static readonly req_DebugAddHero = "/req_DebugAddHero";
        static readonly req_DebugAddEnemy = "/req_DebugAddEnemy";
        static readonly req_DebugAddDummyTarget = "/req_DebugAddDummyTarget";
        static readonly req_DebugRemoveDummyTarget = "/req_DebugRemoveDummyTarget";
        static readonly req_DebugMakeChessAttack = "/req_DebugMakeChessAttack";
        static readonly req_DebugMakeFullMana = "/req_DebugMakeFullMana";
        static readonly req_DebugRemoveEnemy = "/req_DebugRemoveEnemy";
        static readonly req_DebugAddGold = "/req_DebugAddGold";
        static readonly req_DebugWTF = "/req_DebugWTF";
        static readonly req_DebugKillPlayer = "/req_DebugKillPlayer";
        static readonly req_DebugRemoveAllAbility = "/req_DebugRemoveAllAbility";
        static readonly req_DebugRemoveAllItem = "/req_DebugRemoveAllItem";
        static readonly req_DebugChangeServerPing = "/req_DebugChangeServerPing";
        static readonly req_KEY_DOWN = "/req_KEY_DOWN";
        static readonly req_KEY_UP = "/req_KEY_UP";
        /**添加机器人 */
        static readonly req_addBot = "/req_addBot";
        //#endregion DEBUG
        /**道具锁定 */
        static readonly req_ITEM_LOCK_CHANGE = "req_ITEM_LOCK_CHANGE";
        /**道具拆分 */
        static readonly req_ITEM_DisassembleItem = "req_ITEM_DisassembleItem";
        /**道具位置改变 */
        static readonly req_ITEM_SLOT_CHANGE = "req_ITEM_SLOT_CHANGE";
        /**道具给他人 */
        static readonly req_ITEM_GIVE_NPC = "req_ITEM_GIVE_NPC";
        /**道具仍在地上 */
        static readonly req_ITEM_DROP_POSITION = "req_ITEM_DROP_POSITION";
        /**摄像机环绕 */
        static readonly req_Camera_Yaw_Change = "req_Camera_Yaw_Change";
        /**设置摄像机角度 */
        static readonly push_Camera_Yaw_Change = "push_Camera_Yaw_Change";
        static readonly req_Mouse_Event = "req_Mouse_Event";
        static readonly req_Mouse_Position = "req_Mouse_Position";
        static readonly req_Update_Setting = "req_Update_Setting";

        // 开局
        static readonly req_LoginGame = "/req_LoginGame";
        static readonly SelectDifficultyChapter = "/SelectDifficultyChapter";
        static readonly SelectDifficultyEndlessLevel = "/SelectDifficultyEndlessLevel";
        static readonly SelectCourier = "/SelectCourier";
        static readonly SelectReady = "/SelectReady";

        static readonly push_PlayerGameEnd = "/push_PlayerGameEnd";
        static readonly push_GameEndResult = "/push_GameEndResult";
        // 公共背包
        static readonly req_BuyPublicBagItem = "/req_BuyPublicBagItem";
        static readonly req_SetBuyItem2Bag = "/req_SetBuyItem2Bag";
        static readonly req_sellAllItem = "/req_sellAllItem";
        static readonly req_sellOneItem = "/req_sellOneItem";
        // 移动物品
        static readonly req_MoveItem = "/req_MoveItem";





    }

    export const enum ERankType {
        /// <summary>
        /// 赛季天梯积分排行榜
        /// </summary>
        SeasonBattleSorceRank = 1,
        HeroSumBattleSorceRank = 2,
        SeasonSingleCharpterRank = 4,
        SeasonTeamCharpterRank = 8,
    }

    export const enum EMailHandleType {

        MailRead = 1,
        MailGetItem = 2,
        MailDelete = 3,
    }
    export const enum EItemPrizeState {
        CanGet = 1,
        CanNotGet = 2,
        HadGet = 4,
        OutOfDate = 8,
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
