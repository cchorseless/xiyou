import { GameSetting } from "../../../GameSetting";
import { HttpHelper } from "../../../helper/HttpHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { GameProtocol } from "../../../service/GameProtocol";
import { ET, registerET } from "../../Entity/Entity";
import { PlayerState } from "../../System/Player/PlayerState";
import { md5 } from "../../../lib/md5";

/**玩家数据组件 */
@registerET()
export class PlayerHttpComponent extends ET.Component {
    public TOKEN: string = "";
    public Address = "";
    public Port = "";
    public ServerPlayerID = "";
    public readonly IsOnline: boolean = false;

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
        let PlayerSystem = GameRules.Addon.ETRoot.PlayerSystem();
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
        let cbmsg1: GameProtocol.R2C_Login = await this.PostAsync(GameProtocol.Config.LoginRealm, { Account: steamid, Password: password, ServerId: 1 }, loginUrl);
        if (cbmsg1.Error == 0) {
            let _adress = cbmsg1.Address.split(":");
            this.Address = "http://" + _adress[0];
            this.Port = _adress[1];
            this.ServerPlayerID = cbmsg1.UserId;
            let cbmsg2: GameProtocol.H2C_CommonResponse = await this.PostAsync(GameProtocol.Config.LoginGate, { UserId: cbmsg1.UserId, Key: cbmsg1.Key, ServerId: 1 });
            if (cbmsg2.Error == 0) {
                this.TOKEN = "Bearer " + cbmsg2.Message;
                (this as any).IsOnline = true;
                LogHelper.print(`Login success => steamid:${steamid}  playerid:${playerid}`);
                this.Ping();
                return;
            }
        }
        LogHelper.error(`Login error => steamid:${steamid}  playerid:${playerid}`);
    }

    public async PlayerLoginOut() {
        if (this.IsDisposed() || !this.IsOnline) {
            return;
        }
        let cbmsg1: GameProtocol.H2C_CommonResponse = await this.GetAsync(GameProtocol.Config.LoginOut);
        if (cbmsg1.Error == 0) {
            let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
            LogHelper.print(`PlayerLoginOut => ${playerid}-----------------------`);
            return;
        }
        LogHelper.error(`PlayerLoginOut error -----------------------`);
    }

    public async UploadGameRecord(key: string[], v: string[]) {
        if (this.IsDisposed() || !this.IsOnline) {
            return;
        }
        let cbmsg1: GameProtocol.H2C_CommonResponse = await this.PostAsync(GameProtocol.Config.UploadGameRecord, { Keys: key, Values: v });
        if (cbmsg1.Error == 0) {
            let playerid = this.Domain.ETRoot.AsPlayer().Playerid;
            LogHelper.print(`UploadGameRecord => ${playerid}-----------------------`);
            return;
        }
        LogHelper.error(`UploadGameRecord error -----------------------`);
    }

    public async CreateGameRecord(serverplayerIds: string[]) {
        if (this.IsDisposed() || !this.IsOnline) {
            return;
        }
        let cbmsg1: GameProtocol.H2C_CommonResponse = await this.PostAsync(GameProtocol.Config.CreateGameRecord, { Players: serverplayerIds });
        if (cbmsg1.Error == 0) {
            return;
        }
        LogHelper.error(`CreateGameRecord error -----------------------`);
    }

    public Ping() {
        if (this.IsDisposed()) {
            return;
        }
        if (this.TOKEN != null && this.TOKEN.length > 0) {
            HttpHelper.GetRequest(
                GameProtocol.Config.Ping,
                (a, b, r) => {
                    if (a == 200) {
                        LogHelper.print("http cb=>", GameProtocol.Config.Ping, a, b);
                        let msg: GameProtocol.G2C_Ping = json.decode(b)[0];
                        if (msg.Message) {
                            let msgcb: any[] = json.decode(msg.Message)[0];
                            for (let entitystr of msgcb) {
                                try {
                                    ET.Entity.FromJson(entitystr);
                                } catch (e) {
                                    LogHelper.error(e);
                                }
                            }
                        }
                        this.Ping();
                    } else {
                        (this as any).IsOnline = false;
                        LogHelper.error("ping error-------------------");
                    }
                },
                this.getAdressPort(),
                this.TOKEN
            );
        }
    }

    public onAwake() {}
}
