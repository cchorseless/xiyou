
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { GameProtocol } from "../../../shared/GameProtocol";
import { EEnum } from "../../../shared/Gen/Types";
import { PublicBagConfig } from "../../../shared/PublicBagConfig";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { ItemEntityRoot } from "../Item/ItemEntityRoot";

@GReloadable
export class CourierShopComponent extends ET.Component {

    onAwake(...args: any[]): void {
        this.addEvent()
        this.initData();
        this.SyncClient()
    }
    public addEvent() {
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_BuyPublicBagItem,
            GHandler.create(this, (e: JS_TO_LUA_DATA) => {
                if (e.PlayerID != this.BelongPlayerid) { return }
                if (GameRules.IsGamePaused()) {
                    EventHelper.ErrorMessage("dota_hud_error_game_is_paused", this.BelongPlayerid);
                    return
                }
                let shoptype = e.data.shoptype;
                let slot = e.data.slot;
                let entityIndex = e.data.entityIndex;
                if (shoptype == null || slot == null || entityIndex == null) {
                    return
                }
                let hCaster = EntIndexToHScript(entityIndex) as IBaseNpc_Plus;
                if (!IsValid(hCaster) || !hCaster.IsAlive()) {
                    return
                }
                this.BuyItem(hCaster, shoptype, slot);
            }));
        // EventHelper.addProtocolEvent(GameProtocol.Protocol.req_sellAllItem,
        //     GHandler.create(this, (e: JS_TO_LUA_DATA) => {
        //         this.sellAllItem();
        //         this.SyncClient();
        //     }));
    }
    @serializeETProps()
    AllSellItem: { [shoptype: string]: { [slot: string]: IPublicShopItem } } = {};
    @serializeETProps()
    randomLockRound = 10;
    @serializeETProps()
    refreshPrice = 20;
    @serializeETProps()
    iDiscount = 0;

    initData() {
        let Difficulty = GGameServiceSystem.GetInstance().getDifficultyNumberDes();
        let goldshop = GJSONConfig.PublicShopConfig.get(PublicBagConfig.EPublicShopType.GoldShop).sellinfo;
        goldshop.forEach((item, index) => {
            if (item.MinDifficulty > Difficulty) {
                return
            }
            this.addShopItem(PublicBagConfig.EPublicShopType.GoldShop, {
                sItemName: this.parseRandomItem(item.ItemName),
                iSlot: item.ItemSlot,
                iLeftCount: item.ItemLimit,
                iLimit: item.ItemLimit,
                iRoundLock: item.RoundLock,
                iCoinType: EEnum.EMoneyType.Gold,
            })
        });
        let woodshop = GJSONConfig.PublicShopConfig.get(PublicBagConfig.EPublicShopType.WoodShop).sellinfo;
        woodshop.forEach((item, index) => {
            if (item.MinDifficulty > Difficulty) {
                return
            }
            this.addShopItem(PublicBagConfig.EPublicShopType.WoodShop, {
                sItemName: this.parseRandomItem(item.ItemName),
                iSlot: item.ItemSlot,
                iLeftCount: item.ItemLimit,
                iLimit: item.ItemLimit,
                iRoundLock: item.RoundLock,
                iCoinType: EEnum.EMoneyType.Wood,
            })
        });
        this.refreshRoundShopItem();
        this.refreshRandomShopItem();
    }

    refreshRoundShopItem() {
        let Difficulty = GGameServiceSystem.GetInstance().getDifficultyNumberDes();
        let roundindex = GRoundSystem.GetInstance().GetCurrentRoundIndex();
        let roundshop = GJSONConfig.PublicShopConfig.get(PublicBagConfig.EPublicShopType.RoundShop).sellinfo;
        roundshop.forEach((item, index) => {
            if (item.MinDifficulty > Difficulty || item.RoundLock > roundindex) {
                return
            }
            this.addShopItem(PublicBagConfig.EPublicShopType.RoundShop, {
                sItemName: this.parseRandomItem(item.ItemName),
                iSlot: item.ItemSlot,
                iLeftCount: item.ItemLimit,
                iLimit: item.ItemLimit,
                iRoundLock: item.RoundLock,
                iCoinType: this.parseRandomItemCoinType(item.ItemName),
            })
        });
    }


    refreshRandomShopItem() {
        let Difficulty = GGameServiceSystem.GetInstance().getDifficultyNumberDes();
        let roundindex = GRoundSystem.GetInstance().GetCurrentRoundIndex();
        let randomshop = GJSONConfig.PublicShopConfig.get(PublicBagConfig.EPublicShopType.RandomShop).sellinfo;
        randomshop.forEach((item, index) => {
            if (item.MinDifficulty > Difficulty || item.RoundLock > roundindex) {
                return
            }
            this.addShopItem(PublicBagConfig.EPublicShopType.RandomShop, {
                sItemName: this.parseRandomItem(item.ItemName),
                iSlot: item.ItemSlot,
                iLeftCount: item.ItemLimit,
                iLimit: item.ItemLimit,
                iRoundLock: item.RoundLock,
                iCoinType: this.parseRandomItemCoinType(item.ItemName),
            })
        });
    }

    parseRandomItemCoinType(ItemName: string) {
        let config = KVHelper.KvItems[ItemName];
        let CoinType = EEnum.EMoneyType.Gold;
        if (config) {
            let cointypes: EEnum.EMoneyType[] = [];
            if (config.ItemCost && GToNumber(config.ItemCost) > 0) {
                cointypes.push(EEnum.EMoneyType.Gold);
            }
            if (config.WoodCost && GToNumber(config.WoodCost) > 0) {
                cointypes.push(EEnum.EMoneyType.Wood);
            }
            if (config.SoulCrystalCost && GToNumber(config.SoulCrystalCost) > 0) {
                cointypes.push(EEnum.EMoneyType.SoulCrystal);
            }
            CoinType = GFuncRandom.RandomOne(cointypes) || CoinType;
        }
        return CoinType
    }





    parseRandomItem(ItemName: string) {
        if (GJSONConfig.PoolGroupConfig.get(ItemName) == null) {
            return ItemName;
        }
        return KVHelper.RandomPoolGroupConfig(ItemName);
    }



    addShopItem(shoptype: PublicBagConfig.EPublicShopType, item: IPublicShopItem) {
        if (this.AllSellItem[shoptype] == null) {
            this.AllSellItem[shoptype] = {};
        }
        this.AllSellItem[shoptype][item.iSlot + ""] = item;
    }

    getShopItem(shoptype: PublicBagConfig.EPublicShopType, slot: number) {
        if (this.AllSellItem[shoptype] == null) {
            return null;
        }
        return this.AllSellItem[shoptype][slot + ""];
    }

    BuyItem(toNpc: IBaseNpc_Plus, shoptype: PublicBagConfig.EPublicShopType, slot: number) {
        let item = this.getShopItem(shoptype, slot);
        if (item == null) {
            EventHelper.ErrorMessage("购买失败，物品不存在");
            return
        }
        if (item.iLimit > 0 && item.iLeftCount <= 0) {
            EventHelper.ErrorMessage("购买失败，物品已售罄");
            return;
        }
        let costcoin = 0;
        let iDiscount = (1 - this.iDiscount * 0.01);
        let playerdata = GGameScene.GetPlayer(this.BelongPlayerid).PlayerDataComp();
        if (item.iCoinType == EEnum.EMoneyType.Gold) {
            costcoin = KVHelper.GetItemCoinCost(EEnum.EMoneyType.Gold, item.sItemName) * iDiscount;
            if (playerdata.isEnoughItem(EEnum.EMoneyType.Gold, costcoin) == false) {
                EventHelper.ErrorMessage("购买失败，金币不足");
                return
            }
        }
        else if (item.iCoinType == EEnum.EMoneyType.Wood) {
            costcoin = KVHelper.GetItemCoinCost(EEnum.EMoneyType.Wood, item.sItemName) * iDiscount;
            if (playerdata.isEnoughItem(EEnum.EMoneyType.Wood, costcoin) == false) {
                EventHelper.ErrorMessage("购买失败，木材不足");
                return
            }
        }
        else if (item.iCoinType == EEnum.EMoneyType.SoulCrystal) {
            costcoin = KVHelper.GetItemCoinCost(EEnum.EMoneyType.SoulCrystal, item.sItemName) * iDiscount;
            if (playerdata.isEnoughItem(EEnum.EMoneyType.SoulCrystal, costcoin) == false) {
                EventHelper.ErrorMessage("购买失败，魂晶不足");
                return
            }
        }
        let playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        let courierroot = playerroot.CourierRoot();
        let bBuyItem2Bag = courierroot.CourierBagComp().bBuyItem2Bag;
        let itemEntity: IBaseItem_Plus;
        if (bBuyItem2Bag) {
            if (courierroot.CourierBagComp().IsItemEmpty() == false) {
                EventHelper.ErrorMessage("购买失败，背包已满");
                return
            }
            itemEntity = playerroot.Hero.CreateOneItem(item.sItemName);
            // 先消耗金币，再尝试使用道具
            if (IsValid(itemEntity)) {
                playerroot.PlayerDataComp().changeItem(item.iCoinType, -costcoin);
                playerroot.PlayerDataComp().SyncClient();
            }
            if (IsValid(itemEntity) && itemEntity.CanBeUsedOutOfInventory()) {
                itemEntity = itemEntity.UseOutOfInventory(!bBuyItem2Bag);
            }
            if (IsValid(itemEntity)) {
                ItemEntityRoot.Active(itemEntity);
                let itemroot = itemEntity.ETRoot as ItemEntityRoot;
                courierroot.CourierBagComp().putInItem(itemroot);
            }
        }
        else {
            let isGround = toNpc.IsInventoryFull();
            itemEntity = toNpc.AddItemOrInGround(item.sItemName);
            // 先消耗金币，再尝试使用道具
            if (IsValid(itemEntity)) {
                playerroot.PlayerDataComp().changeItem(item.iCoinType, -costcoin);
                playerroot.PlayerDataComp().SyncClient();
            }
            if (IsValid(itemEntity) && itemEntity.CanBeUsedOutOfInventory()) {
                itemEntity = itemEntity.UseOutOfInventory(!bBuyItem2Bag);
            }
            if (IsValid(itemEntity)) {
                if (isGround) {
                    EventHelper.ErrorMessage("购买成功，物品已放在地上");
                }
                if (toNpc.ETRoot) {
                    let npcroot = toNpc.ETRoot as IBattleUnitEntityRoot;
                    if (npcroot.InventoryComp()) {
                        ItemEntityRoot.Active(itemEntity);
                        let itemroot = itemEntity.ETRoot as ItemEntityRoot;
                        npcroot.InventoryComp().putInItem(itemroot);
                    }
                }
            }
        }


    }



}