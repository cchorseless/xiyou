
import { EventHelper } from "../../helper/EventHelper";
import { DrawConfig } from "../../shared/DrawConfig";
import { ET } from "../../shared/lib/Entity";

@GReloadable
export class DrawSystemComponent extends ET.SingletonComponent {

    UseCardInfo: { [k: string]: number } = {}
    /**卡池单张卡片数量 */
    readonly SingleCardCount = 10;

    RegUseCard(cardname: string, isuse = true) {
        if (isuse) {
            if (this.UseCardInfo[cardname]) {
                this.UseCardInfo[cardname] += 1;
            } else {
                this.UseCardInfo[cardname] = 1;
            }
        } else {
            if (this.UseCardInfo[cardname]) {
                this.UseCardInfo[cardname] -= 1;
            }
        }
    }

    // 抽奖
    Draw(sReservoirName: DrawConfig.EDrawType, iNum: number) {
        let r_arr: string[] = [];
        for (let i = 0; i < iNum; i++) {
            let itemid = this.RandomPoolGroupConfig("" + sReservoirName);
            if (!r_arr.includes(itemid)) {
                r_arr.push(itemid);
            }
            else {
                let tryTimes = 5;
                while (tryTimes > 0) {
                    tryTimes--;
                    if (tryTimes == 0) {
                        r_arr.push(itemid);
                        break;
                    } else {
                        itemid = this.RandomPoolGroupConfig("" + sReservoirName);
                        if (!r_arr.includes(itemid)) {
                            r_arr.push(itemid);
                            break;
                        }
                    }
                }
            }
        }
        return r_arr;
    }
    /**
     * 特殊抽卡 
     * @param poolid 
     * @param iNum 
     */
    SpeDrawCard(poolid: number, iNum: number) {
        let r_arr: string[] = [];
        for (let i = 0; i < iNum; i++) {
            let itemid = this.RandomPoolConfig("" + poolid);
            if (!r_arr.includes(itemid)) {
                r_arr.push(itemid);
            }
            else {
                let tryTimes = 5;
                while (tryTimes > 0) {
                    tryTimes--;
                    if (tryTimes == 0) {
                        r_arr.push(itemid);
                        break;
                    } else {
                        itemid = this.RandomPoolConfig("" + poolid);
                        if (!r_arr.includes(itemid)) {
                            r_arr.push(itemid);
                            break;
                        }
                    }
                }
            }
        }
        return r_arr;
    }
    RandomPoolGroupConfig(str: string): string {
        let _config = GJSONConfig.PoolGroupConfig.get(str);;
        if (_config == null) {
            GLogHelper.error("cant find in pool group : key=> " + str);
            return;
        }
        let r_arr: string[] = [];
        let weight_arr: number[] = [];
        for (let k of _config.PoolGroup) {
            if (k.IsVaild) {
                r_arr.push(k.PoolConfigId);
                weight_arr.push(k.PoolWeight);
            }
        }
        let poolid = GFuncRandom.RandomArrayByWeight(r_arr, weight_arr)[0];
        return this.RandomPoolConfig(poolid);
    }
    RandomPoolConfig(str: string): string {
        let _config = GJSONConfig.PoolConfig.get(str);
        if (_config == null) {
            GLogHelper.error("cant find in pool  : key=> " + str);
            return;
        }
        let r_arr: string[] = [];
        let weight_arr: number[] = [];
        for (let k of _config.PoolInfo) {
            if (k.IsVaild) {
                r_arr.push(k.ItemConfigId);
                weight_arr.push(k.ItemWeight * this.SingleCardCount - (this.UseCardInfo[k.ItemConfigId] || 0));
            }
        }
        return GFuncRandom.RandomArrayByWeight(r_arr, weight_arr)[0];
    }

    public onAwake() {
        this.addEvent();
    }
    public addEvent() {
        /**开局选卡 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.StartCardSelected, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardSelected>) => {
            event.state = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnStartCardSelected(1, event.data.itemName);
        }));
        /**选卡 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.CardSelected, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardSelected>) => {
            event.state = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnSelectCard(event.data.index, event.data.itemName, event.data.b2Public);
        }));
        /**神器 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.DrawArtifactSelected, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardSelected>) => {
            event.state = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnSelectAtrifact(event.data.index, event.data.itemName);
        }));
        /**装备 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.DrawEquipSelected, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardSelected>) => {
            event.state = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnSelectEquip(event.data.index, event.data.itemName);
        }));
        /**锁定 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.LockSelectedCard, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardLocked>) => {
            event.state = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnLockChess(event.data.index, event.data.itemName, event.data.block);
        }));
        /**愿望单 */
        EventHelper.addProtocolEvent(DrawConfig.EProtocol.Add2WishList, GHandler.create(this, (event: CLIENT_DATA<IDrawConfig.ICardWanted>) => {
            event.state = GPlayerEntityRoot.GetOneInstance(event.PlayerID).DrawComp().OnAdd2WishList(event.data.itemName, event.data.isadd);
        }));
    }

    public StartGame() {
        // GTimerHelper.AddTimer(1, GHandler.create(this, () => {
        //     GPlayerEntityRoot.GetAllInstance().forEach((player) => {
        //         player.DrawComp().DrawStartCard();
        //     });
        // }));
    }
}
declare global {
    /**
     * @ServerOnly
     */
    var GDrawSystem: typeof DrawSystemComponent;
}
if (_G.GDrawSystem == undefined) {
    _G.GDrawSystem = DrawSystemComponent;
}