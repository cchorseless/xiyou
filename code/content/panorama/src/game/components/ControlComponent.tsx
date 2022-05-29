import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { ET, registerET } from "../../libs/Entity";
import { GameEnum } from "../../libs/GameEnum";

const KeyCode: { [key: string]: string; } = {
    // Q: "Q",
    // W: "W",
    // E: "E",
    // R: "R",
    // T: "T",
    // Y: "Y",
    // U: "U",
    // I: "I",
    // O: "O",
    // P: "P",
    // A: "A",
    // S: "S",
    // D: "D",
    // F: "F",
    // G: "G",
    // H: "H",
    // J: "J",
    // K: "K",
    // L: "L",
    // Z: "Z",
    // X: "X",
    // C: "C",
    // V: "V",
    // B: "B",
    // N: "N",
    // M: "M",

    // Backquote: "`",
    // Tab: "TAB",
    // Capslock: "CAPSLOCK",
    // Shift: "SHIFT",
    // Ctrl: "CTRL",
    //无效 Alt: "ALT",
    // Space: "SPACE",
    // Minus: "-",
    // Equal: "=",
    // Backspace: "BACKSPACE",
    // BracketLeft: "[",
    // BracketRight: "]",
    // Backslash: "\\",
    //无效 Semicolon: ";",
    // Quote: "'",
    // Comma: ",",
    // Period: ".",
    // Slash: "/",
    //无效 Enter: "RETURN",

    // Printscreen: "PRINTSCREEN",
    // ScrollLock: "SCROLLLOCK",
    // Pause: "PAUSE",
    //无效 Insert: "INSERT",
    // Home: "HOME",
    //无效 Delete: "DELETE",
    // End: "END",
    //无效 PageUp: "PAGEUP",
    //无效 PageDown: "PAGEDOWN",
    //无效 Up: "UP",
    //无效 Down: "DOWN",
    //无效 Left: "LEFT",
    //无效 Right: "RIGHT",

    // Digit1: "1",
    // Digit2: "2",
    // Digit3: "3",
    // Digit4: "4",
    // Digit5: "5",
    // Digit6: "6",
    // Digit7: "7",
    // Digit8: "8",
    // Digit9: "9",
    // Digit0: "0",

    // Keypad1: "KEYPAD1",
    // Keypad2: "KEYPAD2",
    // Keypad3: "KEYPAD3",
    // Keypad4: "KEYPAD4",
    // Keypad5: "KEYPAD5",
    // Keypad6: "KEYPAD6",
    // Keypad7: "KEYPAD7",
    // Keypad8: "KEYPAD8",
    // Keypad9: "KEYPAD9",
    // Keypad0: "KEYPAD0",
    // KeypadPeriod: "KEYPAD.",
    // NumLock: "NUMLOCK",
    //无效 KeypadDivide: "KEYPAD/",
    //无效 KeypadMultiply: "KEYPAD*",
    //无效 KeypadSubtract: "KEYPAD-",
    //无效 KeypadAdd: "KEYPAD+",
    //无效 KeypadEnter: "KEYPAD ENTER",

    //无效 Esc: "ESC",
    // F1: "F1",
    // F2: "F2",
    // F3: "F3",
    // F4: "F4",
    // F5: "F5",
    // F6: "F6",
    // F7: "F7",
    // F8: "F8",
    // F9: "F9",
    // F10: "F10",
    // F11: "F11",
    // F12: "F12",
};

/**角色控制组件 */
@registerET()
export class ControlComponent extends ET.Component {
    onAwake() {
        for (const key in KeyCode) {
            // 监听键盘事件
            Game.CreateCustomKeyBind(KeyCode[key], "+" + key);
            // 按下事件
            Game.AddCommand("+" + key, (name: string, ...args: string[]) => {
                NetHelper.SendToLua(GameEnum.CustomProtocol.req_KEY_DOWN, {
                    entindex: Players.GetLocalPlayerPortraitUnit(),
                    key: key,
                    camerayaw: GameUI.GetCameraYaw()
                });
            }, "", 67108864);
            // 抬起事件
            Game.AddCommand("-" + key, () => {
                NetHelper.SendToLua(GameEnum.CustomProtocol.req_KEY_UP, {
                    entindex: Players.GetLocalPlayerPortraitUnit(),
                    key: key,
                    camerayaw: GameUI.GetCameraYaw()
                });
            }, "", 67108864);
            // 鼠标事件
            GameUI.SetMouseCallback((data, value) => {
                // GameEvents.SendCustomGameEventToServer("Mouse_Event", {
                //     entindex: Players.GetLocalPlayerPortraitUnit(),
                //     value: data.value,
                //     event_name: data.event_name,
                //     vPosition: GameUI.GetScreenWorldPosition(GameUI.GetCursorPosition()),
                // });
                // $.Msg(GameUI.GetScreenWorldPosition(GameUI.GetCursorPosition()));
                return true;
            });
            // // 打开地图
            // let playerKeyBind = CustomNetTables.GetTableValue("player_key_seting", String(Players.GetLocalPlayer()));
            // if (playerKeyBind.Map && playerKeyBind.Map == KeyCode[key]) {
            //     // @ts-ignore
            //     GameEvents.SendEventClientSide("custom_ui_toggle_windows", { window_name: "MiniMap" });
            // }
            // // 打开属性面板
            // if (playerKeyBind.UnitState && playerKeyBind.UnitState == KeyCode[key]) {
            //     // @ts-ignore
            //     GameEvents.SendEventClientSide("custom_ui_toggle_windows", { window_name: "Wearable" });
            // }

            // // 打开地图
            // let playerKeyBind = CustomNetTables.GetTableValue("player_key_seting", String(Players.GetLocalPlayer()));
            // if (playerKeyBind.Map && playerKeyBind.Map == KeyCode[key]) {
            //     // @ts-ignore
            //     GameEvents.SendEventClientSide("custom_ui_toggle_windows", { window_name: "MiniMap" });
            // }



            // CustomNetTables.SubscribeNetTableListener("common", (tableName, tableKeyName, table) => {
            //     // $.Msg(tableName, tableKeyName, table);
            //     if (tableKeyName == "demo_settings") {
            //         let t = table as unknown as CustomNetTableDeclarations["common"]["demo_settings"];
            //         if (t.unlock_mouse == 1) {
            //             GameUI.CustomUIConfig().UnsubscribeMouseEvent("keyboard");
            //         } else {
            //             GameUI.CustomUIConfig().SubscribeMouseEvent("keyboard", data => {
            //                 GameEvents.SendCustomGameEventToServer("mouse_event", {
            //                     entindex: Players.GetLocalPlayerPortraitUnit(),
            //                     value: data.value,
            //                     event_name: data.event_name,
            //                     vPosition: GameUI.GetScreenWorldPosition(GameUI.GetCursorPosition()),
            //                 });
            //                 // $.Msg(GameUI.GetScreenWorldPosition(GameUI.GetCursorPosition()));
            //                 return true;
            //             });
            //         }
            //     }
            // });
            // this.startUpdate();
        }
    }
    onUpdate() {
        // GameEvents.SendCustomGameEventToServer("Mouse_Position", {
        //     entindex: Players.GetLocalPlayerPortraitUnit(),
        //     vPosition: GameUI.GetScreenWorldPosition(GameUI.GetCursorPosition()),
        // });
    }
}