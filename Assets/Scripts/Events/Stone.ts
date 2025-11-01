namespace PROJECT {
  export class Stone extends TOOLKIT.ScriptComponent {
    public damage: number = 20; // The amount of health taken away when hit.
    public height: number = 6; // The height factor of the stone above the player.
    public timeToFollow: number = 1.5; // The time that the stone follow the player.

    private player: BABYLON.TransformNode;
    private timer: number = 0;
    private hasAddedPhysics: boolean = false;

    constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.Stone") {
      super(transform, scene, properties, alias);
    }

    protected start(): void {
      this.player = TOOLKIT.SceneManager.FindGameObjectWithTag(this.scene, "Player") as BABYLON.TransformNode;
      
      // Enable collision events
      this.enableCollisionEvents();
      
      // Make physics body kinematic initially (so it can follow player without physics)
      if (this.transform.physicsBody) {
        // Set motion type to ANIMATED (kinematic in Babylon.js Physics V2)
        this.transform.physicsBody.setMotionType(BABYLON.PhysicsMotionType.ANIMATED);
        console.log("Stone: Set to ANIMATED (kinematic) mode");
      }
      
      // Subscribe to collision enter observable
      this.onCollisionEnterObservable.add((other: BABYLON.TransformNode) => {
        if (TOOLKIT.SceneManager.GetTransformTag(other) === "Player") {
          let playerHealth = TOOLKIT.SceneManager.GetComponent(this.player, "PROJECT.PlayerHealth") as PROJECT.PlayerHealth;
          if (playerHealth && playerHealth.currentHealth > 0) {
            playerHealth.takeDamage(this.damage);
          }
        }
        
        // Destroy after delay, with proper cleanup
        this.destroyWithCleanup(0.5);
      });
      
      this.followPlayerCoroutine();
    }

    private async followPlayerCoroutine(): Promise<void> {
      // Follow player for timeToFollow duration
      const startTime = performance.now();
      while ((performance.now() - startTime) / 1000 < this.timeToFollow) {
        if (this.player && !this.player.isDisposed()) {
          this.transform.position = this.player.position.add(BABYLON.Vector3.Up().scale(this.height));
        }
        await TOOLKIT.SceneManager.WaitForSeconds(0.016); // ~60fps updates (yield return null equivalent)
      }
      
      console.log("Stone: Follow time complete, enabling physics");
      // After following, add physics (rigidbody) to make it fall
      this.addPhysicsBody();
    }

    private addPhysicsBody(): void {
      if (this.hasAddedPhysics || !this.transform || this.transform.isDisposed()) return;
      this.hasAddedPhysics = true;
      
      // Switch from ANIMATED (kinematic) to DYNAMIC to enable physics/gravity
      if (this.transform.physicsBody) {
        // Change motion type to DYNAMIC - this allows gravity to affect the stone
        this.transform.physicsBody.setMotionType(BABYLON.PhysicsMotionType.DYNAMIC);
        
        // Reduce mass to make it fall slower
        this.transform.physicsBody.setMassProperties({ mass: 0.5 });
        
        // Add linear damping to slow down the fall (air resistance)
        this.transform.physicsBody.setLinearDamping(2.0); // Higher = slower fall
        
        console.log("Stone: Changed to DYNAMIC mode with reduced fall speed");
      } else {
        console.warn("Stone: No physicsBody found on stone!");
      }
    }

    protected update(): void {
      // Timer no longer needed - coroutine handles timing
      // this.timer += this.getDeltaTime();
    }

    private async destroyWithCleanup(delay: number): Promise<void> {
      await TOOLKIT.SceneManager.WaitForSeconds(delay);
      
      // Dispose of any lights attached to this object or its children
      this.disposeLights();
      
      // Safely destroy the transform
      if (this.transform && !this.transform.isDisposed()) {
        TOOLKIT.SceneManager.SafeDestroy(this.transform);
      }
    }

    private disposeLights(): void {
      if (!this.transform || this.transform.isDisposed()) return;
      
      try {
        const allLights = this.scene.lights.slice();
        
        for (let light of allLights) {
          try {
            let lightNode = light as any;
            if (lightNode.parent === this.transform) {
              light.setEnabled(false);
              setTimeout(() => {
                if (!light.isDisposed()) {
                  light.dispose();
                }
              }, 0);
            }
          } catch (e) {}
        }
        
        const children = this.transform.getChildren();
        for (let child of children) {
          for (let light of this.scene.lights.slice()) {
            try {
              if (light === child || (light as any).parent === child) {
                light.setEnabled(false);
                setTimeout(() => {
                  if (!light.isDisposed()) {
                    light.dispose();
                  }
                }, 0);
              }
            } catch (e) {}
          }
        }
      } catch (e) {}
    }
  }
}
// Pseudocode generated by codewrx.ai