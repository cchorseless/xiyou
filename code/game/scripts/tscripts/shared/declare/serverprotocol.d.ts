declare interface H2C_CommonResponse {
    RpcId: number;
    Error: number;
    Message: string;
}

declare interface H2C_GetAccountLoginKey {
    RpcId: number;
    Error: number;
    Message: string;
    Key: string;
}

declare interface R2C_Login {
    RpcId: number;
    Error: number;
    Message: string;
    Address: string;
    Key: string;
    GateId: string;
    UserId: string;
}

declare interface G2C_LoginGate {
    RpcId: number;
    Error: number;
    Message: string;
    PlayerId: string;
}


declare interface G2C_Ping {
    RpcId: number;
    Error: number;
    Message: string;
    Time: string;
}