import { GameSetting } from "../../../GameSetting";
import { HttpHelper } from "../../../helper/HttpHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { FromBase64 } from "../../../lib/Base64";
import { md5 } from "../../../lib/md5";
import { DecompressZlib } from "../../../lib/zlib";
import { GameProtocol } from "../../../shared/GameProtocol";
import { GameServiceConfig } from "../../../shared/GameServiceConfig";
import { ET } from "../../../shared/lib/Entity";

/**玩家数据组件 */
@GReloadable
export class PlayerHttpComponent extends ET.Component {
    public TOKEN: string = "";
    public Address = "";
    public Port = "";
    public ServerPlayerID = "";
    public ReConnectTime = 5;
    public RePingTime = 10;
    public DebugStopPing = false;
    public readonly IsOnline: boolean = false;
    public static readonly GateId: number = 0;
    public static readonly Port: string = "";



    public getAdressPort() {
        if (PlayerHttpComponent.Port == "") {
            const index = RandomInt(0, GameServiceConfig.GatePorts.length - 1);
            (PlayerHttpComponent.Port as any) = GameServiceConfig.GatePorts[index] + "";
        }
        return GameServiceConfig.GetHost() + ":" + PlayerHttpComponent.Port;
    }

    public async GetAsync(sAction: string, url: string = null) {
        url = url || this.getAdressPort();
        return await HttpHelper.GetRequestAsync(sAction, url, this.TOKEN);
    }
    public async PostAsync(sAction: string, hParams: { [v: string]: any }, url: string = null) {
        url = url || this.getAdressPort();
        return await HttpHelper.PostRequestAsync(sAction, hParams, url, this.TOKEN);
    }
    public Post(sAction: string, hParams: { [v: string]: any }, hFunc: (Body: any, response: CScriptHTTPResponse) => void = null, url: string = null) {
        url = url || this.getAdressPort();
        HttpHelper.PostRequest(sAction, hParams, hFunc, url, this.TOKEN);
    }
    // public async PlayerLogin_Old(playerid: PlayerID) {
    //     const accountid = GPlayerEntityRoot.GetAccountID(playerid);
    //     const loginUrl = GameServiceConfig.LoginUrl();
    //     print(`Login begin => steamid:${accountid}  playerid:${playerid} ${loginUrl}`);
    //     let cbmsg: H2C_GetAccountLoginKey = await this.PostAsync(GameProtocol.Protocol.AccountLoginKey, { Account: accountid }, loginUrl);
    //     let password = md5.sumhexa(cbmsg.Key + GameSetting.GetServerKey());;
    //     let cbmsg1: R2C_Login = await this.PostAsync(GameProtocol.Protocol.LoginRealm, { Account: accountid, Password: password, ServerId: 1, GateId: PlayerHttpComponent.GateId }, loginUrl);
    //     if (cbmsg1.Error == 0) {
    //         (PlayerHttpComponent.GateId as any) = cbmsg1.GateId;
    //         let _adress = cbmsg1.Address.split(":");
    //         this.Address = "http://" + _adress[0];
    //         this.Port = _adress[1];
    //         this.ServerPlayerID = cbmsg1.UserId;
    //         let cbmsg2: H2C_CommonResponse = await this.PostAsync(GameProtocol.Protocol.LoginGate, { UserId: cbmsg1.UserId, Key: cbmsg1.Key, ServerId: 1 });
    //         if (cbmsg2.Error == 0) {
    //             this.ReConnectTime = 5;
    //             this.TOKEN = "Bearer " + cbmsg2.Message;
    //             (this.IsOnline as any) = true;
    //             print(`Login success => steamid:${accountid}  playerid:${playerid}`);
    //             this.Ping();
    //             return true;
    //         }
    //     }
    //     else {
    //         print(`Login error => cbmsg: `);
    //         DeepPrintTable(cbmsg1);
    //     }
    //     if (this.ReConnectTime > 0) {
    //         this.ReConnectTime--;
    //         LogHelper.error(`Login ReConnect => steamid:${accountid}  playerid:${playerid}`);
    //         GTimerHelper.AddTimer(2, GHandler.create(this, async () => {
    //             await this.PlayerLogin_Old(playerid);
    //         }));
    //     }
    //     else {
    //         //  重连失败
    //         GGameScene.DefeatPlayer(playerid);
    //     }
    // }
    public async PlayerLogin(playerid: PlayerID) {
        const accountid = GPlayerEntityRoot.GetAccountID(playerid);
        const password = md5.sumhexa(accountid + "@" + GameSetting.GetServerKey());;
        print(`Login begin => steamid:${accountid}  playerid:${playerid} ${this.getAdressPort()}`);
        let cbmsg2: G2C_EasyLoginGate = await this.PostAsync(GameProtocol.Protocol.EasyLoginGate, {
            Account: accountid, Password: password
        });
        if (cbmsg2.Error == 0) {
            this.ServerPlayerID = cbmsg2.PlayerId;
            this.ReConnectTime = 5;
            this.TOKEN = "Bearer " + cbmsg2.Message;
            (this.IsOnline as any) = true;
            print(`Login success => steamid:${accountid}  playerid:${playerid}`);
            this.Ping();
            return true;
        }
        else {
            print(`Login error => cbmsg: ${cbmsg2.Message}`);
            DeepPrintTable(cbmsg2);
        }
        if (this.ReConnectTime > 0) {
            this.ReConnectTime--;
            LogHelper.error(`Login ReConnect => steamid:${accountid}  playerid:${playerid}`);
            GTimerHelper.AddTimer(2, GHandler.create(this, async () => {
                await this.PlayerLogin(playerid);
            }));
        }
        else {
            //  重连失败
            GGameScene.DefeatPlayer(playerid);
        }
    }
    public async PlayerLoginOut() {
        if (this.IsDisposed() || !this.IsOnline) {
            return;
        }
        let cbmsg1: H2C_CommonResponse = await this.GetAsync(GameProtocol.Protocol.LoginOut);
        if (cbmsg1.Error == 0) {
            LogHelper.print(`PlayerLoginOut => ${this.BelongPlayerid}-----------------------`);
            return;
        }
        LogHelper.error(`PlayerLoginOut error -----------------------`);
    }
    public UploadCharacterData(key: string[], v: string[]) {
        if (this.IsDisposed() || !this.IsOnline) {
            return;
        }
        HttpHelper.PostRequest(GameProtocol.Protocol.UploadCharacterData, { Keys: key, Values: v }, (b, c) => {
            let cbmsg1: H2C_CommonResponse = b;
            if (cbmsg1.Error == 0) {
                LogHelper.print(`UploadCharacterData => ${this.BelongPlayerid}-----------------------`);
                return;
            }
            LogHelper.error(`UploadCharacterData error -----------------------`);
        }, this.getAdressPort(), this.TOKEN);
    }

