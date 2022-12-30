export module TaskConfig {
    /**任务类型 */
    export enum TaskType {
        /**对局任务 */
        GameTask = 1,
        /**角色任务 */
        RoleTask,
        /**协作任务 */
        TeamTask,
        /**随机任务 */
        RandomTask,
    }
    /**奖励类型 */
    export enum PrizeType {
        Gold = 1000,
        Exp,
        RankExp,
    }
    /**奖励等级 */
    export enum PrizeLevel {
        /**无星级 */
        noneStar,
        /**1星奖励 */
        oneStar,
        twoStar,
        threeStar
    }
    /**任务完成类型  */
    export enum TaskFinishType {
        /**对话 */
        Talk,
        /**采集 */
        Collect,
        /**杀怪 */
        Kill,
        /**使用道具 */
        UseItem,
        /**上交道具 */
        GiveItem,
        /**拥有道具 */
        HasItem,
        /**协作任务完成 */
        SuccessTeamTask,
        /**破坏协作任务 */
        FailTeamTask,
    }

}