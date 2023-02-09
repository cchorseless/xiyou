import { KV_Abilitys, KV_DATA, KV_Items, KV_Units } from "./KVData";


const config = {
    KVDATA: KV_DATA,
    KV_Abilitys: Object.assign(KV_Abilitys, KV_DATA.dota_abilities),
    KV_Items: Object.assign(KV_Items, KV_DATA.dota_items),
    KV_Units: KV_Units
};
for (const k in config) {
    (GameUI.CustomUIConfig() as any)[k] = (config as any)[k];
}

