import { ET, serializeETProps } from "../../lib/Entity";

declare global {
    interface IBattleUnitInfoItem {
        OnlyKey?: string;
        UnitName: string;
        Level: number;
        Star: number;
        PosX: number,
        PosY: number,
        WearBundleId?: string,
        EquipInfo: string[];
        Buffs?: string[];
    }
}




/**单条战斗队伍信息 */
@GReloadable
export class TBattleTeamRecord extends ET.Entity {

    @serializeETProps()
    public SteamAccountId: string;
    @serializeETProps()
    public SteamAccountName: string;
    @serializeETProps()
    public RoundIndex: number;
    @serializeETProps()
    public RoundCharpter: number;
    @serializeETProps()
    public BattleWinCount: number;
    @serializeETProps()
    public BattleLoseCount: number;
    @serializeETProps()
    public BattleDrawCount: number;
    @serializeETProps()
    public Score: number;
    @serializeETProps()
    public SectInfo: string[] = [];
    @serializeETProps()
    public UnitInfo: IBattleUnitInfoItem[] = [];

    /**存在服务器的实体ID，用于上报胜负 */
    public DBServerEntityId: string;

    onSerializeToEntity() {
        this.onReload()
    }

    onReload() {
        this.SyncClient();
    }


    static DataFix(d: TBattleTeamRecord) {
        // if (!_CODE_IN_LUA_) {
        //     if( typeof d.UnitInfo == "object"){
        //         d.SectInfo = JSON.parse(d.SectInfo)
        //     }
        // }
        return d;
    }


}

declare global {
    var GTBattleTeamRecord: typeof TBattleTeamRecord;
    type ITBattleTeamRecord = TBattleTeamRecord
}
if (_G.GTBattleTeamRecord == null) {
    _G.GTBattleTeamRecord = TBattleTeamRecord;
}