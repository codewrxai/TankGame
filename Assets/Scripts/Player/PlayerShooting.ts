namespace PROJECT {
  export class PlayerShooting extends TOOLKIT.ScriptComponent {
    public damagePerShot: number = 20;
    public timeBetweenBullets: number = 1;
    public bullet: BABYLON.TransformNode;
    public bulletForce: number = 10;

    private shotAudio: TOOLKIT.AudioSource;
    private bulletSpawnPoint: BABYLON.TransformNode;
    private timer: number = 0;

    constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PlayerShooting") {
      super(transform, scene, properties, alias);
    }

    protected start(): void {
      this.bulletSpawnPoint = TOOLKIT.SceneManager.FindGameObjectWithTag(this.scene, "Player") as BABYLON.TransformNode;
      this.shotAudio = this.getComponent("TOOLKIT.AudioSource") as TOOLKIT.AudioSource;
    }

    protected update(): void {
      this.timer += this.getDeltaTime();
      let IC = TOOLKIT.InputController;
      let spacePressed: boolean = IC.GetKeyboardInput(TOOLKIT.UserInputKey.SpaceBar);
      if (spacePressed && this.timer >= this.timeBetweenBullets) {
        this.shoot();
      }
    }

    private async shoot(): Promise<void> {
      this.timer = 0;

      if (this.shotAudio) this.shotAudio.play();
      if (!this.bulletSpawnPoint) {
        TOOLKIT.SceneManager.ConsoleError("PlayerShooting: 'SpawnPoint' object with tag not found.");
        return;
      }
      let bulletContainer = SM.GetAssetContainer(this.scene, "playerbullet.glb");
      const spawnPointPosition = this.bulletSpawnPoint.getAbsolutePosition();
      console.log("Spawn Point Position:", spawnPointPosition);
      const spawnOffset = new BABYLON.Vector3(0, 1.3, 0);
      let bulletClone: BABYLON.TransformNode = SM.InstantiatePrefabFromContainer(bulletContainer, "PlayerBullet","PlayerBullet_Clone",null,spawnPointPosition.add(spawnOffset),BABYLON.Quaternion.Identity());
      if (!bulletClone) {
        SM.ConsoleError("PlayerShooting: Failed to instantiate 'PlayerBullet' prefab.");
        return;
      }

      // Nudge the bullet forward to avoid collision with player
      const forwardNudge = TOOLKIT.Utilities.GetForwardVector(this.transform).scale(2);
      bulletClone.position.addInPlace(forwardNudge);

      // Apply impulse for projectile motion
      const rigidbody = bulletClone.physicsBody;
      if (rigidbody) {
        const forwardDirection = TOOLKIT.Utilities.GetForwardVector(this.transform);
        rigidbody.applyImpulse(forwardDirection.scale(this.bulletForce), bulletClone.getAbsolutePosition());
      } else {
        TOOLKIT.SceneManager.ConsoleWarn("PlayerShooting: Instantiated bullet is missing a physicsBody. Check the prefab in Unity.");
      }
      console.log("bulletClone position after impulse:", bulletClone.getAbsolutePosition()); 
    }

    // ... (rest of the class is the same)
    public async getStrongerWeapon(time: number): Promise<void> {
      await this.getStrongerWeaponCourtine(time);
    }
    private async getStrongerWeaponCourtine(time: number): Promise<void> {
      this.damagePerShot += 20;
      this.timeBetweenBullets /= 4;
      await TOOLKIT.SceneManager.WaitForSeconds(time);
      this.damagePerShot -= 20;
      this.timeBetweenBullets *= 4;
    }
  }
}