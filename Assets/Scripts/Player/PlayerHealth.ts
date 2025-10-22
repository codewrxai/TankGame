namespace PROJECT {
  export class PlayerHealth extends TOOLKIT.ScriptComponent {
    public startingHealth: number = 100; // The amount of health the player starts the game with.
    public currentHealth: number; // The current health the player has.
    public healthSlider: BABYLON.GUI.Slider; // Reference to the UI's health bar.
    public damageImage: BABYLON.GUI.Image; // Reference to an image to flash on the screen on being hurt.
    public deathClip: BABYLON.Sound; // The audio clip to play when the player dies.
    public flashSpeed: number = 5; // The speed the damageImage will fade at.
    public flashColour: BABYLON.Color4 = new BABYLON.Color4(1, 0, 0, 0.1); // The colour the damageImage is set to, to flash.

  private playerMovement: TOOLKIT.ScriptComponent; // Reference to the player's movement.
  private playerShooting: TOOLKIT.ScriptComponent; // Reference to the PlayerShooting script.
    //private playerAudio: TOOLKIT.AudioSource; // Reference to the AudioSource component.

    private isDamaged: boolean = false; // Indicate Wheather the player gets damaged.
    private isDead: boolean = false; // Indicate whether the player is dead.
    private isInvulnerable: boolean = false; // Indicates whether the player cannot be damaged.

    constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.PlayerHealth") {
      super(transform, scene, properties, alias);
    }

    protected awake(): void {
  this.playerMovement = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.PlayerMovement") as TOOLKIT.ScriptComponent;
  this.playerShooting = TOOLKIT.SceneManager.GetComponent(this.transform, "PROJECT.PlayerShooting") as TOOLKIT.ScriptComponent;
      //this.playerAudio = TOOLKIT.SceneManager.GetComponent(this.transform, "TOOLKIT.AudioSource") as TOOLKIT.AudioSource;

      this.currentHealth = this.startingHealth;
    }

    protected update(): void {
      if (this.isDamaged) {
        // ... set the colour of the damageImage to the flash colour.
        if (this.damageImage) {
          // Convert Color4 to string (e.g., rgba)
          this.damageImage.color = `rgba(${this.flashColour.r * 255},${this.flashColour.g * 255},${this.flashColour.b * 255},${this.flashColour.a})`;
        }
      } else {
        // ... transition the colour back to clear.
        if (this.damageImage) {
          // Lerp alpha only for fade effect
          let current = this.damageImage.color;
          let match = /rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/.exec(current);
          let alpha = match ? parseFloat(match[4]) : 0;
          let newAlpha = Math.max(0, alpha - this.flashSpeed * this.getDeltaTime());
          this.damageImage.color = `rgba(0,0,0,${newAlpha})`;
        }
      }
      this.isDamaged = false;
    }

    public takeDamage(amount: number): void {
      if (this.isInvulnerable) {
        return;
      }

      // Set the damaged flag so the screen will flash.
      this.isDamaged = true;

      // Reduce the current health by the damage amount.
      this.currentHealth -= amount;

      // Set the health bar's value to the current health.
      if (this.healthSlider) {
        this.healthSlider.value = this.currentHealth;
      }

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

      // Set the health bar's value to the current health.
      if (this.healthSlider) {
        this.healthSlider.value = this.currentHealth;
      }
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