import { ET } from "../../Entity/Entity";
import { GameEnum } from "../../../shared/GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc } from "../../../npc/entityPlus/Base_Plus";
import { reloadable } from "../../../GameCache";


// ---方向
const ENUM_KEY_DIRECTION_VECTOR = {
    MoveTop: Vector(0, 1, 0),
    MoveLeft: Vector(-1, 0, 0),
    MoveBottom: Vector(0, -1, 0),
    MoveRight: Vector(1, 0, 0),
}

// ---键盘常量
const ENUM_KEY_CODE = {
    Q: "Q",
    W: "W",
    E: "E",
    R: "R",
    T: "T",
    Y: "Y",
    U: "U",
    I: "I",
    O: "O",
    P: "P",
    A: "A",
    S: "S",
    D: "D",
    F: "F",
    G: "G",
    H: "H",
    J: "J",
    K: "K",
    L: "L",
    Z: "Z",
    X: "X",
    C: "C",
    V: "V",
    B: "B",
    N: "N",
    M: "M",
    Backquote: "`",
    Tab: "TAB",
    Capslock: "CAPSLOCK",
    Shift: "SHIFT",
    Ctrl: "CTRL",
    Space: "SPACE",
    Minus: "-",
    Equal: "=",
    Backspace: "BACKSPACE",

    Digit1: "1",
    Digit2: "2",
    Digit3: "3",
    Digit4: "4",
    Digit5: "5",
    Digit6: "6",
    Digit7: "7",
    Digit8: "8",
    Digit9: "9",
    Digit0: "0",

    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
}

const enum ENUM_MOUSE_CODE {
    MouseLeft,
    MouseRight,
    MouseMiddle,
    Mouse4,
    Mouse5,
    ScrollUp,
    ScrollDown,
}
/**瞄准类型 */
const enum AIMING_TYPE {
    AIMING_TYPE_NONE,
    AIMING_TYPE_AUTO,
    AIMING_TYPE_ASSIST
}

const vec3_zero = Vector(0, 0, 0);

interface KeyboardData {
    [k: string]: {
        /**按鍵指令集合 */
        tKeyDown?: Array<string>,
    }
}
/**移动控制组件 */
@reloadable
export class ControlComponent extends ET.Component {
    /**玩家按键信息 */
    tKeyboardData: KeyboardData = {};
    /**存玩家鼠标位置 */
    tPlayerCursorPosition: any = {};
    /**玩家键位设置 */
    tPlayerKeySetting: any = {}
    /**默认键位设置 */
    tDefaultKeySetting = {
        MoveTop: ENUM_KEY_CODE.S, //---上移动
        MoveLeft: ENUM_KEY_CODE.Z, //---左移动
        MoveBottom: ENUM_KEY_CODE.X, //---下移动
        MoveRight: ENUM_KEY_CODE.C, //---又移动

        Ability1: ENUM_KEY_CODE.Q, //---技能1
        Ability2: ENUM_KEY_CODE.W, //---技能2
        Ability3: ENUM_KEY_CODE.E, //---技能3
        Ability4: ENUM_KEY_CODE.D, //---技能4
        Ability5: ENUM_KEY_CODE.F, //---技能5
        Ability6: ENUM_KEY_CODE.R, //---技能6

        Item1: ENUM_KEY_CODE.Digit1, //---物品1
        Item2: ENUM_KEY_CODE.Digit2, //---物品2
        Item3: ENUM_KEY_CODE.Digit3, //---物品3
        Item4: ENUM_KEY_CODE.Digit4, //---物品4
        Item5: ENUM_KEY_CODE.Digit5, //---物品5
        Item6: ENUM_KEY_CODE.Digit6, //---物品6
        Item7: ENUM_KEY_CODE.Digit7, //---物品7
        Item8: ENUM_KEY_CODE.Digit8, //---物品8

        EnableKeyboardMove: true, //---是否开启键盘移动
        EnableAssistedAiming: 0,// ---是否开启辅助瞄准
        EnableAutomaticAiming: 0, //---是否开启自动瞄准
        AimingType: AIMING_TYPE.AIMING_TYPE_NONE, //---瞄准类型
        AimingDistance: 200, //---辅助瞄准距离
        Map: ENUM_KEY_CODE.Tab,// ---大地图
        UnitState: ENUM_KEY_CODE.U, //---状态
        Dodge: ENUM_KEY_CODE.Space, //---技能2

        Attack: ENUM_KEY_CODE.A, //---攻击
        Interact: "", //---交互
        Move: "", //---右键移动
    }
    /**摄像机角度 */
    cameraQAngle: QAngle = QAngle(0, 0, 0);
    /**修正方向向量 */
    getFix_DIRECTION_VECTOR(v: Vector) {
        return RotatePosition(vec3_zero, this.cameraQAngle, v);
    }

