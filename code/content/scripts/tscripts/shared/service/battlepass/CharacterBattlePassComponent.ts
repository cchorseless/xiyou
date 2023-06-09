
import { ET, serializeETProps } from "../../lib/Entity";
import { TCharacter } from "../account/TCharacter";
import { TBattlePassTaskItem } from "./TBattlePassTaskItem";


@GReloadable
export class CharacterBattlePassComponent extends ET.Component {
    @serializeETProps()
    public DailyTasks: string[] = [];
    @serializeETProps()
    public WeekTasks: string[] = [];
    @serializeETProps()
    public SeasonTasks: string[] = [];
    @serializeETProps()
    public IsReplaceDailyTask: boolean;
    @serializeETProps()
    public BattlePassLevel: number = 0;
    @serializeETProps()
    public BattlePassExp: number = 0;
    @serializeETProps()
    public SeasonConfigId: number = 0;
    @serializeETProps()
    public SeasonEndTimeSpan: string = "0";
    @serializeETProps()
    public DailyEndTimeSpan: string = "0";
    @serializeETProps()
    public WeekEndTimeSpan: string = "0";
    @serializeETProps()
    public IsBattlePass: boolean = false;
    @serializeETProps()
    public BattlePassPrizeGet: number[] = [];
    @serializeETProps()
    public ChargeItemConfigId = 0;

    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onGetBelongPlayerid() {
        let character = GTCharacter.GetOneInstanceById(this.Id);
        if (character != null) {
            return character.BelongPlayerid;
        }
        return -1;
    }
    onSerializeToEntity() {
        GTCharacter.GetOneInstance(this.BelongPlayerid).AddOneComponent(this);
        this.onReload();
    }

    GetDailyTasks() {
        let r: TBattlePassTaskItem[] = [];
        this.DailyTasks.forEach(v => {
            let entity = TBattlePassTaskItem.GetOneInstanceById(v);
            if (entity) {
                r.push(entity)
            }
        });
        return r;
    }
    GetWeekTasks() {
        let r: TBattlePassTaskItem[] = [];
        this.WeekTasks.forEach(v => {
            let entity = TBattlePassTaskItem.GetOneInstanceById(v);
            if (entity) {
                r.push(entity)
            }
        });
        return r;
    }
    onReload() {
        this.SyncClient();
    }
}