    public async UploadGameRecord(key: string[], v: string[]) {
        if (this.IsDisposed() || !this.IsOnline) {
            return;
        }
        let cbmsg1: H2C_CommonResponse = await this.PostAsync(GameProtocol.Protocol.UploadGameRecord, { Keys: key, Values: v });
        if (cbmsg1.Error == 0) {
            LogHelper.print(`UploadGameRecord => ${this.BelongPlayerid}-----------------------`);
            return;
        }
        LogHelper.error(`UploadGameRecord error -----------------------`);
    }

    public async CreateGameRecord(serverplayerIds: string[]) {
        if (this.IsDisposed() || !this.IsOnline) {
            return;
        }
        let cbmsg1: H2C_CommonResponse = await this.PostAsync(GameProtocol.Protocol.CreateGameRecord, { Players: serverplayerIds });
        if (cbmsg1.Error !== 0) {
            error(`CreateGameRecord error -----------------------`);
        }
        return cbmsg1.Error == 0
    }

    public Ping() {
        if (this.DebugStopPing) {
            GTimerHelper.AddTimer(1, GHandler.create(this, () => {
                this.Ping();
            }));
            return;
        }
        if (this.IsDisposed()) {
            return;
        }
        if (this.TOKEN != null && this.TOKEN.length > 0) {
            HttpHelper.GetRequest(GameProtocol.Protocol.Ping,
                (a, b, r) => {
                    if (a == 200) {
                        if (b && b.length > 0) {
                            this.RePingTime = 10;
                            let msg: G2C_Ping = json.decode(b)[0];
                            if (msg == null) {
                                LogHelper.error("http ping error cant to json =>", b);
                            }
                            if (msg && msg.Message) {
                                // GLogHelper.print("Message length :", msg.Message.length)
                                let msgcb: any[] = json.decode(msg.Message)[0];
                                for (let entitystr of msgcb) {
                                    let _str = entitystr;
                                    try {
                                        if (GameServiceConfig.SyncClientToBase64) {
                                            _str = FromBase64(_str)
                                            if (_str == null || _str == "null" || _str == "nil") {
                                                GLogHelper.error("FromBase64 error: ", entitystr)
                                            }
                                        }
                                        if (GameServiceConfig.SyncClientCompress) {
                                            _str = DecompressZlib(_str)
                                            if (_str == null || _str == "null" || _str == "nil") {
                                                GLogHelper.error("DecompressZlib error: ", entitystr)
                                            }
                                        }
                                        if (typeof _str === "string" && _str !== "null" && _str !== "nil") {
                                            let tmpstr = json.decode(_str)[0];
                                            if (tmpstr == null) {
                                                GLogHelper.error("json.decode error: ", _str, typeof _str)
                                            }
                                            _str = tmpstr;
                                        }
                                        ET.Entity.FromJson(_str);
                                    } catch (e) {
                                        LogHelper.print(entitystr);
                                        LogHelper.error(e);
                                    }
                                }
                            }
                            // 计算服务器的时区
                            if (msg && msg.Time) {
                                TimerHelper.UpdateTimeZoneOffSet(Number(msg.Time))
                            }
                        }
                        this.Ping();
                    } else {
                        this.RePingTime--;
                        if (this.RePingTime <= 0) {
                            (this.IsOnline as any) = false;
                            // 重新登录
                            this.PlayerLogin(this.BelongPlayerid);
                            LogHelper.error("ping error-------------------", a, b);
                        }
                        else {
                            GTimerHelper.AddTimer(2, GHandler.create(this, () => {
                                this.Ping();
                            }));
                        }
                    }
                },
                this.getAdressPort(),
                this.TOKEN
            );
        }
    }


}
