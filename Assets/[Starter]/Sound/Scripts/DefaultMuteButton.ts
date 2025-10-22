namespace PROJECT {
    /**
    * Babylon Script Component
    * @class DefaultMuteButton
    */
    export class DefaultMuteButton extends TOOLKIT.ScriptComponent {
        private static audioSystemInitialized: boolean = false;
        public static IsAudioSystemInitialized(): boolean { return DefaultMuteButton.audioSystemInitialized; };

        private buttonIdentifier: string = "mute-button";
        private buttonClassname: string = "mute-button-active";
        private buttonContainer: string = "button-container";
        private buttonElement: HTMLButtonElement = null;
        private muteIconElement: HTMLImageElement = null;
        private mutedIconElement: HTMLImageElement = null;
        private muteButtonState: boolean = true;
        private mutedIconUrl: string = "";
        private muteIconUrl: string = "";
        private toggleEffects: boolean = true;

        private autoPlayList: BABYLON.TransformNode[] = null;
        private audioSources: TOOLKIT.AudioSource[] = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.DefaultMuteButton") {
            super(transform, scene, properties, alias);
        }
        
        protected awake(): void {
        }

        protected start(): void {
            if (this.autoPlayList != null && this.autoPlayList.length > 0) {
                this.autoPlayList.forEach((transform: BABYLON.TransformNode) => {
                    const audio: TOOLKIT.AudioSource = TOOLKIT.SceneManager.FindScriptComponent(transform, "TOOLKIT.AudioSource");
                    if (audio != null) {
                        if (this.audioSources == null) this.audioSources = [];
                        this.audioSources.push(audio);
                    }
                });
            }
            // DEBUG: console.warn("DefaultMuteButton: " + this.transform.name);
            // DEBUG: console.log(this);
        }

        protected ready(): void {
            this.createMuteButton();
        }

        protected createMuteButton(): void {
            const buttonContainer: HTMLDivElement = window.document.createElement("div");
            buttonContainer.className = this.buttonContainer;
            window.document.body.appendChild(buttonContainer);
            // ..
            this.buttonElement = window.document.createElement("button");
            this.buttonElement.id = this.buttonIdentifier;
            this.buttonElement.className = this.buttonClassname;
            buttonContainer.appendChild(this.buttonElement);
            // ..
            this.mutedIconElement = window.document.createElement("img");
            this.mutedIconElement.id = "muted-icon";
            this.mutedIconElement.src = this.mutedIconUrl;
            this.mutedIconElement.className = "";
            this.buttonElement.appendChild(this.mutedIconElement);
            // ..
            this.muteIconElement = window.document.createElement("img");
            this.muteIconElement.id = "mute-icon";
            this.muteIconElement.src = this.muteIconUrl;
            this.muteIconElement.className = "hidden";
            this.buttonElement.appendChild(this.muteIconElement);
            // ..
            this.buttonElement.onclick = () => { this.handleButtonClick(); };
        }

        protected handleButtonClick(): void {
            // Toggle mute state
            this.muteButtonState = !this.muteButtonState;
            // Toggle button active class
            this.buttonElement.classList.toggle("mute-button-active");
            // Show/Hide mute icon
            this.muteIconElement.classList.toggle("hidden");
            this.mutedIconElement.classList.toggle("hidden");
            // ..
            // DEPRECIATED: TOOLKIT.SceneManager.PostWindowMessage({command: 'mute', source: 'babylon', param: this.muteButtonState}, "*");
            // ..
            if (PROJECT.DefaultMuteButton.audioSystemInitialized === false) {
                PROJECT.DefaultMuteButton.audioSystemInitialized = true;
                // ..
                // First Click Start Auto Play List Items
                // ..
                if (this.audioSources != null && this.audioSources.length > 0) {
                    this.audioSources.forEach((source: TOOLKIT.AudioSource) => { if (source != null) source.play(); });
                }
            } else {
                if (PROJECT.SceneSoundSystem != null) {
                    // ..
                    // Toggle Scene Sound System Audio Tracks
                    // ..
                    if (this.muteButtonState === true) {
                        if (PROJECT.SceneSoundSystem.MUSIC != null) PROJECT.SceneSoundSystem.MUSIC.muteAllTracks();
                        if (PROJECT.SceneSoundSystem.SFX != null && this.toggleEffects === true) PROJECT.SceneSoundSystem.SFX.muteAllTracks();
                    }
                    else {
                        if (PROJECT.SceneSoundSystem.MUSIC != null) PROJECT.SceneSoundSystem.MUSIC.unmuteAllTracks();
                        if (PROJECT.SceneSoundSystem.SFX != null && this.toggleEffects === true) PROJECT.SceneSoundSystem.SFX.unmuteAllTracks();
                    }
                }
            }
        }
    }

    TOOLKIT.SceneManager.RegisterClass("PROJECT.DefaultMuteButton", DefaultMuteButton);
}