    onAwake() {
        if (!IsServer()) { return };
        let domain = this.GetDomain<BaseNpc>();
        // 摄像机跟随
        PlayerResource.SetCameraTarget(domain.GetPlayerOwnerID(), domain);
        // 键盘输入
        EventHelper.addProtocolEvent(this, GameEnum.CustomProtocol.req_KEY_DOWN, this.onKey_Down,);
        EventHelper.addProtocolEvent(this, GameEnum.CustomProtocol.req_KEY_UP, this.onKey_Up,);
        EventHelper.addProtocolEvent(this, GameEnum.CustomProtocol.req_Camera_Yaw_Change, this.onCamera_Yaw_Change,);
        EventHelper.addProtocolEvent(this, GameEnum.CustomProtocol.req_Mouse_Event, this.onMouse_Event,);
        EventHelper.addProtocolEvent(this, GameEnum.CustomProtocol.req_Mouse_Position, this.onMouse_Position,);
        this.startServerUpdate();
    }

    onUpdate() {
        let domain = this.GetDomain<BaseNpc>();
        let iEntIndex = domain.GetEntityIndex();
        if (iEntIndex == null) { return; }
        let tData = this.tKeyboardData[iEntIndex];
        if (tData == null || tData.tKeyDown == null || tData.tKeyDown.length == 0) { return }
        let hUnit = domain;
        if (hUnit == null || hUnit.IsCommandRestricted() || hUnit.IsStunned()) { return }
        let iPlayerID = hUnit.GetPlayerOwnerID()
        let tKeySetting = this.tDefaultKeySetting
        let vDirection = vec3_zero
        let bDodge = false
        let bUseAbility = [false, false, false, false, false, false, false]
        let bUseItem = [false, false, false, false, false, false, false, false, false]

        let bAttack = false
        let bInteract = false
        let bMove = false
        for (let sKey of tData.tKeyDown) {
            switch (sKey) {
                case tKeySetting.MoveTop:
                    vDirection = (vDirection + this.getFix_DIRECTION_VECTOR(ENUM_KEY_DIRECTION_VECTOR.MoveTop)) as Vector;
                    break;
                case tKeySetting.MoveLeft:
                    vDirection = (vDirection + this.getFix_DIRECTION_VECTOR(ENUM_KEY_DIRECTION_VECTOR.MoveLeft)) as Vector;
                    break;
                case tKeySetting.MoveBottom:
                    vDirection = (vDirection + this.getFix_DIRECTION_VECTOR(ENUM_KEY_DIRECTION_VECTOR.MoveBottom)) as Vector;
                    break;
                case tKeySetting.MoveRight:
                    vDirection = (vDirection + this.getFix_DIRECTION_VECTOR(ENUM_KEY_DIRECTION_VECTOR.MoveRight)) as Vector;
                    break;
                case tKeySetting.Ability1:
                    bUseAbility[0] = true
                    break;
                case tKeySetting.Ability2:
                    bUseAbility[1] = true
                    break;
                case tKeySetting.Ability3:
                    bUseAbility[2] = true
                    break;
                case tKeySetting.Ability4:
                    bUseAbility[3] = true
                    break;
                case tKeySetting.Ability5:
                    bUseAbility[4] = true
                    break;
                case tKeySetting.Ability6:
                    bUseAbility[5] = true
                    break;
                case tKeySetting.Item1:
                    bUseItem[1] = true
                    break;
                case tKeySetting.Item2:
                    bUseItem[2] = true
                    break;
                case tKeySetting.Item3:
                    bUseItem[3] = true
                    break;
                case tKeySetting.Item4:
                    bUseItem[4] = true
                    break;
                case tKeySetting.Item5:
                    bUseItem[5] = true
                    break;
                case tKeySetting.Item6:
                    bUseItem[6] = true
                    break;
                case tKeySetting.Item7:
                    bUseItem[7] = true
                    break;
                case tKeySetting.Item8:
                    bUseItem[8] = true
                    break;
                case tKeySetting.Attack:
                    bAttack = true
                    break;
                case tKeySetting.Interact:
                    bInteract = true
                    break;
                case tKeySetting.Move:
                    bMove = true
                    break;
                case tKeySetting.Dodge:
                    bDodge = true
                    break;
            }

        }
        // 施法不移动
        if (hUnit.GetCurrentActiveAbility() == null) {
            if (tKeySetting.EnableKeyboardMove) {
                //----------------------------------------键盘移动----------------------------------------
                if (!GameFunc.VectorFunctions.VectorIsZero(vDirection)) {
                    vDirection = vDirection.Normalized();
                    hUnit.SetLocalAngles(0, VectorToAngles(vDirection).y, 0);
                    GameFunc.ExecuteOrder(hUnit, dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, null, (GetGroundPosition(hUnit.GetAbsOrigin(), hUnit) + vDirection * 100) as Vector)
                }
                else {
                    if (!hUnit.IsIdle()) {
                        hUnit.Stop()
                    }
                }
            }
            else {
                //----------------------------------------鼠标移动----------------------------------------
                // if (bMove) {
                //     hUnit.SetLocalAngles(0, VectorToAngles(((vCursorPosition - hUnit.GetAbsOrigin()) as Vector).Normalized()).y, 0)
                //     GameFunc.ExecuteOrder(hUnit, dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION, null, null, vCursorPosition)
                // }
            }
        }

        // // --攻击
        // if (bAttack && hUnit.GetCurrentActiveAbility() == null) {
        //     let _vPosition = vCursorPosition
        //     let vAutoPosition;
        //     switch (tKeySetting.AimingType) {
        //         case AIMING_TYPE.AIMING_TYPE_AUTO:
        //             vAutoPosition = this._GetAutomaticAimingPosition(hUnit)
        //             if (vAutoPosition) {
        //                 _vPosition = vAutoPosition
        //             }
        //             break;
        //         case AIMING_TYPE.AIMING_TYPE_ASSIST:
        //             vAutoPosition = this._GetAssistedAimingPosition(hUnit, vCursorPosition, tKeySetting.AimingDistance)
        //             if (vAutoPosition) {
        //                 _vPosition = vAutoPosition
        //             }
        //             break
        //     }
        //     if (hUnit.GetAbilityByIndex(3).OnKeyboardFire(vCastDirection, _vPosition) == false) {
        //         this.releaseKey(iEntIndex, tKeySetting.Attack)
        //     }
        // }
        // // --交互
        // if (bInteract) {
        //     this.releaseKey(iEntIndex, tKeySetting.Interact)
        //     hUnit.GetAbilityByIndex(4).OnKeyboardFire(vCastDirection, vCursorPosition)
        // }

        //--------------------------施法-----------------------------
        // let vCastDirection = GameFunc.VectorFunctions.VectorIsZero(vDirection) && hUnit.GetForwardVector() || vDirection;
        // bUseAbility.forEach(
        //     (bUseAbility: boolean, index: number) => {
        //         if (!bUseAbility) { return };
        //         let hAbility = hUnit.GetAbilityByIndex(index) as BaseAbility_Plus;
        //         if (hAbility && hAbility.IsAbilityReady && hAbility.IsAbilityReady()) {

        //             hAbility.startCastAbility()
        //         }
        //         this.releaseKey(iEntIndex, (tKeySetting as any)['Ability' + (index + 1)])
        //         // let _vPosition = vCursorPosition
        //         // let vAutoPosition;
        //         // switch (tKeySetting.AimingType) {
        //         //     case AIMING_TYPE.AIMING_TYPE_AUTO:
        //         //         vAutoPosition = this._GetAutomaticAimingPosition(hUnit, hAbility)
        //         //         if (vAutoPosition) {
        //         //             _vPosition = vAutoPosition
        //         //         }
        //         //         break;
        //         //     case AIMING_TYPE.AIMING_TYPE_ASSIST:
        //         //         vAutoPosition = this._GetAssistedAimingPosition(hUnit, vCursorPosition, tKeySetting.AimingDistance, hAbility)
        //         //         if (vAutoPosition) {
        //         //             _vPosition = vAutoPosition
        //         //         }
        //         //         break
        //         // }
        //         // hAbility.OnKeyboardFire(vCastDirection, _vPosition)
        //         //--this. ReleaseKey(iEntIndex, tKeySetting.Ability3)
        //     }
        // );
        // ------------------------------物品-----------------------------------
        for (let i = 1; i < bUseItem.length; i++) {
            let _bUseItem = bUseItem[i];
            if (_bUseItem) {
                let hItem = hUnit.GetItemInSlot(i)
                if (hItem) {
                    hItem.CastAbility()
                    //--GameFunc.ExecuteOrder(hUnit, DOTA_UNIT_ORDER_CAST_NO_TARGET, nil, hItem)
                }
                this.releaseKey(iEntIndex, (tKeySetting as any)['Item' + i])
            }
        }
        // //--闪避
        // if (bDodge) {
        //     if (hUnit.GetAbilityByIndex(1).IsFullyCastable()) {
        //         hUnit.Stop();
        //         // let vDodgeDirection = GameFunc.VectorFunctions.VectorIsZero(vDirection) && hUnit.GetForwardVector() || vDirection;
        //         // hUnit.GetAbilityByIndex(1).OnKeyboardFire(vDodgeDirection, vCursorPosition)
        //         this.releaseKey(iEntIndex, tKeySetting.Dodge)
        //     }
        //     //--GameFunc.ExecuteOrder(hUnit, dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION, nil, hUnit: GetAbilityByIndex(1), hUnit: GetAbsOrigin() + vDodgeDirection * 600)
        // }
    }

