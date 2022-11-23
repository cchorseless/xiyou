export class EnemyState {

    public static readonly SpawnEnemyPoint: Vector[] = [];
    private static readonly EnemyWayPoint: { [k: string]: Vector } = {};

    public static init() {
        // this.SpawnEnemyPoint.push(this.getEnemyWayPos("player_0_start"));
        // this.SpawnEnemyPoint.push(this.getEnemyWayPos("player_1_start"));
        // this.SpawnEnemyPoint.push(this.getEnemyWayPos("player_2_start"));
        // this.SpawnEnemyPoint.push(this.getEnemyWayPos("player_3_start"));
    }

    public static getEnemyWayPos(pointName: string) {
        if (this.EnemyWayPoint[pointName] == null) {
            this.EnemyWayPoint[pointName] = Entities.FindByName(null, pointName).GetAbsOrigin()
        }
        return this.EnemyWayPoint[pointName];
    }

}