export module CombinationConfig {
    export namespace I {
        export interface ICombinationHandler {
            OnApplyCombinationEffect(str: string): void;
            OnCancelCombinationEffect(str: string): void;
        }
    }
}