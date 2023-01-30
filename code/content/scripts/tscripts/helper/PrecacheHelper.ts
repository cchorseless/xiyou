/*
 * @Author: pipixia
 * @Date: 2021-04-26 17:37:24
 * @LastEditors: your name
 * @LastEditTime: 2021-05-20 16:50:28
 * @Description: 预加载资源
 */
import { Assert_Precache } from "../assert/Assert_Precache";
import { KVHelper } from "./KVHelper";

/**资源类型枚举 */
export enum ResType {
    particle_folder = "particle_folder",
    soundfile = "soundfile",
    particle = "particle",
    model = "model",
    Model = "Model",
    PickSound = "PickSound",
    BanSound = "BanSound",
    IdleExpression = "IdleExpression",
    GameSoundsFile = "GameSoundsFile",
    SoundSet = "SoundSet",
    VoiceFile = "VoiceFile",
}
@GReloadable
export class PrecacheHelper {
    /**所有缓存的资源 */
    public static allRes: { [k: string]: Array<string> } = {};

    public static init(context: CScriptPrecacheContext) {
        // 初始化KV文件
        PrecacheHelper.initKVFile();
        // 加载音频文件
        PrecacheHelper.precacheAllSound(context);
        // 加载资源文件
        PrecacheHelper.precachAllResource(context);
        // 加载道具
        PrecacheHelper.precachAllItems();
        // 加载单位
        PrecacheHelper.precachAllUnits();
        // 加载Kv
        PrecacheHelper.precachResByKV(context);
    }

    /**
     * 初始化KV文件
     */
    private static initKVFile() {
        KVHelper.initKVFile();
    }

    private static precacheAllSound(context: CScriptPrecacheContext) {
        // 需要加载音频的资源文件
        Assert_Precache.soundfile.forEach((v) => {
            if (v && v.endsWith("vsndevts")) {
                PrecacheHelper.precachRes(ResType.soundfile, v, context);
            }
        });
    }

    private static precachAllResource(context: CScriptPrecacheContext) {
        Object.keys(Assert_Precache.particle).forEach((k) => {
            PrecacheHelper.precachRes(ResType.particle, (Assert_Precache.particle as any)[k].effect, context);
        });
        // PrecacheHelper.precachRes(ResType.particle_folder, "particles/units/heroes/heroes_underlord", context);
    }
    /**
     * 根据名字加载道具
     * @param context
     */
    private static precachAllItems() {
        [KVHelper.KvServerConfig.building_item_card].forEach((v: any) => {
            for (let itemName in v) {
                // PrecacheItemByNameSync(itemName, PrecacheHelper.context);
            }
            return;
        });
    }

    private static precachAllUnits() {
        [
            // KVHelper.KvServerConfig.enemy_units,
            // KVHelper.KvServerConfig.dota_units,
            // KVHelper.KvServerConfig.building_unit_enemy,
        ].forEach((v: any) => {
            for (let unitName in v) {
                // PrecacheUnitByNameSync(unitName, PrecacheHelper.context);
                // LogHelper.print('precachUnits Finish:', unitName);
            }
        });
    }
    /**
     * 加载资源
     * @param resType
     * @param resPath
     */
    public static precachRes(resType: ResType, resPath: string, context: CScriptPrecacheContext) {
        PrecacheHelper.allRes[resType] = PrecacheHelper.allRes[resType] || [];
        let resdata = PrecacheHelper.allRes[resType];
        if (!resdata.includes(resPath)) {
            PrecacheHelper.allRes[resType].push(resPath);
            PrecacheResource(resType, resPath, context);
        }
    }
    /**KV关键字对应的资源类型 */
    private static KVfile_Key = {
        particle_folder: ResType.particle_folder,
        soundfile: ResType.soundfile,
        particle: ResType.particle,
        model: ResType.model,
        GameSoundsFile: ResType.soundfile,
        VoiceFile: ResType.soundfile,
    };
    /**
     * 处理KV实体的资源加载
     * @param entityKeyValues
     */
    public static precachResByKV(context: CScriptPrecacheContext) {
        [KVHelper.KvServerConfig.building_unit_tower, KVHelper.KvServerConfig.building_unit_enemy].forEach((v: any) => {
            for (let unitName in v) {
                let entityKeyValues = v[unitName];
                // 加载粒子
                for (let k in PrecacheHelper.KVfile_Key) {
                    let v = (PrecacheHelper.KVfile_Key as any)[k];
                    let resUrl = entityKeyValues[k];
                    if (resUrl && typeof resUrl == "string") {
                        PrecacheHelper.precachRes(v, resUrl, context);
                    }
                }
            }
        });
    }
}
