import { CharacterDataComponent } from "./account/CharacterDataComponent";
import { CharacterInGameDataComponent } from "./account/CharacterInGameDataComponent";
import { CharacterSteamComponent } from "./account/CharacterSteamComponent";
import { CharacterSteamDigestItem } from "./account/CharacterSteamDigestItem";
import { TCharacter } from "./account/TCharacter";
import { CharacterAchievementComponent } from "./achievement/CharacterAchievementComponent";
import { TCharacterAchievementItem } from "./achievement/TCharacterAchievementItem";
import { CharacterActivityComponent } from "./activity/CharacterActivityComponent";
import { ServerZoneActivityComponent } from "./activity/ServerZoneActivityComponent";
import { TActivity } from "./activity/TActivity";
import { TActivityBattlePass } from "./activity/TActivityBattlePass";
import { TActivityBattlePassData } from "./activity/TActivityBattlePassData";
import { TActivityDailyOnlinePrize } from "./activity/TActivityDailyOnlinePrize";
import { TActivityDailyOnlinePrizeData } from "./activity/TActivityDailyOnlinePrizeData";
import { TActivityData } from "./activity/TActivityData";
import { TActivityGiftCommond } from "./activity/TActivityGiftCommond";
import { TActivityGiftCommondData } from "./activity/TActivityGiftCommondData";
import { TActivityGiftCommondItem } from "./activity/TActivityGiftCommondItem";
import { TActivityHeroRecordLevel } from "./activity/TActivityHeroRecordLevel";
import { TActivityHeroRecordLevelData } from "./activity/TActivityHeroRecordLevelData";
import { TActivityInvestMetaStone } from "./activity/TActivityInvestMetaStone";
import { TActivityInvestMetaStoneData } from "./activity/TActivityInvestMetaStoneData";
import { TActivityMemberShip } from "./activity/TActivityMemberShip";
import { TActivityMemberShipData } from "./activity/TActivityMemberShipData";
import { TActivityMentorshipApplyForItem } from "./activity/TActivityMentorshipApplyForItem";
import { TActivityMentorshipTree } from "./activity/TActivityMentorshipTree";
import { TActivityMentorshipTreeData } from "./activity/TActivityMentorshipTreeData";
import { TActivityMonthLogin } from "./activity/TActivityMonthLogin";
import { TActivityMonthLoginData } from "./activity/TActivityMonthLoginData";
import { TActivitySevenDayLogin } from "./activity/TActivitySevenDayLogin";
import { TActivitySevenDayLoginData } from "./activity/TActivitySevenDayLoginData";
import { TActivityTotalGainMetaStone } from "./activity/TActivityTotalGainMetaStone";
import { TActivityTotalGainMetaStoneData } from "./activity/TActivityTotalGainMetaStoneData";
import { TActivityTotalOnlineTime } from "./activity/TActivityTotalOnlineTime";
import { TActivityTotalOnlineTimeData } from "./activity/TActivityTotalOnlineTimeData";
import { TActivityTotalSpendMetaStone } from "./activity/TActivityTotalSpendMetaStone";
import { TActivityTotalSpendMetaStoneData } from "./activity/TActivityTotalSpendMetaStoneData";
import { BagComponent } from "./bag/BagComponent";
import { TItem } from "./bag/TItem";
import { CharacterBattleTeamComponent } from "./battleteam/CharacterBattleTeamComponent";
import { TBattleTeamRecord } from "./battleteam/TBattleTeamRecord";
import { CharacterBuffComponent } from "./buff/CharacterBuffComponent";
import { ServerZoneBuffComponent } from "./buff/ServerZoneBuffComponent";
import { TBuffItem } from "./buff/TBuffItem";
import { GhostEntityComponent } from "./common/GhostEntityComponent";
import { NumericComponent } from "./common/NumericComponent";
import { SeedRandomComponent } from "./common/SeedRandomComponent";
import { CharacterDrawTreasureComponent } from "./draw/CharacterDrawTreasureComponent";
import { HeroEquipComponent } from "./equip/HeroEquipComponent";
import { TEquipItemProp } from "./equip/TEquipItemProp";
import { CharacterGameRecordComponent } from "./gamerecord/CharacterGameRecordComponent";
import { ServerZoneGameRecordComponent } from "./gamerecord/ServerZoneGameRecordComponent";
import { TGameRecordItem } from "./gamerecord/TGameRecordItem";
import { HeroManageComponent } from "./hero/HeroManageComponent";
import { HeroTalentComponent } from "./hero/HeroTalentComponent";
import { THeroBanDesign } from "./hero/THeroBanDesign";
import { THeroUnit } from "./hero/THeroUnit";
import { CharacterMailComponent } from "./mail/CharacterMailComponent";
import { TMail } from "./mail/TMail";
import { CharacterRankComponent } from "./rank/CharacterRankComponent";
import { ServerZoneRankComponent } from "./rank/ServerZoneRankComponent";
import { TRankCommon } from "./rank/TRankCommon";
import { TRankHeroSumBattleScore } from "./rank/TRankHeroSumBattleScore";
import { TRankSeasonBattleSorce } from "./rank/TRankSeasonBattleSorce";
import { TRankSeasonSingleCharpter } from "./rank/TRankSeasonSingleCharpter";
import { TRankSeasonTeamCharpter } from "./rank/TRankSeasonTeamCharpter";
import { TRankSingleData } from "./rank/TRankSingleData";
import { TSeasonCharacterRankData } from "./rank/TSeasonCharacterRankData";
import { TSeasonServerZoneRankData } from "./rank/TSeasonServerZoneRankData";
import { CharacterRechargeComponent } from "./recharge/CharacterRechargeComponent";
import { ServerZoneSeasonComponent } from "./season/ServerZoneSeasonComponent";
import { TServerZoneSeason } from "./season/TServerZoneSeason";
import { TServerZone } from "./serverzone/TServerZone";
import { CharacterShopComponent } from "./shop/CharacterShopComponent";
import { ServerZoneShopComponent } from "./shop/ServerZoneShopComponent";
import { TShopSellItem } from "./shop/TShopSellItem";
import { TShopUnit } from "./shop/TShopUnit";
import { CharacterTaskComponent } from "./task/CharacterTaskComponent";
import { TCharacterTaskItem } from "./task/TCharacterTaskItem";
import { CharacterTitleComponent } from "./title/CharacterTitleComponent";
import { CharacterTitleItem } from "./title/CharacterTitleItem";

