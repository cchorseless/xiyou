/*
 * @Author: Jaxh
 * @Date: 2021-04-30 15:18:16
 * @LastEditors: your name
 * @LastEditTime: 2021-04-30 15:18:42
 * @Description: file content
 */

import { GameFunc } from "../GameFunc";
import { LogHelper } from "../helper/LogHelper";
import { SingletonClass } from "../helper/SingletonHelper"

const Address = "http://111.231.89.227/pay/money_come.php"
const REQUEST_TIME_OUT = 30; //-- 默认请求超时时长（秒）

export class GameRequest extends SingletonClass {

    public tEvents: { [v: string]: Array<{ callback: Function, context: Object }> } = {};
    public init() {
        this.tEvents = {};
        // EventHelper.addUIEvent("service_events_req", this.ServiceEventsRequest, this);
    }

    public ServiceEventsRequest(iEventSourceIndex: number, tData: any) {
        let hPlayer = PlayerResource.GetPlayer(tData.PlayerID || - 1)
        if (hPlayer == null) return
        let tEventTable = this.tEvents[tData.event];
        if (tEventTable == null) return
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
        this.tEvents[sEvent].push({ callback: func, context: context })
    }


    public fireServerEvent(sEvent: string, iPlayerID: number, data: any) {
        let tData: any = {};
        tData.event = sEvent
        tData.PlayerID = iPlayerID
        tData._IsServer = true
        tData.data = json.encode(data)
        this.ServiceEventsRequest(-1, tData)
    }

    /**
     *
     * @param key
     * @param name
     * @param token
     * @returns
     */
    public SendServerKey(key: string, name: string, token: string) {
        if (!token) { return; }
        let get = "key=" + key + "&name=" + name + "&token=" + token;
        this.HTTPRequest("POST", get, {}, null, "http://150.158.198.187:3006/recv.php?");
        // let handle = CreateHTTPRequest("POST", "http://150.158.198.187:3006/recv.php?" + get)
        // handle.SetHTTPRequestHeaderValue("Content-Type", "application/json;charset=UTF-8")
        // handle.Send((response) => {
        //     if (response.StatusCode == 200) {
        //         // LogHelper.print(response.Body)
        //     }
        // })
    }

    /**
     *
     * @param error 发送错误日志
     */
    public SendErrorLog(error: any) {
        if (error == null) { return }
        this.HTTPRequest("PUT", 0, { tc: "c2_debug", t: "error", d: error }, null, "http://111.231.89.227:8080/tag")
    }

    public HTTPRequest(sMethod: "GET" | "POST" | "PUT",
        sAction: string | number | null,
        hParams: { [v: string]: any },
        hFunc: (StatusCode: number, Body: string, response: CScriptHTTPResponse) => void = null,
        address: string = Address,
        fTimeout: number = REQUEST_TIME_OUT) {
        let szURL = '';
        switch (sMethod) {
            case 'GET':
                szURL = address;
                break;
            case 'POST':
                szURL = address + sAction;
                break;
            case 'PUT':
                szURL = address;
                break;
        }
        let handle = CreateHTTPRequestScriptVM(sMethod, szURL)
        handle.SetHTTPRequestHeaderValue("Content-Type", "application/json;charset=uft-8");
        handle.SetHTTPRequestHeaderValue("Authorization", GameFunc.GetServerKey())
        handle.SetHTTPRequestRawPostBody("application/json", json.encode(hParams))
        handle.SetHTTPRequestAbsoluteTimeoutMS((fTimeout) * 1000)
        handle.Send((response) => {
            if (hFunc) {
                hFunc(response.StatusCode, response.Body, response)
            }
        })
    }


    /**
     * 同步发协议通讯
     * @param sMethod
     * @param sAction
     * @param hParams
     * @param fTimeout
     * @returns
     */
    public HTTPRequestSync(sMethod: "GET" | "POST" | "PUT", sAction: string | number | null, hParams: { [v: string]: any }, address: string = Address, fTimeout: number = REQUEST_TIME_OUT) {
        let co = coroutine.running();
        this.HTTPRequest(sMethod, sAction, hParams, (iStatusCode: number, sBody: string, hResponse: CScriptHTTPResponse) => {
            coroutine.resume(co, iStatusCode, sBody, hResponse)
        }, address, fTimeout)
        return coroutine.yield()
    }

}