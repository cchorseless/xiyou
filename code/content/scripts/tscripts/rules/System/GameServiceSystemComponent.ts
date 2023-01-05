import { EventHelper } from "../../helper/EventHelper";
import { HttpHelper } from "../../helper/HttpHelper";
import { GameProtocol } from "../../shared/GameProtocol";
import { GameServiceConfig } from "../../shared/GameServiceConfig";
import { GEventHelper } from "../../shared/lib/GEventHelper";
import { GameServiceSystem } from "../../shared/rules/System/GameServiceSystem";

@GReloadable
export class GameServiceSystemComponent extends GameServiceSystem {

    public onAwake(): void {
        this.addEvent();
        this.SyncClient()
    }

    addEvent() {
        GEventHelper.AddEvent(GCharacterDataComponent.name, GHandler.create(this, (e: ICharacterDataComponent) => {
            const playerid = e.BelongPlayerid;
            this.tPlayerGameSelection[playerid + ""] = this.tPlayerGameSelection[playerid + ""] || ({ Difficulty: {} } as any);
            const data = this.tPlayerGameSelection[playerid + ""];
            data.Difficulty.MaxChapter = e.getGameRecordAsNumber(GameProtocol.ECharacterGameRecordKey.iDifficultyMaxChapter) || GameServiceConfig.EDifficultyChapter.n1;
            data.Difficulty.MaxLevel = e.getGameRecordAsNumber(GameProtocol.ECharacterGameRecordKey.iDifficultyMaxLevel) || 0;
            data.Difficulty.Chapter = data.Difficulty.MaxLevel == GameServiceConfig.EDifficultyChapter.endless ? GameServiceConfig.EDifficultyChapter.endless : (data.Difficulty.MaxLevel + 1);
            data.Difficulty.Level = data.Difficulty.MaxLevel;
            data.Courier = e.getGameRecord(GameProtocol.ECharacterGameRecordKey.sCourierIDInUse) || GameServiceConfig.DefaultCourier;
            this.SyncClient();
        }))
        EventHelper.addProtocolEvent(GameProtocol.Protocol.SelectDifficultyChapter, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const characterdata = this.tPlayerGameSelection[e.PlayerID + ""];
            const charpter = e.data;
            if (characterdata && characterdata.Difficulty.MaxChapter >= charpter) {
                characterdata.Difficulty.Chapter = charpter;
                e.state = true;
                this.SyncClient();
                return
            }
            e.state = false;
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.SelectDifficultyEndlessLevel, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const characterdata = this.tPlayerGameSelection[e.PlayerID + ""];
            const level = e.data;
            if (characterdata && characterdata.Difficulty.MaxLevel >= level) {
                characterdata.Difficulty.Level = level;
                e.state = true;
                this.SyncClient();
                return
            }
            e.state = false;
        }));
        EventHelper.addProtocolEvent(GameProtocol.Protocol.SelectCourier, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const bagcomp = GBagComponent.GetOneInstance(e.PlayerID);
            const allcouriers = bagcomp.getAllCourierNames();
            const characterdata = this.tPlayerGameSelection[e.PlayerID + ""];
            const couriername = e.data;
            if (characterdata && couriername && allcouriers.includes(couriername)) {
                if (characterdata && characterdata.Courier !== couriername) {
                    characterdata.Courier = couriername;
                    e.state = true;
                    this.SyncClient();
                    return
                }
            }
            e.state = false;
        }));

        const hander = GHandler.create(this, async (e: JS_TO_LUA_DATA) => {
            const playeroot = GGameScene.GetPlayer(e.PlayerID);
            if (playeroot) {
                e.data = await playeroot.PlayerHttpComp().PostAsync(e.protocol, e.data);
                if (e.isawait && e.sendClientCB) {
                    e.sendClientCB()
                }
            }
        });
        EventHelper.addProtocolEvent(GameProtocol.Protocol.Buy_ShopItem, hander);

    }

    /**
     *
     * @param key
     * @param name
     * @param token
     * @returns
     */
    public async SendServerKey(label: string, name: string, token: string) {
        if (!token) {
            return;
        }
        await HttpHelper.PostRequestAsync(
            GameProtocol.Protocol.SetServerKey,
            {
                ServerKey: token,
                Name: name,
                Label: label,
            },
            GameProtocol.HTTP_URL,
            ""
        );
    }

    /**
     *
     * @param error 发送错误日志
     */
    public SendErrorLog(error: any) {
        if (error == null) {
            return;
        }
        // this.HTTPRequest("PUT", 0, { tc: "c2_debug", t: "error", d: error }, null, "http://111.231.89.227:8080/tag");
    }

    private getDifficultyConfig(arr: { [k: string]: number }) {
        if (this.DifficultyLevel == 0) {
            return 0;
        }
        let kArr: number[] = [];
        Object.keys(arr).forEach((k) => {
            kArr.push(tonumber(k));
        });
        kArr.sort();
        while (kArr.length > 0) {
            let k = kArr.shift();
            if (this.DifficultyLevel >= k) {
                return arr[("" + k) as "1"];
            }
        }
        return 0;
    }

    getEnemyHPMult() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fHPMult);
    }
    getEnemyArmorPhyMult() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fArmorPhyMult);
    }
    getEnemyArmorMagMult() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fArmorMagMult);
    }
    getEnemyHPAdd() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fHPAdd);
    }
    getEnemyArmorPhyAdd() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fArmorPhyAdd);
    }
    getEnemyArmorMagAdd() {
        return this.getDifficultyConfig(GameServiceConfig.ENDLESS_ENEMEY_fArmorMagAdd);
    }

    OnBindHeroFinish(playerID: PlayerID) {
        this.BindHeroPlayer.push(playerID);
        this.IsAllPlayerBindHero = GPlayerEntityRoot.IsAllBindHeroFinish();
        this.SyncClient();
        GLogHelper.print("OnBindHeroFinish", this.IsAllPlayerBindHero)
        if (this.IsAllPlayerBindHero) {
            GGameScene.StartGame();
        }
    }
    public Sleep(fTime: number) {
        let co = coroutine.running();
        GTimerHelper.AddTimer(fTime, GHandler.create(this, () => {
            coroutine.resume(co);
        }))
        coroutine.yield();
    }
}

declare global {
    /**
     * @ServerOnly
     */
    var GGameServiceSystem: typeof GameServiceSystemComponent;
}
if (_G.GGameServiceSystem == undefined) {
    _G.GGameServiceSystem = GameServiceSystemComponent;
}
