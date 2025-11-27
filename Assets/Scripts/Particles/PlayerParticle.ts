namespace PROJECT {
  export class PlayerParticle extends TOOLKIT.ScriptComponent {
    private movementParticles: BABYLON.ParticleSystem;
    private deathParticles: BABYLON.ParticleSystem;
    private playerMovement: PROJECT.PlayerMovement;
    private playerHealth: PROJECT.PlayerHealth;

    constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PlayerParticles") {
      super(transform, scene, properties, alias);
    }

    protected start(): void {
      this.playerMovement = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.PlayerMovement") as PROJECT.PlayerMovement;
      this.playerHealth = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.PlayerHealth") as PROJECT.PlayerHealth;
      
      this.createMovementParticles();
      this.createDeathParticles();
    }

    private createMovementParticles(): void {
      // Create dense smoke trail - IDENTICAL to EnemyParticle smoke
      // White/light gray smoke with reduced opacity
      this.movementParticles = new BABYLON.ParticleSystem("PlayerMovementParticles", 2000, this.scene);
      
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
      this.deathParticles = new BABYLON.ParticleSystem("PlayerDeathParticles", 1000, this.scene);
      
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
      
      // Texture: None (Texture 2D)
      // Position, Rotation, Scale: all zeros/ones
      
      // Color by Speed: enabled
      // Size over Lifetime: enabled (will use gradient)
      
      // Texture Sheet Animation: Grid mode, X:8, Y:8, whole sheet, lifetime
      this.deathParticles.particleTexture = new BABYLON.Texture("https://assets.babylonjs.com/textures/cloud.png", this.scene);
      
      // Renderer: Billboard
      // Render Mode: Billboard
      // Material: Explosion (shader)
      this.deathParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
      
      // Sort Mode: By Distance
      // Min/Max Particle Size: 0 to 5
      this.deathParticles.minSize = 0;
      this.deathParticles.maxSize = 5;
      
      // Render Alignment: View
      // Flip: X 0.5, Y 0.5, Z 0
      // Allow Roll: checked
      // Pivot: X 0, Y 0, Z 0
      
      // Masking: No Masking
      // Apply Active Color Space: checked
      // Custom Vertex Streams: checked
      
      // Cast Shadows: Off
      // Receive Shadows: Off
      // Motion Vectors: Per Object Motion
      
      this.deathParticles.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;
      
      // Size over lifetime gradient (particles shrink/grow)
      this.deathParticles.addSizeGradient(0, 1.0);
      this.deathParticles.addSizeGradient(0.5, 1.5);
      this.deathParticles.addSizeGradient(1.0, 0.5);
      
      // Don't auto-start
      // this.deathParticles.start();
    }

    protected update(): void {
      // Update particle emitter position to be behind the tank
      if (this.movementParticles) {
        // Get the tank's backward direction
        const backward = this.transform.forward.scale(-1);
        // Position emitter behind the tank
        const emitterPos = this.transform.position.add(backward.scale(1.5)).add(new BABYLON.Vector3(0, 0.2, 0));
        this.movementParticles.emitter = emitterPos;
      }

      // Control movement particles based on player movement
      if (this.playerMovement && this.movementParticles) {
        const IC = TOOLKIT.InputController;
        const horizontal = IC.GetUserInput(TOOLKIT.UserInputAxis.Horizontal);
        const vertical = IC.GetUserInput(TOOLKIT.UserInputAxis.Vertical);
        
        // Only emit particles when moving
        if (Math.abs(horizontal) > 0.1 || Math.abs(vertical) > 0.1) {
          if (!this.movementParticles.isStarted()) {
            this.movementParticles.start();
          }
        } else {
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
      
      // Play death particles with burst
      if (this.deathParticles) {
        // Update emitter position to current transform position
        this.deathParticles.emitter = this.transform.position.clone();
        
        // Emit burst of 5 particles (matching Unity burst config)
        this.deathParticles.manualEmitCount = 5;
        this.deathParticles.start();
        
        // Stop after particle lifetime (0.75 seconds max)
        setTimeout(() => {
          if (this.deathParticles) {
            this.deathParticles.stop();
          }
        }, 750);
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
