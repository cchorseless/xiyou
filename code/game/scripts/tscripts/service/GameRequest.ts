/*
 * @Author: Jaxh
 * @Date: 2021-04-30 15:18:16
 * @LastEditors: your name
 * @LastEditTime: 2021-04-30 15:18:42
 * @Description: file content
 */

import { GameFunc } from "../GameFunc";
import { HttpHelper } from "../helper/HttpHelper";
import { LogHelper } from "../helper/LogHelper";
import { SingletonClass } from "../helper/SingletonHelper";
import { GameProtocol } from "./GameProtocol";

export class GameRequest extends SingletonClass {
    public tEvents: { [v: string]: Array<{ callback: Function; context: Object }> } = {};
    public init() {
        this.tEvents = {};
        // EventHelper.addUIEvent("service_events_req", this.ServiceEventsRequest, this);
    }
    public ServiceEventsRequest(iEventSourceIndex: number, tData: any) {
        let hPlayer = PlayerResource.GetPlayer(tData.PlayerID || -1);
        if (hPlayer == null) return;
        let tEventTable = this.tEvents[tData.event];
        if (tEventTable == null) return;
        // let data: any = json.decode(tData.data) || {};
        // if (data == null) return;
        // data.PlayerID = tData.PlayerID;

        // let result;
        // if (tEventTable.context != null) {
        //     result = tEventTable.callback(tEventTable.context, data)
        // }
        // else {
        //     result = tEventTable.callback(data)
        // }
        // if (!tData._IsServer && type(result) == "table") {
        //     CustomGameEventManager.Send_ServerToPlayer(hPlayer, "service_events_res", {
        //         result: json.encode(result),
        //         queueIndex: tData.queueIndex,
        //     })
        // }
    }
    /**
     * 添加事件
     */
    public addEvent(sEvent: string, func: Function, context: object) {
        if (this.tEvents[sEvent] == null) {
            this.tEvents[sEvent] = [];
        }
        this.tEvents[sEvent].push({ callback: func, context: context });
    }

    public fireServerEvent(sEvent: string, iPlayerID: number, data: any) {
        let tData: any = {};
        tData.event = sEvent;
        tData.PlayerID = iPlayerID;
        tData._IsServer = true;
        tData.data = json.encode(data);
        this.ServiceEventsRequest(-1, tData);
    }

    /**
     *
     * @param key
     * @param name
     * @param token
     * @returns
     */
    public async SendServerKey(label: string, name: string, token: string) {
        if (!token) {
            return;
        }
        await HttpHelper.PostRequestAsync(
            GameProtocol.Config.SetServerKey,
            {
                ServerKey: token,
                Name: name,
                Label: label,
            },
            GameProtocol.HTTP_URL,
            ""
        );
    }

    /**
     *
     * @param error 发送错误日志
     */
    public SendErrorLog(error: any) {
        if (error == null) {
            return;
        }
        // this.HTTPRequest("PUT", 0, { tc: "c2_debug", t: "error", d: error }, null, "http://111.231.89.227:8080/tag");
    }
}
