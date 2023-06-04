export module TimerHelper {
    export let isWorking = false;
    export const Offtime = new Date().getTimezoneOffset() * 60 * 1000;
    export const GetTimeDes = (t: number) => {
        t = Math.floor(t);
        let ss = parseInt(t % 60 + "") + "";
        let mm = parseInt(t / 60 % 60 + "") + "";
        let hh = parseInt(t / 60 / 60 + "") + "";
        ss = (ss.length == 2) ? ss : "0" + ss;
        mm = (mm.length == 2) ? mm : "0" + mm;
        hh = (hh.length == 2) ? hh : "0" + hh;
        return `${hh}:${mm}:${ss}`;
    }

    export function GetFullTimeDes(timestamp: number) {
        // 时间戳为10位需*1000，时间戳为13位不需乘1000
        let date = new Date(timestamp);
        let Y = date.getFullYear() + "-";
        let M = (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        let h = date.getHours() + ":";
        let m = date.getMinutes() + ":";
        let s = date.getSeconds();
        return Y + M + D + h + m + s;
    }

    export function Stop() {
        isWorking = false;
    }
    export function Init() {
        //**覆盖 */
        GTimerHelper.NowUnix = NowUnix;
        isWorking = true;
        let interval = GTimerHelper.GetUpdateInterval();
        $.Schedule(interval, () => {
            Update(interval);
        });
    }
    function NowUnix() {
        return Date.now()
    }
    function Update(interval: number): void {
        GTimerHelper.Update(interval);
        isWorking && Init();
    }
}
