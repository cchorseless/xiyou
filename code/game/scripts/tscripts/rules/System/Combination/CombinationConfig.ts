export module CombinationConfig {

    export enum EEffectTargetType {
        team = "team",
        hero = "hero",
        enemy = "enemy",
    }

    export namespace I {
        export interface ICombinationHandler {
            OnApplyCombinationEffect(str: string): void;
            OnCancelCombinationEffect(str: string): void;
        }
    }
}