[
    // service -----------
    CharacterDataComponent,
    CharacterInGameDataComponent,
    CharacterSteamComponent,
    CharacterSteamDigestItem,
    TCharacter,

    CharacterAchievementComponent,
    TCharacterAchievementItem,

    CharacterActivityComponent,
    ServerZoneActivityComponent,
    TActivity,
    TActivityBattlePass,
    TActivityBattlePassData,
    TActivityDailyOnlinePrize,
    TActivityDailyOnlinePrizeData,
    TActivityData,
    TActivityGiftCommond,
    TActivityGiftCommondData,
    TActivityGiftCommondItem,
    TActivityHeroRecordLevel,
    TActivityHeroRecordLevelData,
    TActivityInvestMetaStone,
    TActivityInvestMetaStoneData,
    TActivityMemberShip,
    TActivityMemberShipData,
    TActivityMentorshipApplyForItem,
    TActivityMentorshipTree,
    TActivityMentorshipTreeData,
    TActivityMonthLogin,
    TActivityMonthLoginData,
    TActivitySevenDayLogin,
    TActivitySevenDayLoginData,
    TActivityTotalGainMetaStone,
    TActivityTotalGainMetaStoneData,
    TActivityTotalOnlineTime,
    TActivityTotalOnlineTimeData,
    TActivityTotalSpendMetaStone,
    TActivityTotalSpendMetaStoneData,

    BagComponent,
    TItem,

    CharacterBuffComponent,
    ServerZoneBuffComponent,
    TBuffItem,

    SeedRandomComponent,
    NumericComponent,
    GhostEntityComponent,

    CharacterDrawTreasureComponent,

    HeroEquipComponent,
    TEquipItemProp,

    CharacterGameRecordComponent,
    ServerZoneGameRecordComponent,
    TGameRecordItem,
    TBattleTeamRecord,
    CharacterBattleTeamComponent,

    HeroManageComponent,
    HeroTalentComponent,
    THeroBanDesign,
    THeroUnit,

    CharacterMailComponent,
    TMail,

    ServerZoneRankComponent,
    TRankCommon,
    TRankHeroSumBattleScore,
    TRankSeasonSingleCharpter,
    TRankSeasonTeamCharpter,
    TRankSingleData,
    TRankSeasonBattleSorce,
    TSeasonServerZoneRankData,
    CharacterRankComponent,
    TSeasonCharacterRankData,



    CharacterRechargeComponent,

    ServerZoneSeasonComponent,
    TServerZoneSeason,

    TServerZone,

    CharacterShopComponent,
    ServerZoneShopComponent,
    TShopSellItem,
    TShopUnit,

    CharacterTaskComponent,
    TCharacterTaskItem,

    CharacterTitleComponent,
    CharacterTitleItem,
];
export class AllServiceEntity {
    static init() {
        GLogHelper.print("register AllServiceEntity");
    }
}
