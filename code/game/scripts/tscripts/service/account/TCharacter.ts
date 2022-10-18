import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ET, serializeETProps } from "../../rules/Entity/Entity";
import { BagComponent } from "../bag/BagComponent";
import { CharacterDataComponent } from "./CharacterDataComponent";
import { SeedRandomComponent } from "../common/SeedRandomComponent";
import { CharacterSteamComponent } from "./CharacterSteamComponent";
import { CharacterShopComponent } from "../shop/CharacterShopComponent";
import { CharacterTaskComponent } from "../task/CharacterTaskComponent";
import { CharacterMailComponent } from "../mail/CharacterMailComponent";
import { CharacterActivityComponent } from "../activity/CharacterActivityComponent";
import { HeroManageComponent } from "../hero/HeroManageComponent";
import { CharacterDrawTreasureComponent } from "../draw/CharacterDrawTreasureComponent";
import { CharacterRechargeComponent } from "../recharge/CharacterRechargeComponent";
import { CharacterBuffComponent } from "../buff/CharacterBuffComponent";
import { CharacterTitleComponent } from "../title/CharacterTitleComponent";
import { CharacterAchievementComponent } from "../achievement/CharacterAchievementComponent";
import { CharacterGameRecordComponent } from "../gamerecord/CharacterGameRecordComponent";
import { reloadable } from "../../GameCache";

@reloadable
export class TCharacter extends ET.Component {
    // 玩家服务器playerId,并非游戏内
    @serializeETProps()
    PlayerId: string;
    @serializeETProps()
    Name: string;
    CreateTime: string;
    LastLoginTime: string;
    IsFirstLoginToday: boolean;
    IsFirstLoginWeek: boolean;
    IsFirstLoginSeason: boolean;


    onSerializeToEntity() {
        let PlayerSystem = GameRules.Addon.ETRoot.PlayerSystem();
        let allplayerid = PlayerSystem.GetAllPlayerid();
        for (let playerid of allplayerid) {
            if (this.Name == PlayerSystem.GetSteamID(playerid)) {
                PlayerSystem.GetPlayer(playerid).AddOneComponent(this);
                this.onReload();
                return;
            }
        }
    }
    onReload(): void {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this, true)
    }

    SeedRandomComp() {
        return this.GetComponentByName<SeedRandomComponent>("SeedRandomComponent");
    }
    BagComp() {
        return this.GetComponentByName<BagComponent>("BagComponent");
    }
    DataComp() {
        return this.GetComponentByName<CharacterDataComponent>("CharacterDataComponent");
    }
    SteamComp() {
        return this.GetComponentByName<CharacterSteamComponent>("CharacterSteamComponent");
    }
    ShopComp() {
        return this.GetComponentByName<CharacterShopComponent>("CharacterShopComponent");
    }
    TaskComp() {
        return this.GetComponentByName<CharacterTaskComponent>("CharacterTaskComponent");
    }
    MailComp() {
        return this.GetComponentByName<CharacterMailComponent>("CharacterMailComponent");
    }
    ActivityComp() {
        return this.GetComponentByName<CharacterActivityComponent>("CharacterActivityComponent");
    }
    HeroManageComp() {
        return this.GetComponentByName<HeroManageComponent>("HeroManageComponent");
    }
    DrawTreasureComp() {
        return this.GetComponentByName<CharacterDrawTreasureComponent>("CharacterDrawTreasureComponent");
    }
    RechargeComp() {
        return this.GetComponentByName<CharacterRechargeComponent>("CharacterRechargeComponent");
    }
    BuffComp() {
        return this.GetComponentByName<CharacterBuffComponent>("CharacterBuffComponent");
    }
    TitleComp() {
        return this.GetComponentByName<CharacterTitleComponent>("CharacterTitleComponent");
    }
    AchievementComp() {
        return this.GetComponentByName<CharacterAchievementComponent>("CharacterAchievementComponent");
    }
    GameRecordComp() {
        return this.GetComponentByName<CharacterGameRecordComponent>("CharacterGameRecordComponent");
    }
}
