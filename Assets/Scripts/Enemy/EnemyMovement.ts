namespace PROJECT {
  export class EnemyMovement extends TOOLKIT.ScriptComponent {
    public isPlayerInRange: boolean = false;
    public speed: number = 3.5;
    public rotateSpeed: number = 30.0;

    private player: BABYLON.TransformNode;
    private playerHealth: PROJECT.PlayerHealth;
    private enemyHealth: PROJECT.EnemyHealth;
    private enemyShooting: PROJECT.EnemyShooting;
    private nav: TOOLKIT.NavigationAgent;

    constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.EnemyMovement") {
      super(transform, scene, properties, alias);
    }

    protected start(): void {
      // Set up the references.
      this.player = TOOLKIT.SceneManager.FindGameObjectWithTag(this.scene, "Player") as BABYLON.TransformNode;
      this.playerHealth = this.player ? TOOLKIT.SceneManager.GetComponent(this.player, "PROJECT.PlayerHealth") as PROJECT.PlayerHealth : null;
      this.enemyHealth = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.EnemyHealth") as PROJECT.EnemyHealth;
      this.enemyShooting = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.EnemyShooting") as PROJECT.EnemyShooting;
      this.nav = TOOLKIT.SceneManager.GetComponent(this.transform, "TOOLKIT.NavigationAgent") as TOOLKIT.NavigationAgent;
      
      // Configure navigation agent settings
      if (this.nav && this.enemyShooting) {
        this.nav.stoppingDistance = this.enemyShooting.distanceToAttack;
      }
    }

    protected update(): void {
      // If the enemy and the player have health left...
      if (this.enemyHealth && this.playerHealth && this.enemyHealth.currentHealth > 0 && this.playerHealth.currentHealth > 0) {
        if (!this.player) return;

        // Calculate distance to player
        const distanceToPlayer = BABYLON.Vector3.Distance(this.transform.position, this.player.position);
        
        // Check if player is within stopping distance
        if (this.nav && distanceToPlayer < this.nav.stoppingDistance) {
          // Player is in range - rotate towards player
          let direction: BABYLON.Vector3 = this.player.position.subtract(this.transform.position);
          direction.y = 0; // Ignore Y axis for rotation
          
          if (direction.lengthSquared() > 0.001) {
            direction.normalize();
            
            // Create target rotation from direction
            // Use FromLookDirectionRH for correct rotation (Babylon uses right-handed)
            let targetRotation = BABYLON.Quaternion.RotationYawPitchRoll(
              Math.atan2(direction.x, direction.z),
              0,
              0
            );
            
            // The step size - faster rotation for more responsive aiming
            let rotationSpeed = this.rotateSpeed * this.getDeltaTime();
            
            // Get current rotation
            if (!this.transform.rotationQuaternion) {
              this.transform.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
                this.transform.rotation.x, 
                this.transform.rotation.y, 
                this.transform.rotation.z
              );
            }
            
            // Smoothly rotate towards target
            this.transform.rotationQuaternion = BABYLON.Quaternion.Slerp(
              this.transform.rotationQuaternion,
              targetRotation,
              Math.min(1.0, rotationSpeed * 0.1)
            );
            
            // Check if enemy is facing the player (within acceptable angle threshold)
            // Get current forward direction
            let currentForward = new BABYLON.Vector3(0, 0, 1);
            let rotationMatrix = new BABYLON.Matrix();
            BABYLON.Matrix.FromQuaternionToRef(this.transform.rotationQuaternion, rotationMatrix);
            currentForward = BABYLON.Vector3.TransformNormal(currentForward, rotationMatrix);
            currentForward.normalize();
            
            // Calculate angle between forward and direction to player
            let dot = BABYLON.Vector3.Dot(currentForward, direction);
            // Clamp dot product to avoid Math.acos errors
            dot = Math.max(-1, Math.min(1, dot));
            let angleInDegrees = Math.acos(dot) * (180 / Math.PI);
            
            // Only set isPlayerInRange to true if facing within 25 degrees (more forgiving)
            this.isPlayerInRange = angleInDegrees < 25;
          } else {
            this.isPlayerInRange = false;
          }
        } else {
          // Set the destination of the nav mesh agent to the player
          if (this.nav) {
            this.nav.setDestination(this.player.position);
          }
          this.isPlayerInRange = false;
        }
      } else {
        // Stop the nav mesh agent when either enemy or player is dead
        if (this.nav) {
          // Stop navigation by setting destination to current position
          this.nav.setDestination(this.transform.position);
        }
        this.isPlayerInRange = false;
      }
    }
  }
}
// Pseudocode generated by codewrx.ai