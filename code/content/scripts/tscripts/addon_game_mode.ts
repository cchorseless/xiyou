// LogHelper必须放第一行先导入
import { AllEntity } from "./AllEntity";
import { GameCache } from "./GameCache";
import { GameMode } from "./GameMode";
import { LogHelper } from "./helper/LogHelper";
import { TimerHelper } from "./helper/TimerHelper";
import { FromBase64, ToBase64 } from "./lib/Base64";
import { CompressZlib, DecompressZlib } from "./lib/zlib";
LogHelper.print("IsServer start-----------------------------------")
GameCache.Init();
AllEntity.Init();
TimerHelper.Init();
Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.Addon) {
    GameRules.Addon.Reload();
}
let test1 = "User can use coroutine.yield inside the hook function.";
let out = CompressZlib(test1, { level: 9, strategy: "dynamic" });
LogHelper.print(out.length);
let tobase64 = ToBase64(out)
let server64 = "eNrl2k9q20AUBvC7aK2F5r2RFWtZpbSGNAlxcBelGNUe1wOSxkhKwYQsuugJepieqIveoiPLAofPtJuAIA+MmX+ekT4Q/Pzsx2DZBmlw9fAmrzJXbezXzJU7V5mqDcJgadd+Mk5UMtUqjpgnSZwkiZ/JCuuXzPfVqv+UX9Zs3W7Zva0OI+mnx9k6VVEUqXDWLHJb+F449/P3+51Jo0PzOi9N+t6V5tC7M5vaNNuT+Xmb1+29LYf+Ii/seuiborDVxvmDumZ/HXY4shsq8i+mSP98//n7x69+JHMPVZv27dPT3n4z9f4y3x8mnh3q+6eHzlpT9if5m+u7h3s4TnS7R2Hmmvaw7TtXrMOb2l9WdVvbVbfBncmLoX3jT52b/PmC4+DpukvbrI5bL+zuypa2aw6hRuFTiAkQJEBjJPDRubESYEiAx0jgg2nzeeufqJFi0BCDHiOG6/ESiCGBWFgCE0hgIiyBBBJIhCVwAQlcCEtgCglMZSWgImRRJCyCMzJUwiJAGioSFgHaULGwCNCFShgMFcJQCZOhQhmqV03Dz10Ks+Er8r/rEre12zUvW5hQ6FAlDKIKIaqESVShRJUwihJSlIRRlJCiJIyidKZKKYyihBQlYRQlpCgJoyghRUkYRQkpSsKqlIQ6JGE6JNQhCdMhoQ5JmA4ZdcjCdMioQxamQ0YdsjAd8pkfsVlKfYb/U5/JtqZpX7Y+w0hRFkZRRoqyMIoyUpSFUZSRoiyMoowUZWEUZaQoC6OoRopqYRTVSFEtjKIaKaqFUVQjRbWwQqU+819KYTrUqEMtTIcadaiF6VCjDrUwHWrUoRamQ4061MJ0GKMOY2E6jFGHsTAdxqjDmF55lc6/gqe/PBp8dg=="
let frombase = FromBase64(server64)
let out2 = DecompressZlib(frombase)
LogHelper.print(test1);
LogHelper.print(tobase64);
LogHelper.print(test1 == out2);
LogHelper.print(out2);
