export module GameProtocol {
    export class Protocol {
        static readonly AccountLoginKey = "/AccountLoginKey";
        static readonly LoginRealm = "/LoginRealm";
        static readonly LoginGate = "/LoginGate";
        static readonly CreateGameRecord = "/CreateGameRecord";
        static readonly UploadGameRecord = "/UploadGameRecord";
        static readonly RefreshToken = "/RefreshToken";
        static readonly Ping = "/Ping";
        static readonly LoginOut = "/LoginOut";
        static readonly SetServerKey = "/SetServerKey";
        static readonly Buy_ShopItem = "/Buy_ShopItem";
    }

    // export const HTTP_URL = "http://139.196.182.10:8080";
    export const HTTP_URL = "http://127.0.0.1:11199";

    export function LoginUrl() {
        return "http://127.0.0.1:11002";
        // return "http://139.196.182.10:10002";
    }

    /**服务器存的key */
    export enum EGameDataStrDicKey {
        sCourierIDInUse = "sCourierIDInUse",
        sCourierIDInUseFx = "sCourierIDInUseFx"
    }

}
