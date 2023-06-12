import { GameServiceConfig } from "../../GameServiceConfig";
import { ET, serializeETProps } from "../../lib/Entity";
import { CharacterAchievementComponent } from "../achievement/CharacterAchievementComponent";
import { CharacterActivityComponent } from "../activity/CharacterActivityComponent";
import { BagComponent } from "../bag/BagComponent";
import { CharacterBattlePassComponent } from "../battlepass/CharacterBattlePassComponent";
import { CharacterBattleTeamComponent } from "../battleteam/CharacterBattleTeamComponent";
import { CharacterBuffComponent } from "../buff/CharacterBuffComponent";
import { SeedRandomComponent } from "../common/SeedRandomComponent";
import { CharacterDrawTreasureComponent } from "../draw/CharacterDrawTreasureComponent";
import { CharacterGameRecordComponent } from "../gamerecord/CharacterGameRecordComponent";
import { HeroManageComponent } from "../hero/HeroManageComponent";
import { CharacterMailComponent } from "../mail/CharacterMailComponent";
import { CharacterRankComponent } from "../rank/CharacterRankComponent";
import { CharacterRechargeComponent } from "../recharge/CharacterRechargeComponent";
import { CharacterShopComponent } from "../shop/CharacterShopComponent";
import { CharacterTitleComponent } from "../title/CharacterTitleComponent";
import { CharacterDataComponent } from "./CharacterDataComponent";
import { CharacterSteamComponent } from "./CharacterSteamComponent";

@GReloadable
export class TCharacter extends ET.Component {
    // 玩家服务器playerId,并非游戏内
    @serializeETProps()
    Int64PlayerId: string;
    /**STEAM 短id */
    @serializeETProps()
    Name: string;
    @serializeETProps()
    VipType = 0;
    @serializeETProps()
    VipEndTimeSpan = "";

    CreateTime: string;
    LastLoginTime: string;
    IsFirstLoginToday: boolean;
    IsFirstLoginWeek: boolean;
    IsFirstLoginSeason: boolean;

    onGetBelongPlayerid() {
        for (let i = 0; i < GameServiceConfig.GAME_MAX_PLAYER; i++) {
            let sPlayerSteamid = PlayerResource.GetSteamAccountID(i as PlayerID) + "";
            if (sPlayerSteamid == this.Name) {
                return i as PlayerID;
            }
        }
        return -1;
    }

    onSerializeToEntity() {
        GGameScene.GetPlayer(this.BelongPlayerid).AddOneComponent(this);
        this.onReload()
    }
    onReload(): void {
        this.SyncClient(true)
    }
    IsVip() {
        if (this.IsVipForever()) { return true }
        const now = GTimerHelper.NowUnix();
        return Number(this.VipEndTimeSpan) >= now;
    }
    IsVipMonth() {
        return this.VipType == 1;
    }
    IsVipSeason() {
        return this.VipType == 2;
    }
    IsVipForever() {
        return this.VipType == 3;
    }

    get SeedRandomComp() {
        return this.GetComponentByName<SeedRandomComponent>("SeedRandomComponent");
    }
    get BagComp() {
        return this.GetComponentByName<BagComponent>("BagComponent")!;
    }
    get DataComp() {
        return this.GetComponentByName<CharacterDataComponent>("CharacterDataComponent")!;
    }
    get SteamComp() {
        return this.GetComponentByName<CharacterSteamComponent>("CharacterSteamComponent")!;
    }
    get ShopComp() {
        return this.GetComponentByName<CharacterShopComponent>("CharacterShopComponent")!;
    }
    get BattlePassComp() {
        return CharacterBattlePassComponent.GetOneInstance(this.BelongPlayerid);
    }
    get MailComp() {
        return CharacterMailComponent.GetOneInstance(this.BelongPlayerid);;
    }
    get ActivityComp() {
        return this.GetComponentByName<CharacterActivityComponent>("CharacterActivityComponent")!;
    }
    get HeroManageComp() {
        return HeroManageComponent.GetOneInstance(this.BelongPlayerid);
    }
    get DrawTreasureComp() {
        return this.GetComponentByName<CharacterDrawTreasureComponent>("CharacterDrawTreasureComponent")!;
    }
    get RechargeComp() {
        return this.GetComponentByName<CharacterRechargeComponent>("CharacterRechargeComponent")!;
    }
    get BuffComp() {
        return this.GetComponentByName<CharacterBuffComponent>("CharacterBuffComponent")!;
    }
    get TitleComp() {
        return this.GetComponentByName<CharacterTitleComponent>("CharacterTitleComponent")!;
    }
    get AchievementComp() {
        return this.GetComponentByName<CharacterAchievementComponent>("CharacterAchievementComponent")!;
    }
    get GameRecordComp() {
        return this.GetComponentByName<CharacterGameRecordComponent>("CharacterGameRecordComponent")!;
    }
    get BattleTeamComp() {
        return this.GetComponentByName<CharacterBattleTeamComponent>("CharacterBattleTeamComponent")!;
    }
    get RankComp() {
        return CharacterRankComponent.GetOneInstance(this.BelongPlayerid);
    }
}

declare global {
    type ITCharacter = TCharacter;
    var GTCharacter: typeof TCharacter;
}
if (_G.GTCharacter == null) {
    _G.GTCharacter = TCharacter;
}