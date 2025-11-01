namespace PROJECT {
  export class PlayerHealth extends TOOLKIT.ScriptComponent {
    public startingHealth: number = 100; // The amount of health the player starts the game with.
    public currentHealth: number; // The current health the player has.
    public deathClip: BABYLON.Sound; // The audio clip to play when the player dies.
    public flashSpeed: number = 5; // The speed the damageImage will fade at.

    private playerMovement: TOOLKIT.ScriptComponent; // Reference to the player's movement.
    private playerShooting: TOOLKIT.ScriptComponent; // Reference to the PlayerShooting script.
    //private playerAudio: TOOLKIT.AudioSource; // Reference to the AudioSource component.

    private isDamaged: boolean = false; // Indicate Wheather the player gets damaged.
    private isDead: boolean = false; // Indicate whether the player is dead.
    private isInvulnerable: boolean = false; // Indicates whether the player cannot be damaged.

    // UI Elements
    private advancedTexture: BABYLON.GUI.AdvancedDynamicTexture;
    private healthSlider: BABYLON.GUI.Slider;
    private healthBackground: BABYLON.GUI.Rectangle;
    private damageFlash: BABYLON.GUI.Rectangle;

    constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PlayerHealth") {
      super(transform, scene, properties, alias);
    }

    protected awake(): void {
      this.playerMovement = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.PlayerMovement") as TOOLKIT.ScriptComponent;
      this.playerShooting = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.PlayerShooting") as TOOLKIT.ScriptComponent;
      //this.playerAudio = TOOLKIT.SceneManager.GetComponent(this.transform, "TOOLKIT.AudioSource") as TOOLKIT.AudioSource;

      this.currentHealth = this.startingHealth;
      
      // Create UI
      this.createHealthUI();
      
      console.log("PlayerHealth: UI created successfully!");
    }

    private createHealthUI(): void {
      // Create fullscreen UI (or reuse if exists)
      this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("HealthUI", true, this.scene);

      // Health Slider Background - Bottom Left
      this.healthBackground = new BABYLON.GUI.Rectangle("HealthBackground");
      this.healthBackground.width = "300px";
      this.healthBackground.height = "40px";
      this.healthBackground.cornerRadius = 20;
      this.healthBackground.color = "white";
      this.healthBackground.thickness = 2;
      this.healthBackground.background = "rgba(0, 0, 0, 0.5)";
      this.healthBackground.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
      this.healthBackground.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
      this.healthBackground.left = 20;
      this.healthBackground.top = -20;
      this.advancedTexture.addControl(this.healthBackground);

      // Health Slider - Inside Background
      this.healthSlider = new BABYLON.GUI.Slider("HealthSlider");
      this.healthSlider.minimum = 0;
      this.healthSlider.maximum = 100;
      this.healthSlider.value = 100;
      this.healthSlider.width = "280px";
      this.healthSlider.height = "30px";
      this.healthSlider.color = "#00ff00"; // Green for health
      this.healthSlider.background = "rgba(50, 50, 50, 0.8)";
      this.healthSlider.borderColor = "transparent";
      this.healthSlider.isThumbCircle = false;
      this.healthSlider.isThumbClamped = true;
      this.healthSlider.displayThumb = false;
      this.healthBackground.addControl(this.healthSlider);

      // Damage Flash - Fullscreen Red Overlay
      this.damageFlash = new BABYLON.GUI.Rectangle("DamageFlash");
      this.damageFlash.width = "100%";
      this.damageFlash.height = "100%";
      this.damageFlash.background = "rgba(255, 0, 0, 0.3)";
      this.damageFlash.alpha = 0;
      this.damageFlash.thickness = 0;
      this.damageFlash.isHitTestVisible = false;
      this.advancedTexture.addControl(this.damageFlash);
    }

    private updateHealthDisplay(): void {
      if (this.healthSlider) {
        this.healthSlider.value = this.currentHealth;
        
        // Change color based on health percentage
        const healthPercent = this.currentHealth / this.startingHealth;
        if (healthPercent > 0.5) {
          this.healthSlider.color = "#00ff00"; // Green
        } else if (healthPercent > 0.25) {
          this.healthSlider.color = "#ffff00"; // Yellow
        } else {
          this.healthSlider.color = "#ff0000"; // Red
        }
      }
    }

    protected update(): void {
      // Fade damage flash
      if (this.damageFlash && this.damageFlash.alpha > 0) {
        this.damageFlash.alpha = BABYLON.Scalar.Lerp(
          this.damageFlash.alpha,
          0,
          this.flashSpeed * this.getDeltaTime()
        );
      }
      
      this.isDamaged = false;
    }

    public takeDamage(amount: number): void {
      if (this.isInvulnerable) {
        return;
      }

      // Set the damaged flag so the screen will flash.
      this.isDamaged = true;

      // Flash damage effect
      if (this.damageFlash) {
        this.damageFlash.alpha = 0.5;
      }

      // Reduce the current health by the damage amount.
      this.currentHealth -= amount;

      // Update health slider
      this.updateHealthDisplay();

      // Play the hurt sound effect.
      //if (this.playerAudio) { this.playerAudio.play(); }

      // If the player has lost all it's health and the death flag hasn't been set yet...
      if (this.currentHealth <= 0 && !this.isDead) {
        this.death();
      }
    }

    public addShield(time: number): void {
      this.addShieldCourtine(time);
    }

    public async addShieldCourtine(time: number): Promise<void> {
      this.isInvulnerable = true;

      this.blink(time);

      await TOOLKIT.SceneManager.WaitForSeconds(time);

      this.isInvulnerable = false;
    }

    private async blink(waitTime: number): Promise<void> {
      let endTime: number = this.scene.getEngine().getDeltaTime() / 1000 + waitTime;
      let elapsed: number = 0;
      while (elapsed < waitTime) {
        let renders: BABYLON.AbstractMesh[] = [];
        if (this.transform instanceof BABYLON.TransformNode) {
          renders = this.transform.getChildMeshes();
        }
        for (let i = 0; i < renders.length; i++) {
          renders[i].setEnabled(false);
        }

        await TOOLKIT.SceneManager.WaitForSeconds(0.2);

        for (let i = 0; i < renders.length; i++) {
          renders[i].setEnabled(true);
        }

        await TOOLKIT.SceneManager.WaitForSeconds(0.2);
        elapsed += 0.4;
      }
    }

    public getLife(amount: number): void {
      // Increase the current health by the life amount.
      this.currentHealth += amount;

      // Make sure the amount of health is not higher than a hundred
      this.currentHealth = Math.max(0, Math.min(this.currentHealth, 100));

      // Update health display
      this.updateHealthDisplay();
    }

    private death(): void {
      // Set the death flag so this function won't be called again.
      this.isDead = true;

      // Set the audiosource to play the death clip and play it (this will stop the hurt sound from playing).
      //if (this.playerAudio) {
      //  this.playerAudio.stop();
      //  this.playerAudio.clip = this.deathClip;
      //  this.playerAudio.play();
      //}

      if (this.playerMovement && typeof (this.playerMovement as any).setEnabled === "function") {
        (this.playerMovement as any).setEnabled(false);
      }
      if (this.playerShooting && typeof (this.playerShooting as any).setEnabled === "function") {
        (this.playerShooting as any).setEnabled(false);
      }
    }
  }
}
// Pseudocode generated by codewrx.ai