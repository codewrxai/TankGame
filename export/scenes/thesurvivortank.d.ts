declare namespace PROJECT {
    class CameraController extends TOOLKIT.ScriptComponent {
        player: BABYLON.TransformNode;
        mDampTime: number;
        maxSpeed: number;
        mMinSize: number;
        mMaxSize: number;
        private mCamera;
        private mZoomSpeed;
        private mMoveVelocity;
        private mDesiredPosition;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected update(): void;
        private move;
        private zoom;
    }
}
declare namespace PROJECT {
    /**
     * Babylon Script Component
     * @class Test
     */
    class Test extends TOOLKIT.ScriptComponent {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected start(): void;
        protected ready(): void;
        protected update(): void;
        protected late(): void;
        protected step(): void;
        protected fixed(): void;
        protected after(): void;
        protected reset(): void;
        protected destroy(): void;
    }
}
declare namespace PROJECT {
    class EnemyBullet extends TOOLKIT.ScriptComponent {
        private enemyShooting;
        private isDestroyed;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        private handleCollision;
    }
}
declare namespace PROJECT {
    class EnemyHealth extends TOOLKIT.ScriptComponent {
        startingHealth: number;
        currentHealth: number;
        scoreValue: number;
        deathClip: BABYLON.Sound;
        private deathAudio;
        private deathParticles;
        private boxCollider;
        private isDead;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        takeDamage(amount: number, hitPoint: BABYLON.Vector3): void;
        private death;
    }
}
declare namespace PROJECT {
    class EnemyMovement extends TOOLKIT.ScriptComponent {
        isPlayerInRange: boolean;
        speed: number;
        rotateSpeed: number;
        private player;
        private playerHealth;
        private enemyHealth;
        private enemyShooting;
        private nav;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        protected update(): void;
    }
}
declare namespace PROJECT {
    class EnemyShooting extends TOOLKIT.ScriptComponent {
        timeBetweenShootings: number;
        damagePerShot: number;
        distanceToAttack: number;
        bullet: BABYLON.TransformNode;
        BulletForce: number;
        bulletSpawnPoint: BABYLON.TransformNode;
        private player;
        private playerHealth;
        private enemyHealth;
        private enemyMovement;
        private timer;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        protected update(): void;
        private attack;
    }
}
declare namespace PROJECT {
    class Heart extends TOOLKIT.ScriptComponent {
        life: number;
        rotateSpeed: number;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        protected update(): void;
    }
}
declare namespace PROJECT {
    class Puddle extends TOOLKIT.ScriptComponent {
        timeToInvertControls: number;
        private player;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        private findTheClosestSpawnPoint;
    }
}
declare namespace PROJECT {
    class Shield extends TOOLKIT.ScriptComponent {
        timeToShield: number;
        timeToNextDest: number;
        private nav;
        private spawnPoints;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        private moveToNextDest;
    }
}
declare namespace PROJECT {
    class Stone extends TOOLKIT.ScriptComponent {
        damage: number;
        height: number;
        timeToFollow: number;
        private player;
        private timer;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        private followPlayerCoroutine;
        protected update(): void;
    }
}
declare namespace PROJECT {
    class StrongerWeapon extends TOOLKIT.ScriptComponent {
        timeToStrongerWeapon: number;
        speed: number;
        height: number;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        update(): void;
    }
}
declare namespace PROJECT {
    class TNT extends TOOLKIT.ScriptComponent {
        damageOfExplosion: number;
        timeOfReductionSpeed: number;
        textures: BABYLON.Texture[];
        explosionParticle: BABYLON.TransformNode;
        minWaitTime: number;
        maxWaitTime: number;
        private player;
        private isPlayerInsideExplosionArea;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        private explosion;
    }
}
declare namespace PROJECT {
    class AutoDestruction extends TOOLKIT.ScriptComponent {
        timeToDie: number;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): Promise<void>;
    }
}
declare namespace PROJECT {
    class RandomStartingPoint extends TOOLKIT.ScriptComponent {
        spawnPointsName: string;
        private spawnPoints;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
    }
}
declare namespace PROJECT {
    class Event {
        eventName: string;
        eventObject: string | null;
        spawnPercentage: number;
        constructor();
    }
}
declare namespace PROJECT {
    class EventManager extends TOOLKIT.ScriptComponent {
        gameEvents: PROJECT.Event[];
        bonusEvents: PROJECT.Event[];
        timeForNextEvent: number;
        protected awake(): void;
        nextRound: number;
        percentageForBonus: number;
        private playerHealth;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        private gameLoopCoroutine;
        private randomEventSelection;
    }
}
declare namespace PROJECT {
    class GameOverManager extends TOOLKIT.ScriptComponent {
        playerHealth: PROJECT.PlayerHealth;
        private anim;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected start(): void;
        private checkGameOver;
    }
}
declare namespace PROJECT {
    class PauseManager extends TOOLKIT.ScriptComponent {
        private canvas;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        protected update(): void;
        pause(): void;
        private lowpass;
        quit(): void;
    }
}
declare namespace PROJECT {
    class ScoreManager extends TOOLKIT.ScriptComponent {
        static score: number;
        private text;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected update(): void;
    }
}
declare namespace PROJECT {
    class PlayerBullet extends TOOLKIT.ScriptComponent {
        private playerShooting;
        private hitParticles;
        private hitAudio;
        private isDestroyed;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        private handleCollision;
    }
}
declare namespace PROJECT {
    class PlayerHealth extends TOOLKIT.ScriptComponent {
        startingHealth: number;
        currentHealth: number;
        healthSlider: BABYLON.GUI.Slider;
        damageImage: BABYLON.GUI.Image;
        deathClip: BABYLON.Sound;
        flashSpeed: number;
        flashColour: BABYLON.Color4;
        private playerMovement;
        private playerShooting;
        private isDamaged;
        private isDead;
        private isInvulnerable;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected update(): void;
        takeDamage(amount: number): void;
        addShield(time: number): void;
        addShieldCourtine(time: number): Promise<void>;
        private blink;
        getLife(amount: number): void;
        private death;
    }
}
declare namespace PROJECT {
    class PlayerMovement extends TOOLKIT.ScriptComponent {
        speed: number;
        rotateSpeed: number;
        private rotateVector;
        private invertedControlFactor;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected update(): void;
        invertControls(time: number): void;
        invertedControlsCourtine(time: number): Promise<void>;
        reduceSpeed(time: number): void;
        reduceSpeedCourtine(time: number): Promise<void>;
    }
}
declare namespace PROJECT {
    class PlayerShooting extends TOOLKIT.ScriptComponent {
        damagePerShot: number;
        timeBetweenBullets: number;
        bullet: BABYLON.TransformNode;
        bulletForce: number;
        private shotAudio;
        private bulletSpawnPoint;
        private timer;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
        protected update(): void;
        private shoot;
        getStrongerWeapon(time: number): Promise<void>;
        private getStrongerWeaponCourtine;
    }
}
declare namespace PROJECT {
    /**
     * Babylon Script Component
     * @class TestController
     */
    class TestController extends TOOLKIT.ScriptComponent {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected start(): void;
        protected ready(): void;
        protected update(): void;
        protected late(): void;
        protected step(): void;
        protected fixed(): void;
        protected after(): void;
        protected reset(): void;
        protected destroy(): void;
    }
}
declare namespace PROJECT {
    /**
     * Babylon toolkit default camera system class
     * @class DefaultCameraSystem - All rights reserved (c) 2020 Mackey Kinard
     * https://doc.babylonjs.com/divingDeeper/postProcesses/defaultRenderingPipeline
     */
    class DefaultCameraSystem extends TOOLKIT.ScriptComponent {
        protected static PlayerOneCamera: BABYLON.FreeCamera;
        protected static PlayerTwoCamera: BABYLON.FreeCamera;
        protected static PlayerThreeCamera: BABYLON.FreeCamera;
        protected static PlayerFourCamera: BABYLON.FreeCamera;
        protected static XRExperienceHelper: BABYLON.WebXRDefaultExperience;
        private static multiPlayerView;
        private static multiPlayerCount;
        private static multiPlayerCameras;
        private static stereoCameras;
        private static startupMode;
        private static cameraReady;
        private static cameraInstance;
        private static renderingPipeline;
        private static screenSpacePipeline;
        static GetRenderingPipeline(): BABYLON.DefaultRenderingPipeline;
        static GetScreenSpacePipeline(): BABYLON.SSAORenderingPipeline;
        static IsCameraSystemReady(): boolean;
        /** Register handler that is triggered when the webxr experience helper has been created */
        static OnXRExperienceHelperObservable: BABYLON.Observable<BABYLON.WebXRDefaultExperience>;
        /** Default Follow Speed */
        static FOLLOW_SPEED: number;
        private mainCamera;
        private cameraType;
        private cameraInertia;
        private cameraController;
        private immersiveOptions;
        private arcRotateConfig;
        private multiPlayerSetup;
        private fullScreenToggle;
        private setPointerLock;
        private setCameraTarget;
        private setSpatialAudio;
        private editorPostProcessing;
        protected m_cameraRig: BABYLON.TargetCamera;
        isMainCamera(): boolean;
        getCameraType(): number;
        getTargetTransform(): BABYLON.TransformNode;
        setTargetTransform(target: BABYLON.TransformNode): void;
        enableSpatialAudio(value: boolean): void;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        protected awakeCameraSystemState(): void;
        protected startCameraSystemState(): Promise<void>;
        protected updateCameraSystemState(): void;
        protected cleanCameraSystemState(): void;
        protected destroyCameraSystemState(): void;
        /*********************************************/
        /** Follow Target Camera Controller Helpers  */
        /*********************************************/
        targetCameraOffset: BABYLON.Vector3;
        getCameraPivotPosition(): BABYLON.Vector3;
        getCameraPivotRotation(): BABYLON.Quaternion;
        getCameraBoomNode(): BABYLON.TransformNode;
        getCameraTransform(): BABYLON.TransformNode;
        private cameraNode;
        private cameraPivot;
        private cameraDistance;
        private cameraPivotOffset;
        private cameraBoomPosition;
        private dollyDirection;
        private rotationEulers;
        private scaledCamDirection;
        private scaledMaxDirection;
        private parentNodePosition;
        private maximumCameraPos;
        private cameraRaycastShape;
        private targetRotationVector;
        private resetCameraRotation;
        private updateCameraController;
        getBoomArmMaxDistance(): number;
        setBoomArmMaxDistance(distance: number): void;
        setSmoothBoomArmLength(length: number, speed: number, updateMaxDistance?: boolean): void;
        private smoothBoomArmLength;
        private smoothBoomArmSpeed;
        private updateSmoothBoomArmLength;
        static EnableTracking(value: boolean): void;
        static IsTrackingEnabled(): boolean;
        static SetAutoUpdate(value: boolean): void;
        static IsAutoUpdateEnabled(): boolean;
        static GetFollowTarget(): BABYLON.TransformNode;
        static SetFollowTarget(target: BABYLON.TransformNode): void;
        static ResetFollowTarget(): void;
        static UpdateFollowTarget(): void;
        /** Get the WebXR default experience helper */
        static GetWebXR(): BABYLON.WebXRDefaultExperience;
        /** Is universal camera system in WebXR mode */
        static IsInWebXR(): boolean;
        /** Setup navigation mesh for WebXR */
        private static SetupNavigationWebXR;
        /** Get main camera rig for the scene */
        static GetMainCamera(scene: BABYLON.Scene, detach?: boolean): BABYLON.FreeCamera;
        /** Get universal camera rig for desired player */
        static GetPlayerCamera(scene: BABYLON.Scene, player?: TOOLKIT.PlayerNumber, detach?: boolean): BABYLON.FreeCamera;
        /** Get camera transform node for desired player */
        static GetCameraTransform(scene: BABYLON.Scene, player?: TOOLKIT.PlayerNumber): BABYLON.TransformNode;
        /** Are stereo side side camera services available. */
        static IsStereoCameras(): boolean;
        /** Are local multi player view services available. */
        static IsMultiPlayerView(): boolean;
        /** Get the current local multi player count */
        static GetMultiPlayerCount(): number;
        /** Activates current local multi player cameras. */
        static ActivateMultiPlayerCameras(scene: BABYLON.Scene): boolean;
        /** Disposes current local multiplayer cameras */
        static DisposeMultiPlayerCameras(): void;
        /** Sets the multi player camera view layout */
        static SetMultiPlayerViewLayout(scene: BABYLON.Scene, totalNumPlayers: number): boolean;
    }
    /*********************************************/
    /** Camera Editor Properties Support Classes */
    /*********************************************/
    interface IEditorArcRtotate {
        alpha: number;
        beta: number;
        radius: number;
        target: TOOLKIT.IUnityVector3;
    }
    interface IEditorPostProcessing {
        usePostProcessing: boolean;
        highDynamicRange: boolean;
        screenAntiAliasing: PROJECT.IEditorAntiAliasing;
        focalDepthOfField: PROJECT.IEditorDepthOfField;
        chromaticAberration: PROJECT.IEditorChromaticAberration;
        glowLayerProperties: PROJECT.IEditorGlowLayer;
        grainEffectProperties: PROJECT.IEditorGrainEffect;
        sharpEffectProperties: PROJECT.IEditorSharpenEffect;
        bloomEffectProperties: PROJECT.IEditorBloomProcessing;
        imageProcessingConfig: PROJECT.IEditorImageProcessing;
        screenSpaceRendering: PROJECT.IEditorScreenSpace;
    }
    interface IEditorScreenSpace {
        SSAO: boolean;
        SSAORatio: number;
        combineRatio: number;
        totalStrength: number;
        radius: number;
        area: number;
        fallOff: number;
        baseValue: number;
    }
    interface IEditorAntiAliasing {
        msaaSamples: number;
        fxaaEnabled: boolean;
        fxaaScaling: boolean;
        fxaaSamples: number;
    }
    interface IEditorDepthOfField {
        depthOfField: boolean;
        blurLevel: number;
        focalStop: number;
        focalLength: number;
        focusDistance: number;
        maxLensSize: number;
    }
    interface IEditorChromaticAberration {
        aberrationEnabled: boolean;
        aberrationAmount: number;
        adaptScaleViewport: boolean;
        alphaMode: number;
        alwaysForcePOT: boolean;
        pixelPerfectMode: boolean;
        fullscreenViewport: boolean;
    }
    interface IEditorGlowLayer {
        glowEnabled: boolean;
        glowIntensity: number;
        blurKernelSize: number;
    }
    interface IEditorGrainEffect {
        grainEnabled: boolean;
        grainAnimated: boolean;
        grainIntensity: number;
        adaptScaleViewport: boolean;
    }
    interface IEditorSharpenEffect {
        sharpenEnabled: boolean;
        sharpEdgeAmount: number;
        sharpColorAmount: number;
        adaptScaleViewport: boolean;
    }
    interface IEditorBloomProcessing {
        bloomEnabled: boolean;
        bloomKernel: number;
        bloomScale: number;
        bloomWeight: number;
        bloomThreshold: number;
    }
    interface IEditorColorCurves {
        curvesEnabled: boolean;
        globalDen: number;
        globalExp: number;
        globalHue: number;
        globalSat: number;
        highlightsDen: number;
        highlightsExp: number;
        highlightsHue: number;
        highlightsSat: number;
        midtonesDen: number;
        midtonesExp: number;
        midtonesHue: number;
        midtonesSat: number;
        shadowsDen: number;
        shadowsExp: number;
        shadowsHue: number;
        shadowsSat: number;
    }
    interface IEditorImageProcessing {
        imageProcessing: boolean;
        imageContrast: number;
        imageExposure: number;
        toneMapping: boolean;
        toneMapType: number;
        vignetteEnabled: boolean;
        vignetteBlendMode: number;
        vignetteCameraFov: number;
        vignetteStretch: number;
        vignetteCentreX: number;
        vignetteCentreY: number;
        vignetteWeight: number;
        vignetteColor: TOOLKIT.IUnityColor;
        useColorGrading: boolean;
        setGradingTexture: any;
        imagingColorCurves: PROJECT.IEditorColorCurves;
    }
}
declare namespace PROJECT {
    /**
     * Babylon Script Component
     * @class DebugInformation
     */
    class DebugInformation extends TOOLKIT.ScriptComponent {
        private keys;
        private show;
        private popup;
        private views;
        private xbox;
        private color;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected start(): void;
        protected destroy(): void;
        protected openFullscreen(elem: any): void;
        protected closeFullscreen(): void;
        /**
         * Ask the browser to promote the current element to fullscreen rendering mode
         * @param element defines the DOM element to promote
         */
        static _RequestFullscreen(element: HTMLElement): void;
        /**
         * Asks the browser to exit fullscreen mode
         */
        static _ExitFullscreen(): void;
    }
}
declare namespace PROJECT {
    /**
    * Babylon Script Component
    * @class AssetExporter
    */
    class AssetExporter extends TOOLKIT.ScriptComponent {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected start(): void;
        protected fixed(): void;
        protected update(): void;
        protected late(): void;
        protected after(): void;
        protected ready(): void;
        protected destroy(): void;
    }
}
declare namespace PROJECT {
    /**
    * Babylon Script Component
    * @class AssetPreloader
    */
    class AssetPreloader extends TOOLKIT.ScriptComponent implements TOOLKIT.IAssetPreloader {
        private parentMeshes;
        private importMeshes;
        private assetContainers;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected destroy(): void;
        /** Add asset preloader tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        addPreloaderTasks(assetsManager: TOOLKIT.PreloadAssetsManager): void;
    }
}
declare namespace PROJECT {
    /**
    * Babylon Script Component
    * @class DefaultMuteButton
    */
    class DefaultMuteButton extends TOOLKIT.ScriptComponent {
        private static audioSystemInitialized;
        static IsAudioSystemInitialized(): boolean;
        private buttonIdentifier;
        private buttonClassname;
        private buttonContainer;
        private buttonElement;
        private muteIconElement;
        private mutedIconElement;
        private muteButtonState;
        private mutedIconUrl;
        private muteIconUrl;
        private toggleEffects;
        private autoPlayList;
        private audioSources;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected start(): void;
        protected ready(): void;
        protected createMuteButton(): void;
        protected handleButtonClick(): void;
    }
}
declare namespace PROJECT {
    /**
    * Babylon Script Component
    * @class SceneSoundSystem
    */
    class SceneSoundSystem extends TOOLKIT.ScriptComponent {
        private static _MUSIC;
        static get MUSIC(): PROJECT.SoundManager;
        private static _SFX;
        static get SFX(): PROJECT.SoundManager;
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected start(): void;
    }
}
declare namespace PROJECT {
    /**
    * Babylon Script Component
    * @class SoundManager
    */
    class SoundManager extends TOOLKIT.ScriptComponent {
        private groupName;
        private cachedVolume;
        private volumeProperty;
        getGroupName(): string;
        protected m_soundMap: Map<string, TOOLKIT.AudioSource>;
        protected m_soundList: TOOLKIT.AudioSource[];
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties?: any, alias?: string);
        protected awake(): void;
        protected start(): void;
        protected update(): void;
        protected destroy(): void;
        /**
         * Is the sound track currently playing
         * @param name The name of the sound track to check is playing
         */
        isPlaying(name: string): boolean;
        /**
         * Is the sound track currently paused
         * @param name The name of the sound track to check is paused
         */
        isPaused(name: string): boolean;
        /**
         * Play the sound track by name
         * @param name The name of the sound track to play
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         * @param offset (optional) Start the sound at a specific time in seconds
         * @param length (optional) Sound duration (in seconds)
         */
        playTrack(name: string, time?: number, offset?: number, length?: number): Promise<boolean>;
        /**
         * Pause the sound track by name
         * @param name The name of the sound track to play
         */
        pauseTrack(name: string): boolean;
        /**
         * Pause the sound for all tracks in the group
         */
        pauseAllTracks(): void;
        /**
         * Stop the sound track by name
         * @param name The name of the sound track to play
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        stopTrack(name: string, time?: number): boolean;
        /**
         * Stop the sound for all tracks in the group
         * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
         */
        stopAllTracks(time?: number): void;
        /**
         * Mute the sound track by name
         * @param name The name of the sound track to play
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        muteTrack(name: string, time?: number): boolean;
        /**
         * Unmute the sound track by name
         * @param name The name of the sound track to play
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        unmuteTrack(name: string, time?: number): boolean;
        /**
         * Mutes the volume for all sound tracks in the group
         * @param time Define time for gradual change to new volume
         */
        muteAllTracks(time?: number): void;
        /**
         * Unmutes the volume for all sound tracks in the group
         * @param time Define time for gradual change to new volume
         */
        unmuteAllTracks(time?: number): void;
        /**
         * Sets the volume for all sound tracks in the group
         * @param volume Define the new volume of the sound
         * @param time Define time for gradual change to new volume
         */
        setGroupVolume(volume: number, time?: number): void;
        /**
         * Get a sound source by name
         * @param name The name of the sound track to play
         */
        getAudioSource(name: string): TOOLKIT.AudioSource;
    }
}
