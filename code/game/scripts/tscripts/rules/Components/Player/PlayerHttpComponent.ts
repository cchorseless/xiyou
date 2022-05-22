import { GameSetting } from "../../../GameSetting";
import { HttpHelper } from "../../../helper/HttpHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { GameProtocol } from "../../../service/GameProtocol";
import { ET, registerET } from "../../Entity/Entity";
import { PlayerState } from "../../System/Player/PlayerState";
import { PlayerSystem } from "../../System/Player/PlayerSystem";
import { md5 } from "../../../lib/md5";

/**玩家数据组件 */
@registerET()
export class PlayerHttpComponent extends ET.Component {
    public TOKEN: string = "";
    public Address = "";
    public Port = "";

    public getAdressPort() {
        return this.Address + ":" + this.Port;
    }

    public async GetAsync(sAction: string, url: string = null) {
        url = url || this.getAdressPort();
        return await HttpHelper.GetRequestAsync(sAction, url, this.TOKEN);
    }
    public async PostAsync(sAction: string, hParams: { [v: string]: any }, url: string = null) {
        url = url || this.getAdressPort();
        return await HttpHelper.PostRequestAsync(sAction, hParams, url, this.TOKEN);
    }

    public async PlayerLogin(playerid: PlayerID) {
        let steamid = PlayerSystem.GetSteamID(playerid);
        let accountid = PlayerSystem.GetAccountID(playerid);
        let loginUrl = GameProtocol.LoginUrl();
        let cbmsg: GameProtocol.H2C_GetAccountLoginKey = await this.PostAsync(GameProtocol.Config.AccountLoginKey, { Account: steamid }, loginUrl);
        let password = "";
        if (cbmsg.Error == 0) {
            password = md5.sumhexa(cbmsg.Key + GameSetting.ServerKey() + accountid);
        } else {
            password = md5.sumhexa(cbmsg.Key + GameSetting.ServerKey()) + accountid;
        }
        let cbmsg1: GameProtocol.R2C_Login = await this.PostAsync(GameProtocol.Config.LoginRealm, { Account: steamid, Password: password }, loginUrl);
        if (cbmsg1.Error == 0) {
            let _adress = cbmsg1.Address.split(":");
            this.Address = "http://" + _adress[0];
            this.Port = _adress[1];
            let cbmsg2: GameProtocol.H2C_CommonResponse = await this.PostAsync(GameProtocol.Config.LoginGate, { UserId: cbmsg1.UserId, Key: cbmsg1.Key });
            if (cbmsg2.Error == 0) {
                this.TOKEN = "Bearer " + cbmsg2.Message;
                this.StartLoopPing();
                return;
            }
        }
        LogHelper.error(`Login error => steamid:${steamid}  playerid:${playerid}`);
    }

    public StartLoopPing() {
        TimerHelper.addTimer(
            10,
            () => {
                if (this.IsDisposed()) {
                    return;
                }
                if (this.TOKEN != null && this.TOKEN.length > 0) {
                    this.GetAsync(GameProtocol.Config.Ping);
                }
                return 10;
            },
            this,
            false
        );
    }
    public onAwake() {
    }
}
