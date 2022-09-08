export module GameProtocol {
    export class Config {
        static readonly AccountLoginKey = "/AccountLoginKey";
        static readonly LoginRealm = "/LoginRealm";
        static readonly LoginGate = "/LoginGate";
        static readonly CreateGameRecord = "/CreateGameRecord";
        static readonly UploadGameRecord = "/UploadGameRecord";
        static readonly RefreshToken = "/RefreshToken";
        static readonly Ping = "/Ping";
        static readonly LoginOut = "/LoginOut";
        static readonly SetServerKey = "/SetServerKey";
    }

    // export const HTTP_URL = "http://139.196.182.10:8080";
    export const HTTP_URL = "http://127.0.0.1:11199";

    export function LoginUrl() {
        return "http://127.0.0.1:11002";
        // return "http://139.196.182.10:10002";
    }

    export interface H2C_CommonResponse {
        RpcId: number;
        Error: number;
        Message: string;
    }

    export interface H2C_GetAccountLoginKey {
        RpcId: number;
        Error: number;
        Message: string;
        Key: string;
    }

    export interface R2C_Login {
        RpcId: number;
        Error: number;
        Message: string;
        Address: string;
        Key: string;
        GateId: string;
        UserId: string;
    }

    export interface G2C_LoginGate {
        RpcId: number;
        Error: number;
        Message: string;
        PlayerId: string;
    }


    export interface G2C_Ping {
        RpcId: number;
        Error: number;
        Message: string;
        Time: string;
    }
}
