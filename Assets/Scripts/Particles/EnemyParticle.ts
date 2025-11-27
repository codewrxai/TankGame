namespace PROJECT {
  export class EnemyParticle extends TOOLKIT.ScriptComponent {
    private movementParticles: BABYLON.ParticleSystem;
    private deathParticles: BABYLON.ParticleSystem;
    private enemyMovement: PROJECT.EnemyMovement;
    private enemyHealth: PROJECT.EnemyHealth;

    constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.EnemyParticles") {
      super(transform, scene, properties, alias);
    }

    protected start(): void {
      this.enemyMovement = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.EnemyMovement") as PROJECT.EnemyMovement;
      this.enemyHealth = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.EnemyHealth") as PROJECT.EnemyHealth;
      
      this.createMovementParticles();
      this.createDeathParticles();
    }

    private createMovementParticles(): void {
      // Create dense smoke trail - IDENTICAL to PlayerParticles smoke
      // White/light gray smoke with reduced opacity
      this.movementParticles = new BABYLON.ParticleSystem("EnemyMovementParticles", 2000, this.scene);
      
      // Emitter at a fixed offset behind the tank - we'll update it in update()
      this.movementParticles.emitter = this.transform.position.clone();
      
      // Emit from a small area for concentrated smoke
      this.movementParticles.minEmitBox = new BABYLON.Vector3(-0.05, 0, -0.05);
      this.movementParticles.maxEmitBox = new BABYLON.Vector3(0.05, 0, 0.05);
      
      // Duration: 5 (looping enabled)
      this.movementParticles.targetStopDuration = 5;
      
      // Longer lifetime for persistent trail visible in screenshot
      this.movementParticles.minLifeTime = 1.5;
      this.movementParticles.maxLifeTime = 2.5;
      
      // Low speed - particles should float gently behind tank
      this.movementParticles.minEmitPower = 0.5;
      this.movementParticles.maxEmitPower = 1.5;
      
      // Larger particles for better visibility
      this.movementParticles.minSize = 1.5;
      this.movementParticles.maxSize = 2.5;
      
      // Random rotation for natural look
      this.movementParticles.minInitialRotation = 0;
      this.movementParticles.maxInitialRotation = 2 * Math.PI;
      
      // White/gray smoke color - reduced opacity for thinner smoke (0.5 instead of 0.8)
      this.movementParticles.color1 = new BABYLON.Color4(0.9, 0.9, 0.9, 0.5);
      this.movementParticles.color2 = new BABYLON.Color4(0.8, 0.8, 0.8, 0.4);
      this.movementParticles.colorDead = new BABYLON.Color4(0.6, 0.6, 0.6, 0);
      
      // Slight upward drift
      this.movementParticles.gravity = new BABYLON.Vector3(0, 0.5, 0);
      
      // Simulation Speed: 1
      this.movementParticles.updateSpeed = 0.01;
      
      // HIGH emission rate for dense, visible smoke trail like in screenshot
      this.movementParticles.emitRate = 150;
      
      // Direction - mostly backward with slight spread
      this.movementParticles.direction1 = new BABYLON.Vector3(-0.2, 0.2, -0.3);
      this.movementParticles.direction2 = new BABYLON.Vector3(0.2, 0.8, 0.3);
      
      // Use smoke texture
      this.movementParticles.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/cloud.png", this.scene);
      
      // Billboard rendering
      this.movementParticles.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;
      
      // Standard blending for solid-looking smoke
      this.movementParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
      
      // Particles grow and fade over lifetime
      this.movementParticles.addSizeGradient(0, 0.5);
      this.movementParticles.addSizeGradient(0.5, 1.0);
      this.movementParticles.addSizeGradient(1.0, 1.5);
      
      // Color fades from white to transparent - reduced opacity values
      this.movementParticles.addColorGradient(0, new BABYLON.Color4(0.9, 0.9, 0.9, 0.6));
      this.movementParticles.addColorGradient(0.4, new BABYLON.Color4(0.8, 0.8, 0.8, 0.4));
      this.movementParticles.addColorGradient(0.8, new BABYLON.Color4(0.7, 0.7, 0.7, 0.2));
      this.movementParticles.addColorGradient(1.0, new BABYLON.Color4(0.6, 0.6, 0.6, 0));
      
      // Rotation over lifetime
      this.movementParticles.minAngularSpeed = -0.3;
      this.movementParticles.maxAngularSpeed = 0.3;
      
      // Start the particle system
      this.movementParticles.start();
    }

    private createDeathParticles(): void {
      // Create death particle system matching Unity Inspector settings
      // PlayerBulletExplosion configuration
      this.deathParticles = new BABYLON.ParticleSystem("EnemyDeathParticles", 1000, this.scene);
      
      // Duration: 2 (not looping)
      this.deathParticles.targetStopDuration = 2;
      
      // Start Lifetime: 0.75 to 0.5
      this.deathParticles.minLifeTime = 0.5;
      this.deathParticles.maxLifeTime = 0.75;
      
      // Start Speed: 0
      this.deathParticles.minEmitPower = 0;
      this.deathParticles.maxEmitPower = 0;
      
      // 3D Start Size: 1 to 0.5
      this.deathParticles.minSize = 0.5;
      this.deathParticles.maxSize = 1.0;
      
      // 3D Start Rotation: 0 to 360
      this.deathParticles.minInitialRotation = 0;
      this.deathParticles.maxInitialRotation = 2 * Math.PI;
      
      // Flip Rotation: 0
      // Start Color: White
      this.deathParticles.color1 = new BABYLON.Color4(1, 1, 1, 1);
      this.deathParticles.color2 = new BABYLON.Color4(1, 1, 1, 1);
      
      // Gravity Source: 3D Physics
      // Gravity Modifier: 0
      this.deathParticles.gravity = new BABYLON.Vector3(0, 0, 0);
      
      // Simulation Space: Local
      // Simulation Speed: 1
      this.deathParticles.updateSpeed = 0.01;
      
      // Delta Time: Scaled
      // Scaling Mode: Local
      // Play On Awake: false
      // Max Particles: 1000
      
      // Stop Action: None
      // Culling Mode: Pause and Catch-up
      
      // Emission - Rate over Time: 0, Rate over Distance: 0
      this.deathParticles.emitRate = 0;
      
      // Bursts: Time 0.000, Count 5, Cycles 1, Interval 0.050, Probability 1.00
      // We'll trigger this manually with emit()
      
      // Shape: Sphere
      // Radius: 0.2
      // Radius Thickness: 1
      // Arc: 360
      // Mode: Random
      this.deathParticles.createSphereEmitter(0.2, 1);
      
      // Texture Sheet Animation: Grid mode, X:8, Y:8, whole sheet, lifetime
      this.deathParticles.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/cloud.png", this.scene);
      
      // Renderer: Billboard
      // Render Mode: Billboard
      // Material: Explosion (additive blending for bright explosion)
      this.deathParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
      
      // Sort Mode: By Distance
      // Min/Max Particle Size: 0 to 5
      this.deathParticles.minSize = 0;
      this.deathParticles.maxSize = 5;
      
      // Render Alignment: View
      // Allow Roll: checked
      
      // Masking: No Masking
      // Apply Active Color Space: checked
      // Custom Vertex Streams: checked
      
      // Cast Shadows: Off
      // Receive Shadows: Off
      // Motion Vectors: Per Object Motion
      
      this.deathParticles.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;
      
      // Size over lifetime gradient (particles grow then shrink)
      this.deathParticles.addSizeGradient(0, 0.5);
      this.deathParticles.addSizeGradient(0.3, 1.5);
      this.deathParticles.addSizeGradient(1.0, 0.3);
      
      // Color gradient for explosion effect (bright to dim)
      this.deathParticles.addColorGradient(0, new BABYLON.Color4(1, 0.8, 0.5, 1));
      this.deathParticles.addColorGradient(0.5, new BABYLON.Color4(1, 0.5, 0.2, 0.8));
      this.deathParticles.addColorGradient(1.0, new BABYLON.Color4(0.5, 0.3, 0.1, 0));
      
      // Don't auto-start - will be triggered on death
    }

    protected update(): void {
      // Update particle emitter position to be behind the enemy tank
      if (this.movementParticles) {
        // Get the tank's backward direction
        const backward = this.transform.forward.scale(-1);
        // Position emitter behind the tank
        const emitterPos = this.transform.position.add(backward.scale(1.5)).add(new BABYLON.Vector3(0, 0.2, 0));
        this.movementParticles.emitter = emitterPos;
      }

      // Keep movement particles active while enemy is moving and alive
      if (this.enemyHealth && this.enemyMovement && this.movementParticles) {
        // Check if enemy is alive
        if (this.enemyHealth.currentHealth > 0) {
          // Always show movement particles for enemy (they're usually moving via nav agent)
          if (!this.movementParticles.isStarted()) {
            this.movementParticles.start();
          }
        } else {
          // Stop movement particles when dead
          if (this.movementParticles.isStarted()) {
            this.movementParticles.stop();
          }
        }
      }
    }

    public playDeathParticles(): void {
      // Stop movement particles
      if (this.movementParticles) {
        this.movementParticles.stop();
      }
      
      // Play death particles with large burst
      if (this.deathParticles) {
        // Update emitter position to current transform position
        this.deathParticles.emitter = this.transform.position.clone();
        
        // Emit large burst of particles for visible explosion (20-30 particles)
        this.deathParticles.manualEmitCount = 25;
        this.deathParticles.start();
        
        // Stop after particle lifetime (0.6 seconds max)
        setTimeout(() => {
          if (this.deathParticles) {
            this.deathParticles.stop();
          }
        }, 600);
      }
    }

    public dispose(): void {
      if (this.movementParticles) {
        this.movementParticles.dispose();
      }
      if (this.deathParticles) {
        this.deathParticles.dispose();
      }
    }
  }
}
// Pseudocode generated by codewrx.ai
