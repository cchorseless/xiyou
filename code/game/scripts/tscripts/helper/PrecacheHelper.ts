/*
 * @Author: pipixia
 * @Date: 2021-04-26 17:37:24
 * @LastEditors: your name
 * @LastEditTime: 2021-05-20 16:50:28
 * @Description: 预加载资源
 */
import { KVHelper } from "./KVHelper";
import { LogHelper } from "./LogHelper";

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
type p = any;
export class PrecacheHelper {
    /**所有缓存的资源 */
    public static allRes: { [k: string]: Array<string> } = {};

    private static allClassType: { [k: string]: any } = {};

    public static RegClass(cls: any[]) {
        for (let c of cls) {
            PrecacheHelper.allClassType[c.name] = c;
            LogHelper.print("RegClass:", c.name);
        }
    }
    public static GetRegClass<T>(className: string) {
        let r = PrecacheHelper.allClassType[className];
        if (r == null) {
            LogHelper.error("NOT RegClass " + className);
        }
        return r as T;
    }

    public static init(context: CScriptPrecacheContext) {
        // 初始化KV文件
        PrecacheHelper.initKVFile();
        // 加载音频文件
        PrecacheHelper.precacheAllSound(context);
        // 加载资源文件
        PrecacheHelper.precachAllResource();
        // 加载道具
        PrecacheHelper.precachAllItems();
        // 加载单位
        PrecacheHelper.precachAllUnits();
    }

    /**
     * 初始化KV文件
     */
    private static initKVFile() {
        KVHelper.initKVFile();
    }

    private static precacheAllSound(context: CScriptPrecacheContext) {
        // 需要加载音频的资源文件
        [
            // PrecacheHelper.KvConfig.ChargeCounterKv,
        ].forEach((v: any) => {
            [v.GameSoundsFile, v.VoiceFile].forEach((soundPath: string) => {
                if (soundPath && typeof soundPath == "string") {
                    PrecacheHelper.precachRes(ResType.soundfile, soundPath, context);
                }
            });
        });
    }

    private static precachAllResource() {
        [
            // PrecacheHelper.KvConfig.ChargeCounterKv,
        ].forEach((v: any) => {
            [v.precache].forEach((precacheInfo: any) => {
                if (precacheInfo) {
                    for (let sPrecacheMode in precacheInfo) {
                        // PrecacheHelper.precachRes(sPrecacheMode, precacheInfo[sPrecacheMode])
                    }
                }
                return;
            });
            return;
        });
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
        if (!IsClient()) {
            return;
        }
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
    public static precachResByKV(entityKeyValues: CScriptKeyValues, context: CScriptPrecacheContext) {
        // 加载粒子
        for (let k in PrecacheHelper.KVfile_Key) {
            let v = (PrecacheHelper.KVfile_Key as any)[k];
            let res_particle = entityKeyValues.GetValue(k);
            if (res_particle && typeof res_particle == "string") {
                PrecacheHelper.precachRes(v, res_particle, context);
            }
        }
    }
}
