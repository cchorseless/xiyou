import { LogHelper } from "./LogHelper";

export module HttpHelper {
    export function GetRequest(sAction: string, hFunc: (StatusCode: number, Body: string, response: CScriptHTTPResponse) => void = null, address: string, token: string, fTimeout: number = 30) {
        if (address == null || address.length == 0) {
            return;
        }
        // LogHelper.print("http get=>", sAction, address);
        let handle = CreateHTTPRequestScriptVM("GET", address + sAction);
        handle.SetHTTPRequestHeaderValue("Content-Type", "application/json;charset=uft-8");
        handle.SetHTTPRequestHeaderValue("Authorization", token);
        handle.SetHTTPRequestAbsoluteTimeoutMS(fTimeout * 1000);
        handle.Send((response) => {
            // LogHelper.print("http cb=>", sAction, response.StatusCode, response.Body);
            if (hFunc) {
                hFunc(response.StatusCode, response.Body, response);
            }
        });
    }
    export async function GetRequestAsync(sAction: string, address: string, token: string, fTimeout: number = 30) {
        if (address == null || address.length == 0) {
            return;
        }
        // LogHelper.print("http get=>", sAction, address);
        return new Promise<any>((resolve, reject) => {
            let handle = CreateHTTPRequestScriptVM("GET", address + sAction);
            handle.SetHTTPRequestHeaderValue("Content-Type", "application/json;charset=uft-8");
            handle.SetHTTPRequestHeaderValue("Authorization", token);
            handle.SetHTTPRequestAbsoluteTimeoutMS(fTimeout * 1000);
            handle.Send((response) => {
                if (response.StatusCode == 200) {
                    // LogHelper.print("http cb=>", sAction, response.StatusCode, response.Body);
                    resolve(json.decode(response.Body)[0]);
                } else {
                    LogHelper.error("http cb=>", sAction, response.StatusCode);
                    reject(response.Body);
                }
            });
        });
    }

    export function PostRequest(
        sAction: string,
        hParams: { [v: string]: any },
        hFunc: (Body: any, response: CScriptHTTPResponse) => void = null,
        address: string,
        token: string,
        fTimeout: number = 30
    ) {
        if (address == null || address.length == 0) {
            return;
        }
        // LogHelper.print("http post=>", sAction, address, hParams);
        let handle = CreateHTTPRequestScriptVM("POST", address + sAction);
        handle.SetHTTPRequestHeaderValue("Content-Type", "application/json;charset=uft-8");
        handle.SetHTTPRequestHeaderValue("Authorization", token);
        handle.SetHTTPRequestRawPostBody("application/json", json.encode(hParams));
        handle.SetHTTPRequestAbsoluteTimeoutMS(fTimeout * 1000);
        handle.Send((response) => {
            if (response.StatusCode == 200) {
                if (hFunc) {
                    // LogHelper.print("http cb=>", sAction, response.StatusCode, response.Body);
                    hFunc(json.decode(response.Body)[0], response);
                }
            } else {
                LogHelper.error("http cb=>", sAction, response.StatusCode, '-----------');
            }
        });
    }

    export async function PostRequestAsync(sAction: string, hParams: { [v: string]: any }, address: string, token: string, fTimeout: number = 30) {
        if (address == null || address.length == 0) {
            return;
        }
        // LogHelper.print("http post=>", sAction, address, hParams);
        return new Promise<any>((resolve, reject) => {
            let handle = CreateHTTPRequestScriptVM("POST", address + sAction);
            handle.SetHTTPRequestHeaderValue("Content-Type", "application/json;charset=uft-8");
            handle.SetHTTPRequestHeaderValue("Authorization", token);
            handle.SetHTTPRequestRawPostBody("application/json", json.encode(hParams));
            handle.SetHTTPRequestAbsoluteTimeoutMS(fTimeout * 1000);
            handle.Send((response) => {
                if (response.StatusCode == 200) {
                    // LogHelper.print("http cb=>", sAction, response.StatusCode, response.Body);
                    resolve(json.decode(response.Body)[0]);
                } else {
                    LogHelper.error("http cb=>", sAction, response.StatusCode, '-----------');
                    reject(response.Body);
                }
            });
        });
    }
}