    onKey_Down(tEvents: JS_TO_LUA_DATA) {
        let domain = this.GetDomain<BaseNpc>();
        if (IsClient() || tEvents.entindex != domain.GetEntityIndex()) return;
        let sKey = (ENUM_KEY_CODE as any)[tEvents.data.key];
        this.cameraQAngle.y = tEvents.data.camerayaw || 0;
        this.pressKey(tEvents.entindex, sKey)
    }
    onKey_Up(tEvents: JS_TO_LUA_DATA) {
        let domain = this.GetDomain<BaseNpc>();
        if (IsClient() || tEvents.entindex != domain.GetEntityIndex()) return;
        let sKey = (ENUM_KEY_CODE as any)[tEvents.data.key]
        this.cameraQAngle.y = tEvents.data.camerayaw || 0;
        this.releaseKey(tEvents.entindex, sKey)
    }
    /**镜头环绕 */
    onCamera_Yaw_Change(tEvents: JS_TO_LUA_DATA) {
        let domain = this.GetDomain<BaseNpc>();
        if (IsClient() || tEvents.entindex != domain.GetEntityIndex()) return;
        this.cameraQAngle.y = tEvents.data.camerayaw || 0;
    }


    onMouse_Event(tEvents: JS_TO_LUA_DATA) {
    }

    onMouse_Position(tEvents: JS_TO_LUA_DATA) {
    }
    /**点击按键 */
    pressKey(entindex: EntityIndex, sKey: string) {
        this.tKeyboardData[entindex] = this.tKeyboardData[entindex] || {};
        let tData = this.tKeyboardData[entindex];
        tData.tKeyDown = tData.tKeyDown || [];
        table.insert(tData.tKeyDown, sKey)
    }
    /**釋放按键 */
    releaseKey(entindex: EntityIndex, sKey: string) {
        if (sKey == null) return;
        let tData = this.tKeyboardData[entindex];
        if (tData) {
            tData.tKeyDown = tData.tKeyDown || [];
            GameFunc.ArrayFunc.RemoveAll(tData.tKeyDown, sKey);
        }
    }
}