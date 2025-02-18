declare interface IItemInfo {
    itemid: string | number,
    count?: number;
}

declare interface IGoodsInfo {
    /**支付类型 */
    pay_type: "0" | "300001" | "300002",
    /**原价 */
    origin_price: string,
    /**折扣后价格 */
    real_price: string,
    /**仅会员可购买 */
    vip: "0" | "1" | "2",
    /**限时购买物品的结束时间 */
    end_time: string,
    // "limit_type": "1"|"2"|"3"|"4"|"5"|"6",
    // "limit_count": null,
    overseas_originprice: string,//海外原价
    overseas_realprice: string,//海外折扣后价格
    items: {
        "itemid": string,
        "amounts": string;
    }[],
    limit_type: "1" | "2" | "3" | "4" | "5" | "6",//限购类型
    limit_count: string,//限购上限
    bought_count: string,//限购已经购买了多少个
    img?: string, // 指定商品图
    orderby: string,
}

declare interface IPublicShopItem {
    sItemName: string,
    iSlot: number,
    iLevel?: number,
    iLeftCount?: number,
    iLimit?: number,
    iRoundLock?: number,
    iCoinType: ICoinType,
}

/**玩家选择进入游戏数据 */
interface IPlayerGameSelection {
    Difficulty: {
        Chapter: number;
        Level: number;
        MaxChapter: number;
        MaxLevel: number;
    },
    Courier: string;
    Title: string;
    EndlessRank: number;
    IsReady: boolean;
    bNewPlayer: boolean;
}

interface ICCGameSingleDataItem {
    isonline: boolean,
    accountid: string,
    score: number,
    totaldamage: number,
    wincount: number;
    losecount: number;
    drawcount: number;
    scorechange: number,
    units: { unitname: string, star: number }[],
    sectInfo: string[]
}