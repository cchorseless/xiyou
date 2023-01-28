import { KV_Abilitys, KV_DATA, KV_Items, KV_Units } from "./KVData";
const config = { KVDATA: KV_DATA, KV_Abilitys: KV_Abilitys, KV_Items: KV_Items, KV_Units: KV_Units };
// if (GameUI.CustomUIConfig() == null) {
//     GameUI.CustomUIConfig = () => {
//         return {}
//     };
// }
for (const k in config) {
    (GameUI.CustomUIConfig() as any)[k] = (config as any)[k];
}

