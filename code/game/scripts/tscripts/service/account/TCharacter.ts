import { NetTablesHelper } from "../../helper/NetTablesHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { BagComponent } from "../bag/BagComponent";
import { CharacterDataComponent } from "./CharacterDataComponent";
import { SeedRandomComponent } from "../common/SeedRandomComponent";

@registerET()
export class TCharacter extends ET.Component {
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
                PlayerSystem.GetPlayer(playerid).AddOneChild(this);
                this.SyncClient();
                return;
            }
        }
    }

    SyncClient() {
        let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
        let PlayerSystem = GameRules.Addon.ETRoot.PlayerSystem();
        if (!PlayerSystem.GetPlayer(playerid).IsLogin) {
            return;
        }
        TimerHelper.addTimer(
            0.1,
            () => {
                NetTablesHelper.SetETEntity(this, true, playerid);
                NetTablesHelper.SetETEntity(this.BagComp(), false, playerid);
                NetTablesHelper.SetETEntity(this.CharacterDataComp(), false, playerid);
                // NetTablesHelper.SetETEntity(this.SeedRandomComp(), false, playerid);
            },
            this
        );
    }

    BagComp() {
        return this.GetComponentByName<BagComponent>("BagComponent");
    }
    SeedRandomComp() {
        return this.GetComponentByName<SeedRandomComponent>("SeedRandomComponent");
    }
    CharacterDataComp() {
        return this.GetComponentByName<CharacterDataComponent>("CharacterDataComponent");
    }
}
