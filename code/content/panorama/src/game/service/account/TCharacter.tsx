import { LogHelper } from "../../../helper/LogHelper";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerScene } from "../../components/Player/PlayerScene";
import { CharacterAchievementComponent } from "../achievement/CharacterAchievementComponent";
import { CharacterActivityComponent } from "../activity/CharacterActivityComponent";
import { BagComponent } from "../bag/BagComponent";
import { CharacterBuffComponent } from "../buff/CharacterBuffComponent";
import { SeedRandomComponent } from "../common/SeedRandomComponent";
import { CharacterDrawTreasureComponent } from "../draw/CharacterDrawTreasureComponent";
import { CharacterGameRecordComponent } from "../gamerecord/CharacterGameRecordComponent";
import { HeroManageComponent } from "../hero/HeroManageComponent";
import { CharacterMailComponent } from "../mail/CharacterMailComponent";
import { CharacterRechargeComponent } from "../recharge/CharacterRechargeComponent";
import { CharacterShopComponent } from "../shop/CharacterShopComponent";
import { CharacterTaskComponent } from "../task/CharacterTaskComponent";
import { CharacterTitleComponent } from "../title/CharacterTitleComponent";
import { CharacterDataComponent } from "./CharacterDataComponent";
import { CharacterSteamComponent } from "./CharacterSteamComponent";

@registerET()
export class TCharacter extends ET.Component {
    PlayerId: string;
    Name: string;
    onSerializeToEntity() {
        if (this.IsFromLocalNetTable()) {
            PlayerScene.Local.AddOneComponent(this);
        }
    }
    get SeedRandomComp() {
        return this.GetComponentByName<SeedRandomComponent>("SeedRandomComponent");
    }
    get BagComp() {
        return this.GetComponentByName<BagComponent>("BagComponent");
    }
    get DataComp() {
        return this.GetComponentByName<CharacterDataComponent>("CharacterDataComponent");
    }
    get SteamComp() {
        return this.GetComponentByName<CharacterSteamComponent>("CharacterSteamComponent");
    }
    get ShopComp() {
        return this.GetComponentByName<CharacterShopComponent>("CharacterShopComponent");
    }
    get TaskComp() {
        return this.GetComponentByName<CharacterTaskComponent>("CharacterTaskComponent");
    }
    get MailComp() {
        return this.GetComponentByName<CharacterMailComponent>("CharacterMailComponent");
    }
    get ActivityComp() {
        return this.GetComponentByName<CharacterActivityComponent>("CharacterActivityComponent");
    }
    get HeroManageComp() {
        return this.GetComponentByName<HeroManageComponent>("HeroManageComponent");
    }
    get DrawTreasureComp() {
        return this.GetComponentByName<CharacterDrawTreasureComponent>("CharacterDrawTreasureComponent");
    }
    get RechargeComp() {
        return this.GetComponentByName<CharacterRechargeComponent>("CharacterRechargeComponent");
    }
    get BuffComp() {
        return this.GetComponentByName<CharacterBuffComponent>("CharacterBuffComponent");
    }
    get TitleComp() {
        return this.GetComponentByName<CharacterTitleComponent>("CharacterTitleComponent");
    }
    get AchievementComp() {
        return this.GetComponentByName<CharacterAchievementComponent>("CharacterAchievementComponent");
    }
    get GameRecordComp() {
        return this.GetComponentByName<CharacterGameRecordComponent>("CharacterGameRecordComponent");
    }
}
