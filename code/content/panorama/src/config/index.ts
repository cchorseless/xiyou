import { KV_Abilitys, KV_DATA, KV_Items, KV_Units } from "./KVData";
const config = { KVDATA: KV_DATA, KV_Abilitys: KV_Abilitys, KV_Items: KV_Items, KV_Units: KV_Units };
GameUI.CustomUIConfig = () => {
    return config
};

