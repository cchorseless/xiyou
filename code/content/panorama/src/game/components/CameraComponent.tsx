import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { ET } from "../../../../scripts/tscripts/shared/lib/Entity";
import { FuncHelper } from "../../helper/FuncHelper";
import { NetHelper } from "../../helper/NetHelper";

const MIN_CAMERA_DISTANCE = 1300;
const MAX_CAMERA_DISTANCE = 3500;

/* env_fog_controller实体里的Far Z Clip Plane需要适应调整
    其值设置为[距离/cos(角度)]会出现的最大值
*/
const CAMERA_START_PITCH_DISTANCE = 3000;
const CAMERA_END_PITCH_DISTANCE = 3500;
const CAMERA_MIN_PITCH = 60;
const CAMERA_MAX_PITCH = 90;
const OVERLAY_MAP_SCALE = 6;

const MAX_LOOK_SCREEN = 1 / 5;
const START_OFFSET_SCREEN = 1 / 4;
const END_OFFSET_SCREEN = 1 / 3;

/**摄像机控制组件 */

@GReloadable
export class CameraComponent extends ET.Component {

    fCameraDistance: number = 1300;
    fSmoothCameraDistance: number = 1300;
    vCameraTargetPosition: [number, number, number] = [0, 0, 0];
    vSmoothCameraTargetPosition: [number, number, number] = [0, 0, 0];
    vLastCameraTargetPosition: [number, number, number] = [0, 0, 0];
    SetDistance(fPercent = 0) {
        this.fCameraDistance = FuncHelper.RemapValClamped(fPercent, 0, 1, MIN_CAMERA_DISTANCE, MAX_CAMERA_DISTANCE);
    }
    onAwake() {
        // 摄像机角度
        GameUI.SetCameraPitchMax(55);
        // 摄像机高度
        GameUI.SetCameraDistance(1500);
        // 摄像机跟随点偏移
        GameUI.SetCameraLookAtPositionHeightOffset(50);
        GameUI.SetMouseCallback((eventName, arg) => {
            let r = false;
            if (GameUI.GetClickBehaviors() !== CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) {
                return r;
            }
            switch (eventName) {
                case "pressed":
                    switch (arg) {
                        case 0:
                        case 1:
                            break
                        case 2:
                            this.g_targetYaw = 0;
                            this.g_yaw = this.g_targetYaw;
                            r = true;
                            break;
                    }
                    break
                case "wheeled":
                    this.g_targetYaw += arg * 10;
                    r = true;
                    break;
                case "doublepressed":
                case "released":
                    break
            }
            return r;
        });
        GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
            this.onUpdate();
            return 1;
        }))
    }
    /**开启摄像机环绕 */
    bLocksurroundCamrea: boolean = true;
    /**开启摄像机跟随,建议在LUA端开启，不然会抖动 */
    bLockCameraFollow: boolean = false;
    onUpdate() {
        if (this.bLockCameraFollow) {
            this.cameraFollowHero()
        }
        if (this.bLocksurroundCamrea) {
            this.surroundCameraYaw()
        }
    }
    last_g_yaw = 0
    g_yaw = 0;
    g_targetYaw = 0;
    /**摄像机环绕 */
    surroundCameraYaw() {
        while (this.g_targetYaw > 360 && this.g_yaw > 360) {
            this.g_targetYaw -= 360;
            this.g_yaw -= 360;
        }
        while (this.g_targetYaw < 0 && this.g_yaw < 0) {
            this.g_targetYaw += 360;
            this.g_yaw += 360;
        }
        let minStep = 1;
        let delta = (this.g_targetYaw - this.g_yaw);
        if (Math.abs(delta) < minStep) {
            this.g_yaw = this.g_targetYaw;
        }
        else {
            let step = delta * 0.3;
            if (Math.abs(step) < minStep) {
                if (delta > 0) {
                    step = minStep;
                }
                else {
                    step = -minStep;
                }
            }
            this.g_yaw += step;
        }
        if (this.last_g_yaw != this.g_yaw) {
            this.last_g_yaw = this.g_yaw
            GameUI.SetCameraYaw(this.g_yaw);
            // 抛出事件
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_Camera_Yaw_Change, {
                entindex: Players.GetLocalPlayerPortraitUnit(),
                camerayaw: this.g_yaw,
            })
        }
        return;
    }
    /**摄像机跟随 */
    cameraFollowHero() {
        let hero = Players.GetLocalPlayerPortraitUnit();
        if (hero) {
            let P = Entities.GetAbsOrigin(hero)
            if (P) {
                GameUI.SetCameraPositionFromLateralLookAtPosition(P[0], P[1])
            }
        }
    }

    /**摄像机延迟跟随 */
    cameraDelayFollowHero() {
        let fScreenWidth = Game.GetScreenWidth();
        let fScreenHeight = Game.GetScreenHeight();
        let fStartScreenDistance = fScreenHeight * START_OFFSET_SCREEN;
        let fEndScreenDistance = fScreenHeight * END_OFFSET_SCREEN;
        let fMaxLookDistance = fScreenHeight * MAX_LOOK_SCREEN;
        let fFrameTime = Game.GetGameFrameTime();
        let localCamFollowIndex = (Players.GetSelectedEntities(Players.GetLocalPlayer()) || [])[0] || -1 as EntityIndex;
        if (Players.IsLocalPlayerInPerspectiveCamera()) {
            localCamFollowIndex = Players.GetPerspectivePlayerEntityIndex();
        }
        if (localCamFollowIndex !== -1) {
            if (Entities.IsAlive(localCamFollowIndex) === false)
                return;
            let fOffset = 0;
            this.vCameraTargetPosition = Entities.GetAbsOrigin(localCamFollowIndex);
            if (true) {
                if (this.vSmoothCameraTargetPosition[0] == 0 && this.vSmoothCameraTargetPosition[1] == 0 && this.vSmoothCameraTargetPosition[2] == 0) {
                    this.vSmoothCameraTargetPosition = this.vCameraTargetPosition;
                } else {
                    fOffset = Game.Length2D(this.vCameraTargetPosition, this.vLastCameraTargetPosition);
                }

                if (fOffset > 1000) {
                    GameUI.SetCameraTargetPosition(this.vCameraTargetPosition, -1);
                    return;
                }
                let vCursorPos = GameUI.GetCursorPosition();

                let fCursorX = vCursorPos[0] - fScreenWidth / 2;
                let fCursorY = vCursorPos[1] - fScreenHeight / 2;
                let fCursorToCenterDistance = Math.sqrt(Math.pow(fCursorX, 2) + Math.pow(fCursorY, 2));

                let fPercent = FuncHelper.RemapValClamped(fCursorToCenterDistance, fStartScreenDistance, fEndScreenDistance, 0, 1);

                let vScreenWorldPos = GameUI.GetScreenWorldPosition(vCursorPos);
                if (vScreenWorldPos != null) {
                    let vToCursor: [number, number, number] = [0, 0, 0];
                    vToCursor[0] = vScreenWorldPos[0] - this.vCameraTargetPosition[0];
                    vToCursor[1] = vScreenWorldPos[1] - this.vCameraTargetPosition[1];
                    vToCursor[2] = vScreenWorldPos[2] - this.vCameraTargetPosition[2];
                    vToCursor = Game.Normalized(vToCursor);
                    let flDistance = fMaxLookDistance * fPercent;
                    this.vCameraTargetPosition[0] = this.vCameraTargetPosition[0] + vToCursor[0] * flDistance;
                    this.vCameraTargetPosition[1] = this.vCameraTargetPosition[1] + vToCursor[1] * flDistance;
                    this.vCameraTargetPosition[2] = this.vCameraTargetPosition[2] + vToCursor[2] * flDistance;
                }

                let minStep = FuncHelper.RemapValClamped(fOffset, fStartScreenDistance * fFrameTime, fEndScreenDistance * fFrameTime, 0.125, 0.3125);
                let delta = Game.Length2D(this.vCameraTargetPosition, this.vSmoothCameraTargetPosition);
                if (Math.abs(delta) < minStep) {
                    this.vSmoothCameraTargetPosition = this.vCameraTargetPosition;
                }
                else {
                    let step = delta * (FuncHelper.RemapValClamped(fOffset / fFrameTime, 0, fScreenHeight, 1, 3) * fFrameTime);
                    if (fFrameTime == 0) step = 0;
                    if (Math.abs(step) < minStep) {
                        if (delta > 0)
                            step = minStep;
                        else
                            step = -minStep;
                    }
                    let vToCursor: [number, number, number] = [0, 0, 0];
                    vToCursor[0] = this.vCameraTargetPosition[0] - this.vSmoothCameraTargetPosition[0];
                    vToCursor[1] = this.vCameraTargetPosition[1] - this.vSmoothCameraTargetPosition[1];
                    vToCursor[2] = this.vCameraTargetPosition[2] - this.vSmoothCameraTargetPosition[2];
                    vToCursor = Game.Normalized(vToCursor);
                    this.vSmoothCameraTargetPosition[0] += vToCursor[0] * step;
                    this.vSmoothCameraTargetPosition[1] += vToCursor[1] * step;
                    this.vSmoothCameraTargetPosition[2] += vToCursor[2] * step;
                }
            }
            else {
                this.vSmoothCameraTargetPosition = this.vCameraTargetPosition;
            }
            // $.Msg(vSmoothCameraTargetPosition);
            GameUI.SetCameraTargetPosition(this.vSmoothCameraTargetPosition, -1);
            // GameUI.SetCameraTargetPosition(vCameraTargetPosition, RemapValClamped(fOffset, 0, fMaxLookDistance*fFrameTime, 0.125, 0.0625))
            this.vLastCameraTargetPosition = Entities.GetAbsOrigin(localCamFollowIndex);
        }

        let minStep = 1;
        let delta = (this.fCameraDistance - this.fSmoothCameraDistance);
        if (Math.abs(delta) < minStep) {
            this.fSmoothCameraDistance = this.fCameraDistance;
        }
        else {
            let step = delta * (5 * fFrameTime);
            if (Math.abs(step) < minStep) {
                if (delta > 0)
                    step = minStep;
                else
                    step = -minStep;
            }
            this.fSmoothCameraDistance += step;
        }
        let fCameraPitch = FuncHelper.RemapValClamped(this.fSmoothCameraDistance, CAMERA_START_PITCH_DISTANCE, CAMERA_END_PITCH_DISTANCE, CAMERA_MIN_PITCH, CAMERA_MAX_PITCH);
        GameUI.SetCameraPitchMin(fCameraPitch + 360);
        GameUI.SetCameraPitchMax(fCameraPitch + 360);
        GameUI.SetCameraDistance(this.fSmoothCameraDistance);
    }
}