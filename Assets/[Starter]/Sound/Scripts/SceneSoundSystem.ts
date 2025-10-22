namespace PROJECT {
    /**
    * Babylon Script Component
    * @class SceneSoundSystem
    */
    export class SceneSoundSystem extends TOOLKIT.ScriptComponent {
        private static _MUSIC: PROJECT.SoundManager = null;
        public static get MUSIC(): PROJECT.SoundManager { return SceneSoundSystem._MUSIC; }

        private static _SFX: PROJECT.SoundManager = null;
        public static get SFX(): PROJECT.SoundManager { return SceneSoundSystem._SFX; }

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.SceneSoundSystem") {
            super(transform, scene, properties, alias);
        }

        protected start(): void {
            const musicNode: BABYLON.TransformNode = this.getChildNode("MUSIC");
            if (musicNode != null) PROJECT.SceneSoundSystem._MUSIC = TOOLKIT.SceneManager.FindScriptComponent(musicNode, "PROJECT.SoundManager");

            const soundNode: BABYLON.TransformNode = this.getChildNode("SFX");
            if (soundNode != null) PROJECT.SceneSoundSystem._SFX = TOOLKIT.SceneManager.FindScriptComponent(soundNode, "PROJECT.SoundManager");

            // DEPRECIATED: Default Mute Button Auto Plays Ambient Music Track
            // const defaultMusicTrack:string = this.getProperty("defaultMusicTrack");
            // if (defaultMusicTrack != null && defaultMusicTrack !== "") {
            //    if (PROJECT.SceneSoundSystem.MUSIC != null) PROJECT.SceneSoundSystem.MUSIC.playTrack(defaultMusicTrack);
            // }
        }
    }

    TOOLKIT.SceneManager.RegisterClass("PROJECT.SceneSoundSystem", SceneSoundSystem);
}