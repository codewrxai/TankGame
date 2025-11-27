namespace PROJECT {
  export class EnemyParticles extends TOOLKIT.ScriptComponent {
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
      // Create movement particle system
      this.movementParticles = new BABYLON.ParticleSystem("EnemyMovementParticles", 300, this.scene);
      
      // Emitter at a fixed offset behind the tank - we'll update it in update()
      this.movementParticles.emitter = this.transform.position.clone();
      
      // Emit from a tight point behind the tank
      this.movementParticles.minEmitBox = new BABYLON.Vector3(0, 0, 0);
      this.movementParticles.maxEmitBox = new BABYLON.Vector3(0, 0, 0);
      
      // Use a proper smoke texture or create a soft circle
      this.movementParticles.particleTexture = new BABYLON.Texture("https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/packages/tools/playground/public/textures/flare.png", this.scene);
      
      // Smoke colors - gray/white smoke that fades
      this.movementParticles.color1 = new BABYLON.Color4(0.7, 0.7, 0.7, 0.8);
      this.movementParticles.color2 = new BABYLON.Color4(0.5, 0.5, 0.5, 0.5);
      this.movementParticles.colorDead = new BABYLON.Color4(0.3, 0.3, 0.3, 0);
      
      // Size - start small and grow
      this.movementParticles.minSize = 0.5;
      this.movementParticles.maxSize = 1.5;
      this.movementParticles.minScaleX = 1.0;
      this.movementParticles.maxScaleX = 2.0;
      this.movementParticles.minScaleY = 1.0;
      this.movementParticles.maxScaleY = 2.0;
      
      // Lifetime - smoke dissipates quickly
      this.movementParticles.minLifeTime = 0.5;
      this.movementParticles.maxLifeTime = 1.0;
      
      // Emission rate
      this.movementParticles.emitRate = 50;
      
      // Blend mode for smooth smoke
      this.movementParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD;
      
      // Slight upward drift
      this.movementParticles.gravity = new BABYLON.Vector3(0, 0.5, 0);
      
      // Direction - particles drift slightly upward and spread
      this.movementParticles.direction1 = new BABYLON.Vector3(-0.3, 0.5, -0.5);
      this.movementParticles.direction2 = new BABYLON.Vector3(0.3, 1, -0.3);
      
      // Speed - slow smoke
      this.movementParticles.minEmitPower = 0.5;
      this.movementParticles.maxEmitPower = 1.5;
      this.movementParticles.updateSpeed = 0.02;
      
      // Add size over lifetime for expanding smoke
      this.movementParticles.addSizeGradient(0, 0.5);
      this.movementParticles.addSizeGradient(0.5, 1.0);
      this.movementParticles.addSizeGradient(1.0, 1.5);
      
      // Add color gradient for fading
      this.movementParticles.addColorGradient(0, new BABYLON.Color4(0.7, 0.7, 0.7, 0.6));
      this.movementParticles.addColorGradient(0.5, new BABYLON.Color4(0.5, 0.5, 0.5, 0.4));
      this.movementParticles.addColorGradient(1.0, new BABYLON.Color4(0.3, 0.3, 0.3, 0));
      
      // Start the particle system
      this.movementParticles.start();
    }

    private createDeathParticles(): void {
      // Create death particle system (not started initially)
      this.deathParticles = new BABYLON.ParticleSystem("EnemyDeathParticles", 1000, this.scene);
      
      // Texture
      this.deathParticles.particleTexture = new BABYLON.Texture("textures/particles/explosion.png", this.scene);
      
      // Position
      this.deathParticles.emitter = this.transform.position;
      this.deathParticles.minEmitBox = new BABYLON.Vector3(-1, 0, -1);
      this.deathParticles.maxEmitBox = new BABYLON.Vector3(1, 2, 1);
      
      // Colors - Red/Orange explosion
      this.deathParticles.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
      this.deathParticles.color2 = new BABYLON.Color4(1, 0, 0, 1);
      this.deathParticles.colorDead = new BABYLON.Color4(0.2, 0.2, 0.2, 0);
      
      // Size
      this.deathParticles.minSize = 2.5;
      this.deathParticles.maxSize = 3.5;
      
      // Lifetime
      this.deathParticles.minLifeTime = 2;
      this.deathParticles.maxLifeTime = 2;
      
      // Emission
      this.deathParticles.emitRate = 200;
      
      // Blend mode
      this.deathParticles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
      
      // Gravity
      this.deathParticles.gravity = new BABYLON.Vector3(0, -9.81, 0);
      
      // Direction - explosion outward
      this.deathParticles.direction1 = new BABYLON.Vector3(-1, 1, -1);
      this.deathParticles.direction2 = new BABYLON.Vector3(1, 3, 1);
      
      // Speed
      this.deathParticles.minEmitPower = 5;
      this.deathParticles.maxEmitPower = 10;
      this.deathParticles.updateSpeed = 0.01;
      
      // Angular speed for rotation
      this.deathParticles.minAngularSpeed = 0;
      this.deathParticles.maxAngularSpeed = Math.PI;
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
      
      // Play death particles
      if (this.deathParticles) {
        this.deathParticles.start();
        
        // Stop after 2 seconds (particle lifetime)
        setTimeout(() => {
          if (this.deathParticles) {
            this.deathParticles.stop();
          }
        }, 2000);
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
