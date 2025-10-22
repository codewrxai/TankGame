namespace PROJECT {
    /**
     * Babylon toolkit default camera system class
     * @class DefaultCameraSystem - All rights reserved (c) 2020 Mackey Kinard
     * https://doc.babylonjs.com/divingDeeper/postProcesses/defaultRenderingPipeline
     */
    export class DefaultCameraSystem extends TOOLKIT.ScriptComponent {
        protected static PlayerOneCamera: BABYLON.FreeCamera = null;
        protected static PlayerTwoCamera: BABYLON.FreeCamera = null;
        protected static PlayerThreeCamera: BABYLON.FreeCamera = null;
        protected static PlayerFourCamera: BABYLON.FreeCamera = null;
        protected static XRExperienceHelper: BABYLON.WebXRDefaultExperience = null;

        private static multiPlayerView: boolean = false;
        private static multiPlayerCount: number = 1;
        private static multiPlayerCameras: BABYLON.Camera[] = null;
        private static stereoCameras: boolean = true;
        private static startupMode: number = 1;
        private static cameraReady: boolean = false;
        private static cameraInstance: PROJECT.DefaultCameraSystem = null;
        private static renderingPipeline: BABYLON.DefaultRenderingPipeline = null;
        private static screenSpacePipeline: BABYLON.SSAORenderingPipeline = null;
        public static GetRenderingPipeline(): BABYLON.DefaultRenderingPipeline { return PROJECT.DefaultCameraSystem.renderingPipeline; };
        public static GetScreenSpacePipeline(): BABYLON.SSAORenderingPipeline { return PROJECT.DefaultCameraSystem.screenSpacePipeline; };
        public static IsCameraSystemReady(): boolean { return PROJECT.DefaultCameraSystem.cameraReady; }
        /** Register handler that is triggered when the webxr experience helper has been created */
        public static OnXRExperienceHelperObservable = new BABYLON.Observable<BABYLON.WebXRDefaultExperience>();
        /** Default Follow Speed */
        public static FOLLOW_SPEED: number = 1.0; // Default Follow Speed

        private mainCamera: boolean = false;
        private cameraType: number = 0;
        private cameraInertia: number = 0.9;
        private cameraController: any = null;
        private immersiveOptions: any = null;
        private arcRotateConfig: any = null;
        private multiPlayerSetup: any = null;
        private fullScreenToggle: number = 0;
        private setPointerLock: boolean = false;
        private setCameraTarget: BABYLON.TransformNode = null;
        private setSpatialAudio: boolean = true;
        private editorPostProcessing: PROJECT.IEditorPostProcessing = null;

        protected m_cameraRig: BABYLON.TargetCamera = null;

        public isMainCamera(): boolean { return this.mainCamera; }
        public getCameraType(): number { return this.cameraType; }
        public getTargetTransform(): BABYLON.TransformNode { return this.setCameraTarget; }
        public setTargetTransform(target: BABYLON.TransformNode): void { this.setCameraTarget = target; } 
        public enableSpatialAudio(value:boolean): void { this.setSpatialAudio = value; }

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.DefaultCameraSystem") {
            super(transform, scene, properties, alias);
            PROJECT.DefaultCameraSystem.cameraInstance = this;
        }

        protected awake(): void { this.awakeCameraSystemState(); }
        protected start(): void { this.startCameraSystemState(); }
        protected update(): void { this.updateCameraSystemState(); }
        protected destroy(): void { this.destroyCameraSystemState(); }

        /////////////////////////////////////////////
        // Universal Camera System State Functions //
        /////////////////////////////////////////////

        protected awakeCameraSystemState(): void {
            this.mainCamera = (this.getTransformTag() === "MainCamera");
            this.cameraType = this.getProperty("mainCameraType", this.cameraType);
            this.cameraInertia = this.getProperty("setCameraInertia", this.cameraInertia);
            this.fullScreenToggle = this.getProperty("fullScreenToggle", this.fullScreenToggle);
            this.setSpatialAudio = this.getProperty("setSpatialAudio", this.setSpatialAudio);
            this.setPointerLock = this.getProperty("setPointerLock", this.setPointerLock);
            this.immersiveOptions = this.getProperty("immersiveOptions", this.immersiveOptions);
            this.arcRotateConfig = this.getProperty("arcRotateConfig", this.arcRotateConfig);
            this.multiPlayerSetup = this.getProperty("multiPlayerSetup", this.multiPlayerSetup);
            this.cameraController = this.getProperty("cameraController", this.cameraController);
            this.editorPostProcessing = this.getProperty("renderingPipeline", this.editorPostProcessing);
            this.cleanCameraSystemState();
            if (this.fullScreenToggle === 0) {
                TOOLKIT.InputController.OnKeyboardPress(TOOLKIT.UserInputKey.F, () => {
                    //this.scene.getEngine().enterFullscreen(true);
                    TOOLKIT.SceneManager.EnterFullscreenMode(this.scene, this.setPointerLock);
                });
            }
        }

        protected async startCameraSystemState(): Promise<void> {
            TOOLKIT.Utilities.ValidateTransformQuaternion(this.transform);
            if (this.multiPlayerSetup != null) {
                PROJECT.DefaultCameraSystem.startupMode = this.multiPlayerSetup.playerStartupMode;
                PROJECT.DefaultCameraSystem.stereoCameras = this.multiPlayerSetup.stereoSideBySide;
            }
            // ..
            // Default Spatial Audio Support
            // ..
            if (this.setSpatialAudio === true && !TOOLKIT.AudioSource.IsLegacyEngine()) {
                TOOLKIT.AudioSource.AttachSpatialCamera(this.transform);
                // console.warn("### Attached Main Camera To Spatial Audio: " + this.transform.name);
            }
            // ..
            // Default Camera System Support
            // ..
            this.m_cameraRig = this.getCameraRig();
            if (this.m_cameraRig != null) {
                this.m_cameraRig.inertia = this.cameraInertia;
                if (this.cameraController != null) {
                    this.m_cameraRig.speed = this.cameraController.cameraSpeed;
                    this.m_cameraRig.inverseRotationSpeed = this.cameraController.invRotationSpeed;
                    if (this.m_cameraRig instanceof BABYLON.UniversalCamera) {
                        this.m_cameraRig.gamepadAngularSensibility = this.cameraController.gamepadRotation;
                        this.m_cameraRig.gamepadMoveSensibility = this.cameraController.gamepadMovement;
                        this.m_cameraRig.touchAngularSensibility = this.cameraController.touchRotation;
                        this.m_cameraRig.touchMoveSensibility = this.cameraController.touchMovement;
                    }
                    if (this.cameraController.keyboardWASD === true) {
                        if (this.m_cameraRig.inputs != null && this.m_cameraRig.inputs.attached != null && this.m_cameraRig.inputs.attached.keyboard != null) {
                            if (this.m_cameraRig.inputs.attached.keyboard instanceof BABYLON.FreeCameraKeyboardMoveInput) {
                                const cinput: BABYLON.FreeCameraKeyboardMoveInput = this.m_cameraRig.inputs.attached.keyboard;
                                cinput.keysUp.push(TOOLKIT.UserInputKey.W);
                                cinput.keysLeft.push(TOOLKIT.UserInputKey.A);
                                cinput.keysDown.push(TOOLKIT.UserInputKey.S);
                                cinput.keysRight.push(TOOLKIT.UserInputKey.D);
                                cinput.rotationSpeed = this.cameraController.rotationSpeed;
                                if (this.cameraController.arrowKeyRotation === true) {
                                    cinput.keysLeft = [TOOLKIT.UserInputKey.A];
                                    cinput.keysRight = [TOOLKIT.UserInputKey.D];
                                    cinput.keysRotateLeft = [TOOLKIT.UserInputKey.LeftArrow];
                                    cinput.keysRotateRight = [TOOLKIT.UserInputKey.RightArrow];
                                }
                            }
                        }
                    }
                }
                if (this.m_cameraRig.inputs != null && this.m_cameraRig.inputs.attached != null && this.m_cameraRig.inputs.attached.mouse != null) {
                    const mouseInput: any = this.m_cameraRig.inputs.attached.mouse;
                    // ..
                    // NOTE: Touch Enabled Mouse Hack
                    // ..
                    if (TOOLKIT.Utilities.HasOwnProperty(mouseInput, "touchEnabled")) {
                        mouseInput.touchEnabled = true;
                    }
                }
                if (this.cameraType === 0 || this.cameraType === 4) { // Universal And Free Target Camera
                    //if (PROJECT.DefaultCameraSystem.PlayerOneCamera == null) {
                    PROJECT.DefaultCameraSystem.PlayerOneCamera = (this.m_cameraRig as BABYLON.FreeCamera);
                    PROJECT.DefaultCameraSystem.PlayerOneCamera.inertia = this.cameraInertia;
                    (<any>PROJECT.DefaultCameraSystem.PlayerOneCamera).transform = this.transform;
                    //}             
                } else if (this.cameraType === 1 || this.cameraType === 2) { // WebXR Camera Types
                    //if (PROJECT.DefaultCameraSystem.PlayerOneCamera == null) {
                    PROJECT.DefaultCameraSystem.PlayerOneCamera = (this.m_cameraRig as BABYLON.FreeCamera);
                    PROJECT.DefaultCameraSystem.PlayerOneCamera.inertia = this.cameraInertia;
                    (<any>PROJECT.DefaultCameraSystem.PlayerOneCamera).transform = this.transform;
                    //}             
                    if (this.immersiveOptions != null) {
                        const localStorageRequired: boolean = (this.immersiveOptions.localStorageOption === true);
                        if (localStorageRequired === false || (localStorageRequired === true && TOOLKIT.WindowManager.GetVirtualRealityEnabled())) {
                            let webvrFloorMeshes: BABYLON.AbstractMesh[] = null;
                            let webvrHelperOptions: BABYLON.WebXRDefaultExperienceOptions = null;
                            let webvrImmersiveMode: XRSessionMode = (this.cameraType === 1) ? "immersive-ar" : "immersive-vr";
                            let webvrReferenceType: XRReferenceSpaceType = "local-floor";
                            switch (this.immersiveOptions.referenceSpaceType) {
                                case 0:
                                    webvrReferenceType = "viewer";
                                    break;
                                case 1:
                                    webvrReferenceType = "local";
                                    break;
                                case 2:
                                    webvrReferenceType = "local-floor";
                                    break;
                                case 4:
                                    webvrReferenceType = "unbounded";
                                    break;
                                default:
                                    webvrReferenceType = "local-floor";
                                    break;
                            }
                            if (this.immersiveOptions.setFloorMeshesTags == null || this.immersiveOptions.setFloorMeshesTags === "") this.immersiveOptions.setFloorMeshesTags = "Navigation";
                            if (this.immersiveOptions.defaultTeleportationSetup.useTeleportation === true) webvrFloorMeshes = this.scene.getMeshesByTags(this.immersiveOptions.setFloorMeshesTags);
                            if (this.immersiveOptions.defaultTeleportationSetup.useTeleportation === true && webvrFloorMeshes != null && webvrFloorMeshes.length > 0) {
                                webvrHelperOptions = {
                                    floorMeshes: webvrFloorMeshes,
                                    optionalFeatures: this.immersiveOptions.optionalFeatures,
                                    useStablePlugins: this.immersiveOptions.useStablePlugins,
                                    renderingGroupId: this.immersiveOptions.renderingGroupNum,
                                    disableDefaultUI: this.immersiveOptions.disableUserInterface,
                                    disableTeleportation: (this.immersiveOptions.defaultTeleportationSetup.useTeleportation === false),
                                    disablePointerSelection: this.immersiveOptions.disablePointerSelect,
                                    ignoreNativeCameraTransformation: this.immersiveOptions.ignoreNativeCamera,
                                    inputOptions: {
                                        doNotLoadControllerMeshes: this.immersiveOptions.experienceInputOptions.disableMeshLoad,
                                        forceInputProfile: this.immersiveOptions.experienceInputOptions.forceInputProfile,
                                        disableOnlineControllerRepository: this.immersiveOptions.experienceInputOptions.disableRepository,
                                        customControllersRepositoryURL: this.immersiveOptions.experienceInputOptions.customRepository,
                                        disableControllerAnimation: this.immersiveOptions.experienceInputOptions.disableModelAnim,
                                        controllerOptions: {
                                            disableMotionControllerAnimation: this.immersiveOptions.experienceInputOptions.controllerOptions.disableCtrlAnim,
                                            doNotLoadControllerMesh: this.immersiveOptions.experienceInputOptions.controllerOptions.disableCtrlMesh,
                                            forceControllerProfile: this.immersiveOptions.experienceInputOptions.controllerOptions.forceCtrlProfile,
                                            renderingGroupId: this.immersiveOptions.experienceInputOptions.controllerOptions.renderingGroup
                                        }
                                    },
                                    uiOptions: {
                                        sessionMode: webvrImmersiveMode,
                                        referenceSpaceType: webvrReferenceType
                                    }
                                }
                            } else {
                                webvrHelperOptions = {
                                    optionalFeatures: this.immersiveOptions.optionalFeatures,
                                    useStablePlugins: this.immersiveOptions.useStablePlugins,
                                    renderingGroupId: this.immersiveOptions.renderingGroupNum,
                                    disableDefaultUI: this.immersiveOptions.disableUserInterface,
                                    disableTeleportation: (this.immersiveOptions.defaultTeleportationSetup.useTeleportation === false),
                                    disablePointerSelection: this.immersiveOptions.disablePointerSelect,
                                    ignoreNativeCameraTransformation: this.immersiveOptions.ignoreNativeCamera,
                                    inputOptions: {
                                        doNotLoadControllerMeshes: this.immersiveOptions.experienceInputOptions.disableMeshLoad,
                                        forceInputProfile: this.immersiveOptions.experienceInputOptions.forceInputProfile,
                                        disableOnlineControllerRepository: this.immersiveOptions.experienceInputOptions.disableRepository,
                                        customControllersRepositoryURL: this.immersiveOptions.experienceInputOptions.customRepository,
                                        disableControllerAnimation: this.immersiveOptions.experienceInputOptions.disableModelAnim,
                                        controllerOptions: {
                                            disableMotionControllerAnimation: this.immersiveOptions.experienceInputOptions.controllerOptions.disableCtrlAnim,
                                            doNotLoadControllerMesh: this.immersiveOptions.experienceInputOptions.controllerOptions.disableCtrlMesh,
                                            forceControllerProfile: this.immersiveOptions.experienceInputOptions.controllerOptions.forceCtrlProfile,
                                            renderingGroupId: this.immersiveOptions.renderingGroupNum
                                        }
                                    },
                                    uiOptions: {
                                        sessionMode: webvrImmersiveMode,
                                        referenceSpaceType: webvrReferenceType
                                    }
                                }
                            }
                            PROJECT.DefaultCameraSystem.XRExperienceHelper = await this.scene.createDefaultXRExperienceAsync(webvrHelperOptions);
                            if (PROJECT.DefaultCameraSystem.XRExperienceHelper != null && PROJECT.DefaultCameraSystem.XRExperienceHelper.baseExperience != null) {
                                if (PROJECT.DefaultCameraSystem.XRExperienceHelper.teleportation != null) {
                                    PROJECT.DefaultCameraSystem.XRExperienceHelper.teleportation.rotationAngle = BABYLON.Tools.ToRadians(this.immersiveOptions.defaultTeleportationSetup.turningAxisAngle);
                                    PROJECT.DefaultCameraSystem.XRExperienceHelper.teleportation.rotationEnabled = this.immersiveOptions.defaultTeleportationSetup.rotationsEnabled;
                                    PROJECT.DefaultCameraSystem.XRExperienceHelper.teleportation.backwardsMovementEnabled = this.immersiveOptions.defaultTeleportationSetup.backwardsEnabled;
                                    PROJECT.DefaultCameraSystem.XRExperienceHelper.teleportation.backwardsTeleportationDistance = this.immersiveOptions.defaultTeleportationSetup.backwardsDistance;
                                    PROJECT.DefaultCameraSystem.XRExperienceHelper.teleportation.parabolicCheckRadius = this.immersiveOptions.defaultTeleportationSetup.parabolicRadius;
                                }
                                if (PROJECT.DefaultCameraSystem.OnXRExperienceHelperObservable && PROJECT.DefaultCameraSystem.OnXRExperienceHelperObservable.hasObservers()) {
                                    PROJECT.DefaultCameraSystem.OnXRExperienceHelperObservable.notifyObservers(PROJECT.DefaultCameraSystem.XRExperienceHelper);
                                }
                                if (TOOLKIT.SceneManager.HasNavigationData()) {
                                    const navmesh: BABYLON.Mesh = TOOLKIT.SceneManager.GetNavigationMesh();
                                    PROJECT.DefaultCameraSystem.SetupNavigationWebXR(navmesh, this.immersiveOptions.setFloorMeshesTags);
                                } else {
                                    TOOLKIT.SceneManager.OnNavMeshReadyObservable.addOnce((navmesh: BABYLON.Mesh) => {
                                        PROJECT.DefaultCameraSystem.SetupNavigationWebXR(navmesh, this.immersiveOptions.setFloorMeshesTags);
                                    });
                                }
                            } else {
                                TOOLKIT.SceneManager.LogWarning("WebXR not supported in current browser.");
                            }
                        }
                    }
                } else if (this.cameraType === 3) { // Multi Player Camera
                    const cameraName = this.m_cameraRig.name;
                    //if (PROJECT.DefaultCameraSystem.PlayerOneCamera == null) {
                    const playerOneTransform: BABYLON.TransformNode = new BABYLON.TransformNode("Player Camera 1", this.scene);
                    playerOneTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    playerOneTransform.position = this.transform.position.clone();
                    playerOneTransform.parent = this.transform.parent;
                    // ..
                    const playerOneName: string = cameraName + ".1";
                    const playerOneCamerax: BABYLON.FreeCamera = this.m_cameraRig.clone(playerOneName) as BABYLON.FreeCamera;
                    playerOneCamerax.name = playerOneName;
                    playerOneCamerax.parent = playerOneTransform;
                    playerOneCamerax.position = new BABYLON.Vector3(0, 0, 0);
                    playerOneCamerax.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                    playerOneCamerax.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                    playerOneCamerax.setEnabled(false);
                    PROJECT.DefaultCameraSystem.PlayerOneCamera = playerOneCamerax;
                    PROJECT.DefaultCameraSystem.PlayerOneCamera.inertia = this.cameraInertia;
                    (<any>PROJECT.DefaultCameraSystem.PlayerOneCamera).transform = playerOneTransform;
                    (<any>playerOneTransform).cameraRig = PROJECT.DefaultCameraSystem.PlayerOneCamera;
                    //}             
                    //if (PROJECT.DefaultCameraSystem.PlayerTwoCamera == null) {
                    const playerTwoTransform: BABYLON.TransformNode = new BABYLON.TransformNode("Player Camera 2", this.scene);
                    playerTwoTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    playerTwoTransform.position = this.transform.position.clone();
                    playerTwoTransform.parent = this.transform.parent;
                    // ..
                    const playerTwoName: string = cameraName + ".2";
                    const playerTwoCamerax: BABYLON.FreeCamera = this.m_cameraRig.clone(playerTwoName) as BABYLON.FreeCamera;
                    playerTwoCamerax.name = playerTwoName;
                    playerTwoCamerax.parent = playerTwoTransform;
                    playerTwoCamerax.position = new BABYLON.Vector3(0, 0, 0);
                    playerTwoCamerax.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                    playerTwoCamerax.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                    playerTwoCamerax.setEnabled(false);
                    PROJECT.DefaultCameraSystem.PlayerTwoCamera = playerTwoCamerax;
                    PROJECT.DefaultCameraSystem.PlayerTwoCamera.inertia = this.cameraInertia;
                    (<any>PROJECT.DefaultCameraSystem.PlayerTwoCamera).transform = playerTwoTransform;
                    (<any>playerTwoTransform).cameraRig = PROJECT.DefaultCameraSystem.PlayerTwoCamera;
                    //}
                    //if (PROJECT.DefaultCameraSystem.PlayerThreeCamera == null) {
                    const playerThreeTransform: BABYLON.TransformNode = new BABYLON.TransformNode("Player Camera 3", this.scene);
                    playerThreeTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    playerThreeTransform.position = this.transform.position.clone();
                    playerThreeTransform.parent = this.transform.parent;
                    // ..
                    const playerThreeName: string = cameraName + ".3";
                    const playerThreeCamerax: BABYLON.FreeCamera = this.m_cameraRig.clone(playerThreeName) as BABYLON.FreeCamera;
                    playerThreeCamerax.name = playerThreeName;
                    playerThreeCamerax.parent = playerThreeTransform;
                    playerThreeCamerax.position = new BABYLON.Vector3(0, 0, 0);
                    playerThreeCamerax.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                    playerThreeCamerax.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                    playerThreeCamerax.setEnabled(false);
                    PROJECT.DefaultCameraSystem.PlayerThreeCamera = playerThreeCamerax;
                    PROJECT.DefaultCameraSystem.PlayerThreeCamera.inertia = this.cameraInertia;
                    (<any>PROJECT.DefaultCameraSystem.PlayerThreeCamera).transform = playerThreeTransform;
                    (<any>playerThreeTransform).cameraRig = PROJECT.DefaultCameraSystem.PlayerThreeCamera;
                    //}
                    //if (PROJECT.DefaultCameraSystem.PlayerFourCamera == null) {
                    const playerFourTransform: BABYLON.TransformNode = new BABYLON.TransformNode("Player Camera 4", this.scene);
                    playerFourTransform.rotationQuaternion = this.transform.rotationQuaternion.clone();
                    playerFourTransform.position = this.transform.position.clone();
                    playerFourTransform.parent = this.transform.parent;
                    // ..
                    const playerFourName: string = cameraName + ".4";
                    const playerFourCamerax: BABYLON.FreeCamera = this.m_cameraRig.clone(playerFourName) as BABYLON.FreeCamera;
                    playerFourCamerax.name = playerFourName;
                    playerFourCamerax.parent = playerFourTransform;
                    playerFourCamerax.position = new BABYLON.Vector3(0, 0, 0);
                    playerFourCamerax.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                    playerFourCamerax.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                    playerFourCamerax.setEnabled(false);
                    PROJECT.DefaultCameraSystem.PlayerFourCamera = playerFourCamerax;
                    PROJECT.DefaultCameraSystem.PlayerFourCamera.inertia = this.cameraInertia;
                    (<any>PROJECT.DefaultCameraSystem.PlayerFourCamera).transform = playerFourTransform;
                    (<any>playerFourTransform).cameraRig = PROJECT.DefaultCameraSystem.PlayerFourCamera;
                    //}
                    PROJECT.DefaultCameraSystem.multiPlayerView = true;
                    PROJECT.DefaultCameraSystem.SetMultiPlayerViewLayout(this.scene, PROJECT.DefaultCameraSystem.startupMode);
                }
                // ..
                // Validate Camera Attach Control
                // ..
                if (this.cameraController.cameraControl === 1 || this.cameraController.cameraControl === 2) { // Attach Control & Detach Parent
                    this.m_cameraRig.parent = null; // Detach Camera Parent
                    this.m_cameraRig.position.copyFrom(this.transform.position);
                    this.m_cameraRig.rotationQuaternion = (this.transform.rotationQuaternion != null) ? this.transform.rotationQuaternion.clone() : BABYLON.Quaternion.FromEulerAngles(this.transform.rotation.x, this.transform.rotation.y, this.transform.rotation.z);
                    const children: BABYLON.Node[] = this.transform.getChildren(null, true);
                    if (children != null) {
                        children.forEach((child: BABYLON.Node) => { child.parent = this.m_cameraRig; });
                    }
                    if (this.m_cameraRig instanceof BABYLON.FreeCamera) { // Note: Check Base Class For Universal Camera
                        this.m_cameraRig.checkCollisions = this.cameraController.checkCollisions;
                        this.m_cameraRig.applyGravity = this.cameraController.setApplyGravity;
                    }
                    if (this.cameraController.cameraControl === 1) {                    
                        this.m_cameraRig.attachControl(this.cameraController.preventDefault);
                    }
                }
            }
            const quality: TOOLKIT.RenderQuality = TOOLKIT.RenderQuality.High; // FIXME: TOOLKIT.SceneManager.GetRenderQuality();
            const allowProcessing: boolean = (quality === TOOLKIT.RenderQuality.High);
            //if (PROJECT.DefaultCameraSystem.renderingPipeline == null) {
            if (allowProcessing === true && this.editorPostProcessing != null && this.editorPostProcessing.usePostProcessing === true) {
                PROJECT.DefaultCameraSystem.renderingPipeline = new BABYLON.DefaultRenderingPipeline("DefaultCameraSystem", this.editorPostProcessing.highDynamicRange, this.scene, this.scene.cameras, true);
                if (PROJECT.DefaultCameraSystem.renderingPipeline.isSupported === true) {
                    const defaultPipeline: BABYLON.DefaultRenderingPipeline = PROJECT.DefaultCameraSystem.renderingPipeline;
                    defaultPipeline.samples = this.editorPostProcessing.screenAntiAliasing.msaaSamples; // 1 by default (MSAA)
                    /* Image Processing */
                    defaultPipeline.imageProcessingEnabled = this.editorPostProcessing.imageProcessingConfig.imageProcessing; //true by default
                    if (defaultPipeline.imageProcessingEnabled) {
                        defaultPipeline.imageProcessing.contrast = this.editorPostProcessing.imageProcessingConfig.imageContrast; // 1 by default
                        defaultPipeline.imageProcessing.exposure = this.editorPostProcessing.imageProcessingConfig.imageExposure; // 1 by default
                        defaultPipeline.imageProcessing.toneMappingEnabled = this.editorPostProcessing.imageProcessingConfig.toneMapping; // false by default
                        defaultPipeline.imageProcessing.toneMappingType = this.editorPostProcessing.imageProcessingConfig.toneMapType; // standard by default
                        defaultPipeline.imageProcessing.vignetteEnabled = this.editorPostProcessing.imageProcessingConfig.vignetteEnabled;
                        if (defaultPipeline.imageProcessing.vignetteEnabled) {
                            defaultPipeline.imageProcessing.vignetteBlendMode = this.editorPostProcessing.imageProcessingConfig.vignetteBlendMode;
                            defaultPipeline.imageProcessing.vignetteCameraFov = this.editorPostProcessing.imageProcessingConfig.vignetteCameraFov;
                            defaultPipeline.imageProcessing.vignetteCentreX = this.editorPostProcessing.imageProcessingConfig.vignetteCentreX;
                            defaultPipeline.imageProcessing.vignetteCentreY = this.editorPostProcessing.imageProcessingConfig.vignetteCentreY;
                            defaultPipeline.imageProcessing.vignetteStretch = this.editorPostProcessing.imageProcessingConfig.vignetteStretch;
                            defaultPipeline.imageProcessing.vignetteWeight = this.editorPostProcessing.imageProcessingConfig.vignetteWeight;
                            if (this.editorPostProcessing.imageProcessingConfig.vignetteColor != null) {
                                const vcolor: BABYLON.Color4 = TOOLKIT.Utilities.ParseColor4(this.editorPostProcessing.imageProcessingConfig.vignetteColor);
                                if (vcolor != null) defaultPipeline.imageProcessing.vignetteColor = vcolor;
                            }
                        }
                        /* Color Grading */
                        defaultPipeline.imageProcessing.colorGradingEnabled = this.editorPostProcessing.imageProcessingConfig.useColorGrading; // false by default
                        if (defaultPipeline.imageProcessing.colorGradingEnabled) {
                            // KEEP FOR REFERENCE
                            /* using .3dl (best) : defaultPipeline.imageProcessing.colorGradingTexture = new BABYLON.ColorGradingTexture("textures/LateSunset.3dl", this.scene); */
                            /* using .png :
                            var colorGradingTexture = new BABYLON.Texture("textures/colorGrade-highContrast.png", this.scene, true, false);
                            colorGradingTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                            colorGradingTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;                
                            defaultPipeline.imageProcessing.colorGradingTexture = colorGradingTexture;
                            defaultPipeline.imageProcessing.colorGradingWithGreenDepth = false; */
                            //////////////////////////////////////////////////////////////////////////
                            if (this.editorPostProcessing.imageProcessingConfig.setGradingTexture != null) {
                                const colorGradingTexture: BABYLON.Texture = TOOLKIT.Utilities.ParseTexture(this.editorPostProcessing.imageProcessingConfig.setGradingTexture, this.scene, true, false);
                                colorGradingTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                colorGradingTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
                                defaultPipeline.imageProcessing.colorGradingTexture = colorGradingTexture;
                                (<any>defaultPipeline.imageProcessing).colorGradingWithGreenDepth = false;
                            }
                        }
                        /* Color Curves */
                        defaultPipeline.imageProcessing.colorCurvesEnabled = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.curvesEnabled; // false by default
                        if (defaultPipeline.imageProcessing.colorCurvesEnabled) {
                            var curve = new BABYLON.ColorCurves();
                            curve.globalDensity = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.globalDen; // 0 by default
                            curve.globalExposure = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.globalExp; // 0 by default
                            curve.globalHue = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.globalHue; // 30 by default
                            curve.globalSaturation = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.globalSat; // 0 by default
                            curve.highlightsDensity = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.highlightsDen; // 0 by default
                            curve.highlightsExposure = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.highlightsExp; // 0 by default
                            curve.highlightsHue = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.highlightsHue; // 30 by default
                            curve.highlightsSaturation = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.highlightsSat; // 0 by default
                            curve.midtonesDensity = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.midtonesDen; // 0 by default
                            curve.midtonesExposure = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.midtonesExp; // 0 by default
                            curve.midtonesHue = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.midtonesHue; // 30 by default
                            curve.midtonesSaturation = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.midtonesSat; // 0 by default
                            curve.shadowsDensity = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.shadowsDen; // 0 by default
                            curve.shadowsExposure = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.shadowsExp; // 800 by default
                            curve.shadowsHue = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.shadowsHue; // 30 by default
                            curve.shadowsSaturation = this.editorPostProcessing.imageProcessingConfig.imagingColorCurves.shadowsSat; // 0 by default;
                            defaultPipeline.imageProcessing.colorCurves = curve;
                        }
                    }
                    /* Bloom */
                    defaultPipeline.bloomEnabled = this.editorPostProcessing.bloomEffectProperties.bloomEnabled; // false by default
                    if (defaultPipeline.bloomEnabled) {
                        defaultPipeline.bloomKernel = this.editorPostProcessing.bloomEffectProperties.bloomKernel; // 64 by default
                        defaultPipeline.bloomScale = this.editorPostProcessing.bloomEffectProperties.bloomScale; // 0.5 by default
                        defaultPipeline.bloomWeight = this.editorPostProcessing.bloomEffectProperties.bloomWeight; // 0.15 by default
                        defaultPipeline.bloomThreshold = this.editorPostProcessing.bloomEffectProperties.bloomThreshold; // 0.9 by default
                    }
                    /* Chromatic Abberation */
                    defaultPipeline.chromaticAberrationEnabled = this.editorPostProcessing.chromaticAberration.aberrationEnabled; // false by default
                    if (defaultPipeline.chromaticAberrationEnabled) {
                        defaultPipeline.chromaticAberration.aberrationAmount = this.editorPostProcessing.chromaticAberration.aberrationAmount; // 30 by default
                        defaultPipeline.chromaticAberration.adaptScaleToCurrentViewport = this.editorPostProcessing.chromaticAberration.adaptScaleViewport; // false by default
                        defaultPipeline.chromaticAberration.alphaMode = this.editorPostProcessing.chromaticAberration.alphaMode; // 0 by default
                        defaultPipeline.chromaticAberration.alwaysForcePOT = this.editorPostProcessing.chromaticAberration.alwaysForcePOT; // false by default
                        defaultPipeline.chromaticAberration.enablePixelPerfectMode = this.editorPostProcessing.chromaticAberration.pixelPerfectMode; // false by default
                        defaultPipeline.chromaticAberration.forceFullscreenViewport = this.editorPostProcessing.chromaticAberration.fullscreenViewport; // true by default
                    }
                    /* DOF */
                    defaultPipeline.depthOfFieldEnabled = this.editorPostProcessing.focalDepthOfField.depthOfField; // false by default
                    if (defaultPipeline.depthOfFieldEnabled && defaultPipeline.depthOfField.isSupported) {
                        defaultPipeline.depthOfFieldBlurLevel = this.editorPostProcessing.focalDepthOfField.blurLevel; // 0 by default
                        defaultPipeline.depthOfField.fStop = this.editorPostProcessing.focalDepthOfField.focalStop; // 1.4 by default
                        defaultPipeline.depthOfField.focalLength = this.editorPostProcessing.focalDepthOfField.focalLength; // 50 by default, mm
                        defaultPipeline.depthOfField.focusDistance = this.editorPostProcessing.focalDepthOfField.focusDistance; // 2000 by default, mm
                        defaultPipeline.depthOfField.lensSize = this.editorPostProcessing.focalDepthOfField.maxLensSize; // 50 by default
                    }
                    /* FXAA */
                    defaultPipeline.fxaaEnabled = this.editorPostProcessing.screenAntiAliasing.fxaaEnabled; // false by default
                    if (defaultPipeline.fxaaEnabled) {
                        defaultPipeline.fxaa.samples = this.editorPostProcessing.screenAntiAliasing.fxaaSamples; // 1 by default
                        defaultPipeline.fxaa.adaptScaleToCurrentViewport = this.editorPostProcessing.screenAntiAliasing.fxaaScaling; // false by default
                    }
                    /* GlowLayer */
                    defaultPipeline.glowLayerEnabled = this.editorPostProcessing.glowLayerProperties.glowEnabled;
                    if (defaultPipeline.glowLayerEnabled) {
                        defaultPipeline.glowLayer.intensity = this.editorPostProcessing.glowLayerProperties.glowIntensity; // 1 by default
                        defaultPipeline.glowLayer.blurKernelSize = this.editorPostProcessing.glowLayerProperties.blurKernelSize; // 16 by default
                    }
                    /* Grain */
                    defaultPipeline.grainEnabled = this.editorPostProcessing.grainEffectProperties.grainEnabled;
                    if (defaultPipeline.grainEnabled) {
                        defaultPipeline.grain.animated = this.editorPostProcessing.grainEffectProperties.grainAnimated; // false by default
                        defaultPipeline.grain.intensity = this.editorPostProcessing.grainEffectProperties.grainIntensity; // 30 by default
                        defaultPipeline.grain.adaptScaleToCurrentViewport = this.editorPostProcessing.grainEffectProperties.adaptScaleViewport; // false by default
                    }
                    /* Sharpen */
                    defaultPipeline.sharpenEnabled = this.editorPostProcessing.sharpEffectProperties.sharpenEnabled;
                    if (defaultPipeline.sharpenEnabled) {
                        defaultPipeline.sharpen.edgeAmount = this.editorPostProcessing.sharpEffectProperties.sharpEdgeAmount; // 0.3 by default
                        defaultPipeline.sharpen.colorAmount = this.editorPostProcessing.sharpEffectProperties.sharpColorAmount; // 1 by default
                        defaultPipeline.sharpen.adaptScaleToCurrentViewport = this.editorPostProcessing.sharpEffectProperties.adaptScaleViewport; // false by default
                    }
                } else {
                    TOOLKIT.SceneManager.LogWarning("Babylon.js default rendering pipeline not supported");
                }
                // ..
                // Screen Space Ambient Occlusion
                // ..
                if (this.editorPostProcessing.screenSpaceRendering != null && this.editorPostProcessing.screenSpaceRendering.SSAO === true) {
                    const ssaoRatio: any = {
                        ssaoRatio: this.editorPostProcessing.screenSpaceRendering.SSAORatio,     // Ratio of the SSAO post-process, in a lower resolution
                        combineRatio: this.editorPostProcessing.screenSpaceRendering.combineRatio   // Ratio of the combine post-process (combines the SSAO and the scene)
                    };
                    PROJECT.DefaultCameraSystem.screenSpacePipeline = new BABYLON.SSAORenderingPipeline("DefaultCameraSystem-SSAO", this.scene, ssaoRatio, this.scene.cameras);
                    if (PROJECT.DefaultCameraSystem.screenSpacePipeline.isSupported === true) {
                        const ssaoPipeline: BABYLON.SSAORenderingPipeline = PROJECT.DefaultCameraSystem.screenSpacePipeline;
                        ssaoPipeline.fallOff = this.editorPostProcessing.screenSpaceRendering.fallOff;
                        ssaoPipeline.area = this.editorPostProcessing.screenSpaceRendering.area;
                        ssaoPipeline.radius = this.editorPostProcessing.screenSpaceRendering.radius;
                        ssaoPipeline.totalStrength = this.editorPostProcessing.screenSpaceRendering.totalStrength;
                        ssaoPipeline.base = this.editorPostProcessing.screenSpaceRendering.baseValue;
                    } else {
                        TOOLKIT.SceneManager.LogWarning("Babylon.js SSAO rendering pipeline not supported");
                    }
                }
            }
            //}
            PROJECT.DefaultCameraSystem.cameraReady = true;
            // DEBUG: console.log("Default Camera System Ready: ", this);
        }
        protected updateCameraSystemState(): void {
            if (this.m_cameraRig != null) {
                if (this.cameraType === 0) {        // Default Universal Camera
                } else if (this.cameraType === 1) { // Augmented Reality Camera
                } else if (this.cameraType === 2) { // Virtual Reality Camera
                } else if (this.cameraType === 3) { // Multi Player Camera
                }
            }
            if (this.cameraController.cameraControl === 3) { // Follow Target Camera
                const deltaTime:number = this.getDeltaSeconds();
                const userMouseX:number = TOOLKIT.InputController.GetUserInput(TOOLKIT.UserInputAxis.MouseX, this.cameraController.playerNumber);
                const userMouseY:number = TOOLKIT.InputController.GetUserInput(TOOLKIT.UserInputAxis.MouseY, this.cameraController.playerNumber);
                this.targetRotationVector.y += (userMouseX * this.cameraController.rotateSpeed * deltaTime);
                this.targetRotationVector.x += (-userMouseY * this.cameraController.rotateSpeed * deltaTime);
                this.targetRotationVector.x = BABYLON.Scalar.Clamp(this.targetRotationVector.x, -BABYLON.Tools.ToRadians(this.cameraController.downLookLimit), BABYLON.Tools.ToRadians(this.cameraController.topLookLimit));
                if (this.cameraController.autoUpdate === true) {
                    PROJECT.DefaultCameraSystem.UpdateFollowTarget();
                }
            }
        }
        protected cleanCameraSystemState(): void {
            if (PROJECT.DefaultCameraSystem.PlayerOneCamera != null) {
                //PROJECT.DefaultCameraSystem.PlayerOneCamera.dispose();
                PROJECT.DefaultCameraSystem.PlayerOneCamera = null;
            }
            if (PROJECT.DefaultCameraSystem.PlayerTwoCamera != null) {
                //PROJECT.DefaultCameraSystem.PlayerTwoCamera.dispose();
                PROJECT.DefaultCameraSystem.PlayerTwoCamera = null;
            }
            if (PROJECT.DefaultCameraSystem.PlayerThreeCamera != null) {
                //PROJECT.DefaultCameraSystem.PlayerThreeCamera.dispose();
                PROJECT.DefaultCameraSystem.PlayerThreeCamera = null;
            }
            if (PROJECT.DefaultCameraSystem.PlayerFourCamera != null) {
                //PROJECT.DefaultCameraSystem.PlayerFourCamera.dispose();
                PROJECT.DefaultCameraSystem.PlayerFourCamera = null;
            }
        }
        protected destroyCameraSystemState(): void {
            this.immersiveOptions = null;
            this.cameraPivot = null;
            this.cameraNode = null;
        }

        /*********************************************/
        /** Follow Target Camera Controller Helpers  */
        /*********************************************/

        public targetCameraOffset: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        public getCameraPivotPosition(): BABYLON.Vector3 { return (this.cameraPivot != null) ? this.cameraPivot.position : null; }
        public getCameraPivotRotation(): BABYLON.Quaternion { return (this.cameraPivot != null) ? this.cameraPivot.rotationQuaternion : null; }
        public getCameraBoomNode(): BABYLON.TransformNode { return this.cameraNode; }
        public getCameraTransform(): BABYLON.TransformNode { return this.cameraPivot; }

        private cameraNode: BABYLON.TransformNode = null;
        private cameraPivot: BABYLON.Mesh = null;
        private cameraDistance: number = 0;
        private cameraPivotOffset: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        private cameraBoomPosition: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        private dollyDirection: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        private rotationEulers: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        private scaledCamDirection: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        private scaledMaxDirection: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        private parentNodePosition: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        private maximumCameraPos: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);
        private cameraRaycastShape: BABYLON.PhysicsShapeSphere = null;
        private targetRotationVector: BABYLON.Vector2 = BABYLON.Vector2.Zero();

        private resetCameraRotation(): void {
            if (this.setCameraTarget == null) return;
            this.setCameraTarget.rotationQuaternion.toEulerAnglesToRef(this.rotationEulers);
            this.targetRotationVector.x = this.rotationEulers.x;
            this.targetRotationVector.y = this.rotationEulers.y;
        }

        private updateCameraController(): void {
            const deltaTime:number = this.getDeltaSeconds();
            if (this.cameraController.targetTracking === false || this.setCameraTarget == null) return;
            // ..
            // DUNNO FUR SURE:  if (this.isCharacterNavigating === true && this.navigationAngularSpeed > 0) allowRotation = false;
            // ..
            // Create Camera Shape
            // ..
            if (this.cameraRaycastShape == null) {
                this.cameraRaycastShape = new BABYLON.PhysicsShapeSphere(new BABYLON.Vector3(0, 0, 0), this.cameraController.sphereRadius, this.scene);
            }
            // ..
            // Create Camera Pivot
            // ..
            if (this.cameraPivot == null) {
                this.resetCameraRotation();
                this.cameraPivot = new BABYLON.Mesh(this.setCameraTarget.name + ".CameraPivot", this.scene);
                this.cameraPivot.parent = null;
                this.cameraPivot.position = this.setCameraTarget.position.clone();
                this.cameraPivot.rotationQuaternion = this.setCameraTarget.rotationQuaternion.clone();
                this.cameraPivot.checkCollisions = false;
                this.cameraPivot.isPickable = false;
                if (TOOLKIT.Utilities.ShowDebugColliders()) {
                    const testPivot: BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("TestPivot", { width: 0.25, height: 0.25, depth: 0.75 }, this.scene);
                    testPivot.parent = this.cameraPivot;
                    testPivot.position.set(0, 0, 0);
                    testPivot.rotationQuaternion = new BABYLON.Quaternion(0, 0, 0, 1);
                    testPivot.visibility = 1.0;
                    testPivot.renderingGroupId = TOOLKIT.Utilities.ColliderRenderGroup();
                    testPivot.checkCollisions = false;
                    testPivot.isPickable = false;
                }
            }
            // ..
            // Create Camera Node
            // ..
            if (this.cameraNode == null) {
                const player: number = (this.cameraController.playerNumber != null) ? this.cameraController.playerNumber : 1;
                const playerCamera: number = (player <= 0 || player > 4) ? 1 : player;
                const playerCameraNode = PROJECT.DefaultCameraSystem.GetCameraTransform(this.scene, playerCamera);
                const playerFreeCamera = PROJECT.DefaultCameraSystem.GetMainCamera(this.scene, false);
                if (playerCameraNode != null && playerFreeCamera != null) {
                    playerFreeCamera.detachControl(); // NOTE: ALWAYS DETACH CONTROL
                    this.cameraNode = playerCameraNode;
                    this.cameraNode.parent = this.cameraPivot;
                    this.cameraNode.position.set(this.cameraController.boomPosition.x, this.cameraController.boomPosition.y, this.cameraController.boomPosition.z);
                    this.cameraNode.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(BABYLON.Tools.ToRadians(this.cameraController.maxTiltAngle), 0, 0);
                    // ..
                    // TODO - Move somewhere better - ???
                    // TODO - Handle Long Intitial Camera Pan - ???
                    // ..
                    this.cameraDistance = this.cameraNode.position.length();
                    this.dollyDirection.copyFrom(this.cameraNode.position);
                    this.dollyDirection.normalize();
                } else {
                    // DEBUG: TOOLKIT.SceneManager.LogWarning("Failed to locate player camera for: " + this.transform.name);
                }
            }
            // ..
            // Update Camera Pivot
            // ..
            if (this.cameraPivot != null) {
                // .. 
                // Update Camera Pivot Offset
                // ..
                if (this.targetCameraOffset.x !== 0 || this.targetCameraOffset.y !== 0 || this.targetCameraOffset.z !== 0) {
                    this.cameraPivotOffset.copyFrom(this.targetCameraOffset);
                } else {
                    this.cameraPivotOffset.set(0, this.cameraController.pivotHeight, 0);
                }
                // ..
                // Update Camera Pivot Position
                // ..
                TOOLKIT.Utilities.GetAbsolutePositionToRef(this.setCameraTarget, this.cameraPivot.position, this.cameraPivotOffset);

                // Smooth velocity changes with snap when close enough
                // if (this._velocitySmoothTime > 0 && BABYLON.Vector3.Distance(this._smoothedVelocity, this._targetVelocity) > this._velocitySnapThreshold)
                // {
                //     const deltaTime = this.getDeltaSeconds();
                //     const smoothingFactor = Math.min(1, (1 / this._velocitySmoothTime) * deltaTime);
                //     BABYLON.Vector3.LerpToRef(
                //         this._smoothedVelocity,
                //         this._targetVelocity,
                //         smoothingFactor,
                //         this._smoothedVelocity
                //     );
                // }
                // else
                // {
                //     // Snap to target velocity when close enough or smoothing is disabled
                //     this._smoothedVelocity.copyFrom(this._targetVelocity);
                // }

                // Smoothly interpolate the cameraPivot to follow the target + offset
                // BABYLON.Vector3.LerpToRef(
                //     this.cameraPivot.position,
                //     this.setCameraTarget.getAbsolutePosition().add(this.cameraPivotOffset),
                //     deltaTime * PROJECT.DefaultCameraSystem.FOLLOW_SPEED,
                //     this.cameraPivot.position
                // );


                // ..
                // Update Camera Pivot Rotation
                // ..
                if (this.cameraController.rotateCamera === true) {
                    BABYLON.Quaternion.FromEulerAnglesToRef(this.targetRotationVector.x, this.targetRotationVector.y, 0, this.cameraPivot.rotationQuaternion);
                }
            }
            if (this.cameraController.rotateCamera === true && this.cameraNode != null) {
                if (this.cameraController.cameraSmoothing <= 0) this.cameraController.cameraSmoothing = 5.0; // Default Camera Smoothing
                if (this.cameraController.cameraCollisions === true) {
                    // ..
                    // Check Camera Collision
                    // ..
                    // DEPRECATED: const maxDistance:number = this.cameraController.maxDistance;
                    const maxDistance:number = Math.abs(this.cameraController.boomPosition.z);
                    const parentNode: BABYLON.TransformNode = (this.cameraNode.parent as BABYLON.TransformNode);
                    this.dollyDirection.scaleToRef(maxDistance, this.scaledMaxDirection);
                    this.dollyDirection.scaleToRef(this.cameraDistance, this.scaledCamDirection);
                    TOOLKIT.Utilities.GetAbsolutePositionToRef(parentNode, this.parentNodePosition);
                    TOOLKIT.Utilities.TransformPointToRef(parentNode, this.scaledMaxDirection, this.maximumCameraPos);
                    // ..
                    let contact: boolean = false;
                    let distance: number = 0;
                    // ..
                    // NOTE: USE SHAPECAST
                    // ..
                    if (this.cameraRaycastShape != null) {
                        const query = {
                            shape: this.cameraRaycastShape,
                            rotation: this.cameraNode.rotationQuaternion,
                            startPosition: this.parentNodePosition,
                            endPosition: this.maximumCameraPos,
                            ignoreBody: this.setCameraTarget.physicsBody,
                            shouldHitTriggers: false
                        }
                        const result = TOOLKIT.RigidbodyPhysics.Shapecast(query);
                        contact = (result != null && result.world != null && result.world.hasHit === true && result.world.body != null);
                        distance = (contact === true) ? BABYLON.Vector3.Distance(this.parentNodePosition, result.world.hitPoint) : 0;
                        // ..
                        // DEBUG: Camera Collisions
                        // ..
                        // let msg:string = "";
                        // if (contact === true) {
                        //     msg = ("Camera Contact With: " + result.world.body.transformNode.name + " at distance: " + distance);
                        // } else {
                        //     msg = ("No Camera Contact");
                        // }
                        // TOOLKIT.WindowManager.PrintToScreen(msg);
                    }
                    if (contact === true) {
                        this.cameraDistance = BABYLON.Scalar.Clamp((distance * this.cameraController.distanceFactor), this.cameraController.minDistance, this.cameraController.maxDistance);
                        // Recalculate scaled direction with new distance to prevent feedback loops
                        this.dollyDirection.scaleToRef(this.cameraDistance, this.scaledCamDirection);
                        // Lerp Past Camera Collisions - with improved diagonal smoothing
                        if (this.cameraNode.position.x !== this.scaledCamDirection.x || this.cameraNode.position.y !== this.scaledCamDirection.y || this.cameraNode.position.z !== this.scaledCamDirection.z) {
                            // Apply adaptive smoothing to reduce stretching during rapid diagonal movement
                            const cameraDelta = this.cameraNode.position.subtract(this.scaledCamDirection);
                            const deltaLength = cameraDelta.length();
                            const adaptiveSmoothingFactor = deltaLength > 0.3 ? this.cameraController.cameraSmoothing * 0.8 : this.cameraController.cameraSmoothing;
                            
                            BABYLON.Vector3.LerpToRef(this.cameraNode.position, this.scaledCamDirection, (deltaTime * adaptiveSmoothingFactor), this.cameraNode.position);
                        }
                    } else {
                        if (this.cameraController.mouseWheel === true) {
                            if (TOOLKIT.InputController.IsWheelScrolling()) {
                                const wheel: number = TOOLKIT.InputController.GetUserInput(TOOLKIT.UserInputAxis.Wheel);
                                if (wheel < 0) { // ZOOM OUT
                                    const zoomOutSpeed: number = (this.cameraController.scrollSpeed * deltaTime);
                                    this.cameraController.boomPosition.z = BABYLON.Scalar.MoveTowards(this.cameraController.boomPosition.z, -this.cameraController.maxDistance, zoomOutSpeed);
                                } else if (wheel > 0) { // ZOOM IN
                                    const zoomInSpeed: number = (this.cameraController.scrollSpeed * deltaTime);
                                    this.cameraController.boomPosition.z = BABYLON.Scalar.MoveTowards(this.cameraController.boomPosition.z, -this.cameraController.minDistance, zoomInSpeed);
                                }
                            }
                        }
                        // Lerp To Camera Boom Position - with improved diagonal smoothing
                        if (this.cameraNode.position.x !== this.cameraBoomPosition.x || this.cameraNode.position.y !== this.cameraBoomPosition.y || this.cameraNode.position.z !== this.cameraBoomPosition.z) {
                            this.cameraBoomPosition.set(this.cameraController.boomPosition.x, this.cameraController.boomPosition.y, this.cameraController.boomPosition.z);
                            
                            // Apply adaptive smoothing to reduce stretching during rapid diagonal movement
                            const cameraDelta = this.cameraNode.position.subtract(this.cameraBoomPosition);
                            const deltaLength = cameraDelta.length();
                            const adaptiveSmoothingFactor = deltaLength > 0.3 ? this.cameraController.cameraSmoothing * 0.8 : this.cameraController.cameraSmoothing;
                            
                            BABYLON.Vector3.LerpToRef(this.cameraNode.position, this.cameraBoomPosition, (deltaTime * adaptiveSmoothingFactor), this.cameraNode.position);
                        }
                    }
                } else {
                    if (this.cameraController.mouseWheel === true) {
                        if (TOOLKIT.InputController.IsWheelScrolling()) {
                            const wheel: number = TOOLKIT.InputController.GetUserInput(TOOLKIT.UserInputAxis.Wheel);
                            if (wheel < 0) { // ZOOM OUT
                                const zoomOutSpeed: number = (this.cameraController.scrollSpeed * deltaTime);
                                this.cameraController.boomPosition.z = BABYLON.Scalar.MoveTowards(this.cameraController.boomPosition.z, -this.cameraController.maxDistance, zoomOutSpeed);
                            } else if (wheel > 0) { // ZOOM IN
                                const zoomInSpeed: number = (this.cameraController.scrollSpeed * deltaTime);
                                this.cameraController.boomPosition.z = BABYLON.Scalar.MoveTowards(this.cameraController.boomPosition.z, -this.cameraController.minDistance, zoomInSpeed);
                            }
                        }
                    }
                    // Lerp To Camera Boom Position
                    if (this.cameraNode.position.x !== this.cameraController.boomPosition.x || this.cameraNode.position.y !== this.cameraController.boomPosition.y || this.cameraNode.position.z !== this.cameraController.boomPosition.z) {
                        this.cameraBoomPosition.set(this.cameraController.boomPosition.x, this.cameraController.boomPosition.y, this.cameraController.boomPosition.z);
                        BABYLON.Vector3.LerpToRef(this.cameraNode.position, this.cameraBoomPosition, (deltaTime * this.cameraController.cameraSmoothing), this.cameraNode.position);
                    }
                }
            }
            this.updateSmoothBoomArmLength();
        }
        public getBoomArmMaxDistance(): number { return this.cameraController.maxDistance; }
        public setBoomArmMaxDistance(distance: number): void { this.cameraController.maxDistance = Math.abs(distance); }
        public setSmoothBoomArmLength(length: number, speed: number, updateMaxDistance: boolean = true): void {
            const absoluteLength: number = Math.abs(length);
            this.smoothBoomArmLength = -absoluteLength;
            this.smoothBoomArmSpeed = speed;
            if (updateMaxDistance === true) {
                const absoluteDistance: number = Math.abs(this.cameraController.maxDistance);
                if (absoluteLength > absoluteDistance) {
                    this.setBoomArmMaxDistance(absoluteLength);
                }
            }
        }
        private smoothBoomArmLength: BABYLON.Nullable<number> = null;
        private smoothBoomArmSpeed: BABYLON.Nullable<number> = null;
        private updateSmoothBoomArmLength(): void {
            if (this.smoothBoomArmLength != null && this.smoothBoomArmSpeed != null) {
                if (this.cameraController.boomPosition.z !== this.smoothBoomArmLength) {
                    this.cameraController.boomPosition.z = BABYLON.Scalar.MoveTowards(this.cameraController.boomPosition.z, this.smoothBoomArmLength, (this.smoothBoomArmSpeed * this.getDeltaSeconds()));
                } else {
                    this.smoothBoomArmLength = null;
                    this.smoothBoomArmSpeed = null;
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera Follow Target Functions
        ////////////////////////////////////////////////////////////////////////////////////

        public static EnableTracking(value:boolean): void {
            if (PROJECT.DefaultCameraSystem.cameraInstance != null && PROJECT.DefaultCameraSystem.cameraInstance.cameraController != null) {
                PROJECT.DefaultCameraSystem.cameraInstance.cameraController.targetTracking = value;
            }
        }

        public static IsTrackingEnabled(): boolean {
            let result: boolean = false;
            if (PROJECT.DefaultCameraSystem.cameraInstance != null && PROJECT.DefaultCameraSystem.cameraInstance.cameraController != null) {
                result = PROJECT.DefaultCameraSystem.cameraInstance.cameraController.targetTracking;
            }
            return result;
        }

        public static SetAutoUpdate(value:boolean): void {
            if (PROJECT.DefaultCameraSystem.cameraInstance != null && PROJECT.DefaultCameraSystem.cameraInstance.cameraController != null) {
                PROJECT.DefaultCameraSystem.cameraInstance.cameraController.autoUpdate = value;
            }
        }

        public static IsAutoUpdateEnabled(): boolean {
            let result: boolean = false;
            if (PROJECT.DefaultCameraSystem.cameraInstance != null && PROJECT.DefaultCameraSystem.cameraInstance.cameraController != null) {
                result = PROJECT.DefaultCameraSystem.cameraInstance.cameraController.autoUpdate;
            }
            return result;
        }

        public static GetFollowTarget(): BABYLON.TransformNode {
            return (PROJECT.DefaultCameraSystem.cameraInstance != null) ? PROJECT.DefaultCameraSystem.cameraInstance.setCameraTarget : null;
        }

        public static SetFollowTarget(target:BABYLON.TransformNode): void {
            if (PROJECT.DefaultCameraSystem.cameraInstance != null) {
                PROJECT.DefaultCameraSystem.cameraInstance.setCameraTarget = target;
            }
        }

        public static ResetFollowTarget(): void {
            if (PROJECT.DefaultCameraSystem.cameraInstance != null) {
                PROJECT.DefaultCameraSystem.cameraInstance.resetCameraRotation();
            }
        }

        public static UpdateFollowTarget(): void {
            if (PROJECT.DefaultCameraSystem.cameraInstance != null) {
                PROJECT.DefaultCameraSystem.cameraInstance.updateCameraController();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera Virtual Reality Functions
        ////////////////////////////////////////////////////////////////////////////////////

        /** Get the WebXR default experience helper */
        public static GetWebXR(): BABYLON.WebXRDefaultExperience { return PROJECT.DefaultCameraSystem.XRExperienceHelper; }
        /** Is universal camera system in WebXR mode */
        public static IsInWebXR(): boolean { return (PROJECT.DefaultCameraSystem.XRExperienceHelper != null && PROJECT.DefaultCameraSystem.XRExperienceHelper.baseExperience != null && PROJECT.DefaultCameraSystem.XRExperienceHelper.baseExperience.state === BABYLON.WebXRState.IN_XR); }
        /** Setup navigation mesh for WebXR */
        private static SetupNavigationWebXR(mesh: BABYLON.Mesh, tag: string): void {
            const webxr: BABYLON.WebXRDefaultExperience = PROJECT.DefaultCameraSystem.XRExperienceHelper;
            if (webxr != null && webxr.teleportation != null && mesh != null && tag != null && tag != "") {
                const hastag: boolean = BABYLON.Tags.MatchesQuery(mesh, tag);
                if (hastag === true) webxr.teleportation.addFloorMesh(mesh);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera System Player Functions
        ////////////////////////////////////////////////////////////////////////////////////

        /** Get main camera rig for the scene */
        public static GetMainCamera(scene: BABYLON.Scene, detach: boolean = false): BABYLON.FreeCamera {
            return PROJECT.DefaultCameraSystem.GetPlayerCamera(scene, TOOLKIT.PlayerNumber.One, detach);
        }
        /** Get universal camera rig for desired player */
        public static GetPlayerCamera(scene: BABYLON.Scene, player: TOOLKIT.PlayerNumber = TOOLKIT.PlayerNumber.One, detach: boolean = false): BABYLON.FreeCamera {
            let result: BABYLON.FreeCamera = null;
            let transform: BABYLON.TransformNode = PROJECT.DefaultCameraSystem.GetCameraTransform(scene, player);
            if (PROJECT.DefaultCameraSystem.IsCameraSystemReady()) {
                if (player === TOOLKIT.PlayerNumber.One && PROJECT.DefaultCameraSystem.PlayerOneCamera != null) result = PROJECT.DefaultCameraSystem.PlayerOneCamera;
                else if (player === TOOLKIT.PlayerNumber.Two && PROJECT.DefaultCameraSystem.PlayerTwoCamera != null) result = PROJECT.DefaultCameraSystem.PlayerTwoCamera;
                else if (player === TOOLKIT.PlayerNumber.Three && PROJECT.DefaultCameraSystem.PlayerThreeCamera != null) result = PROJECT.DefaultCameraSystem.PlayerThreeCamera;
                else if (player === TOOLKIT.PlayerNumber.Four && PROJECT.DefaultCameraSystem.PlayerFourCamera != null) result = PROJECT.DefaultCameraSystem.PlayerFourCamera;
                if (result != null && detach === true && parent != null) {
                    result.parent = null;
                    if (transform != null) {
                        result.position.copyFrom(transform.position);
                        result.rotationQuaternion = (transform.rotationQuaternion != null) ? transform.rotationQuaternion.clone() : BABYLON.Quaternion.FromEulerAngles(transform.rotation.x, transform.rotation.y, transform.rotation.z);
                        const children: BABYLON.Node[] = transform.getChildren(null, true);
                        if (children != null) {
                            children.forEach((child: BABYLON.Node) => { child.parent = result; });
                        }
                    }
                }
            }
            return result;
        }
        /** Get camera transform node for desired player */
        public static GetCameraTransform(scene: BABYLON.Scene, player: TOOLKIT.PlayerNumber = TOOLKIT.PlayerNumber.One): BABYLON.TransformNode {
            let result: BABYLON.TransformNode = null;
            if (PROJECT.DefaultCameraSystem.IsCameraSystemReady()) {
                if (player === TOOLKIT.PlayerNumber.One && PROJECT.DefaultCameraSystem.PlayerOneCamera != null && (<any>PROJECT.DefaultCameraSystem.PlayerOneCamera).transform != null) result = (<any>PROJECT.DefaultCameraSystem.PlayerOneCamera).transform;
                else if (player === TOOLKIT.PlayerNumber.Two && PROJECT.DefaultCameraSystem.PlayerTwoCamera != null && (<any>PROJECT.DefaultCameraSystem.PlayerTwoCamera).transform != null) result = (<any>PROJECT.DefaultCameraSystem.PlayerTwoCamera).transform;
                else if (player === TOOLKIT.PlayerNumber.Three && PROJECT.DefaultCameraSystem.PlayerThreeCamera != null && (<any>PROJECT.DefaultCameraSystem.PlayerThreeCamera).transform != null) result = (<any>PROJECT.DefaultCameraSystem.PlayerThreeCamera).transform;
                else if (player === TOOLKIT.PlayerNumber.Four && PROJECT.DefaultCameraSystem.PlayerFourCamera != null && (<any>PROJECT.DefaultCameraSystem.PlayerFourCamera).transform != null) result = (<any>PROJECT.DefaultCameraSystem.PlayerFourCamera).transform;
            }
            return result;
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // Universal Camera System Multi Player Functions
        ////////////////////////////////////////////////////////////////////////////////////

        /** Are stereo side side camera services available. */
        public static IsStereoCameras(): boolean {
            return PROJECT.DefaultCameraSystem.stereoCameras;
        }
        /** Are local multi player view services available. */
        public static IsMultiPlayerView(): boolean {
            return PROJECT.DefaultCameraSystem.multiPlayerView;
        }
        /** Get the current local multi player count */
        public static GetMultiPlayerCount(): number {
            return PROJECT.DefaultCameraSystem.multiPlayerCount;
        }
        /** Activates current local multi player cameras. */
        public static ActivateMultiPlayerCameras(scene: BABYLON.Scene): boolean {
            let result: boolean = false;
            if (PROJECT.DefaultCameraSystem.multiPlayerCameras != null && PROJECT.DefaultCameraSystem.multiPlayerCameras.length > 0) {
                scene.activeCameras = PROJECT.DefaultCameraSystem.multiPlayerCameras;
                result = true;
            }
            return result;
        }
        /** Disposes current local multiplayer cameras */
        public static DisposeMultiPlayerCameras(): void {
            if (PROJECT.DefaultCameraSystem.PlayerOneCamera != null) {
                PROJECT.DefaultCameraSystem.PlayerOneCamera.dispose();
                PROJECT.DefaultCameraSystem.PlayerOneCamera = null;
            }
            if (PROJECT.DefaultCameraSystem.PlayerTwoCamera != null) {
                PROJECT.DefaultCameraSystem.PlayerTwoCamera.dispose();
                PROJECT.DefaultCameraSystem.PlayerTwoCamera = null;
            }
            if (PROJECT.DefaultCameraSystem.PlayerThreeCamera != null) {
                PROJECT.DefaultCameraSystem.PlayerThreeCamera.dispose();
                PROJECT.DefaultCameraSystem.PlayerThreeCamera = null;
            }
            if (PROJECT.DefaultCameraSystem.PlayerFourCamera != null) {
                PROJECT.DefaultCameraSystem.PlayerFourCamera.dispose();
                PROJECT.DefaultCameraSystem.PlayerFourCamera = null;
            }
        }
        /** Sets the multi player camera view layout */
        public static SetMultiPlayerViewLayout(scene: BABYLON.Scene, totalNumPlayers: number): boolean {
            let result: boolean = false;
            let players: number = BABYLON.Scalar.Clamp(totalNumPlayers, 1, 4);
            if (PROJECT.DefaultCameraSystem.IsMultiPlayerView()) {
                if (PROJECT.DefaultCameraSystem.PlayerOneCamera != null && PROJECT.DefaultCameraSystem.PlayerTwoCamera != null && PROJECT.DefaultCameraSystem.PlayerThreeCamera != null && PROJECT.DefaultCameraSystem.PlayerFourCamera != null) {
                    PROJECT.DefaultCameraSystem.multiPlayerCameras = [];
                    if (players === 1) {
                        PROJECT.DefaultCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0, 1, 1);
                        PROJECT.DefaultCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.DefaultCameraSystem.PlayerTwoCamera.setEnabled(false);
                        PROJECT.DefaultCameraSystem.PlayerThreeCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.DefaultCameraSystem.PlayerThreeCamera.setEnabled(false);
                        PROJECT.DefaultCameraSystem.PlayerFourCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.DefaultCameraSystem.PlayerFourCamera.setEnabled(false);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerOneCamera);
                    } else if (players === 2) {
                        if (PROJECT.DefaultCameraSystem.stereoCameras === true) {
                            PROJECT.DefaultCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0, 0.5, 1);
                            PROJECT.DefaultCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1);
                        } else {
                            PROJECT.DefaultCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0.5, 1, 0.5);
                            PROJECT.DefaultCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0, 0, 1, 0.5);
                        }
                        PROJECT.DefaultCameraSystem.PlayerTwoCamera.setEnabled(true);
                        PROJECT.DefaultCameraSystem.PlayerThreeCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.DefaultCameraSystem.PlayerThreeCamera.setEnabled(false);
                        PROJECT.DefaultCameraSystem.PlayerFourCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.DefaultCameraSystem.PlayerFourCamera.setEnabled(false);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerOneCamera);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerTwoCamera);
                    } else if (players === 3) {
                        PROJECT.DefaultCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0, 0.5, 1);
                        PROJECT.DefaultCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0.5, 0.5, 0.5, 0.5);
                        PROJECT.DefaultCameraSystem.PlayerTwoCamera.setEnabled(true);
                        PROJECT.DefaultCameraSystem.PlayerThreeCamera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 0.5);
                        PROJECT.DefaultCameraSystem.PlayerThreeCamera.setEnabled(true);
                        PROJECT.DefaultCameraSystem.PlayerFourCamera.viewport = new BABYLON.Viewport(0, 0, 0, 0);
                        PROJECT.DefaultCameraSystem.PlayerFourCamera.setEnabled(false);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerOneCamera);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerTwoCamera);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerThreeCamera);
                    } else if (players === 4) {
                        PROJECT.DefaultCameraSystem.PlayerOneCamera.viewport = new BABYLON.Viewport(0, 0.5, 0.5, 0.5);
                        PROJECT.DefaultCameraSystem.PlayerTwoCamera.viewport = new BABYLON.Viewport(0, 0, 0.5, 0.5);
                        PROJECT.DefaultCameraSystem.PlayerTwoCamera.setEnabled(true);
                        PROJECT.DefaultCameraSystem.PlayerThreeCamera.viewport = new BABYLON.Viewport(0.5, 0.5, 0.5, 0.5);
                        PROJECT.DefaultCameraSystem.PlayerThreeCamera.setEnabled(true);
                        PROJECT.DefaultCameraSystem.PlayerFourCamera.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 0.5);
                        PROJECT.DefaultCameraSystem.PlayerFourCamera.setEnabled(true);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerOneCamera);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerTwoCamera);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerThreeCamera);
                        PROJECT.DefaultCameraSystem.multiPlayerCameras.push(PROJECT.DefaultCameraSystem.PlayerFourCamera);
                    } else {
                        TOOLKIT.SceneManager.LogWarning("Babylon.js camera rig invalid player count specified: " + players);
                    }
                } else {
                    TOOLKIT.SceneManager.LogWarning("Babylon.js camera rig failed to initialize multi player cameras");
                }
                PROJECT.DefaultCameraSystem.multiPlayerCount = players;
                result = PROJECT.DefaultCameraSystem.ActivateMultiPlayerCameras(scene);
                if (result === false) TOOLKIT.SceneManager.LogWarning("Babylon.js camera rig failed to initialize multi player views");
            } else {
                TOOLKIT.SceneManager.LogWarning("Babylon.js camera rig multi player view option not enabled");
            }
            return result;
        }
    }

    /*********************************************/
    /** Camera Editor Properties Support Classes */
    /*********************************************/

    export interface IEditorArcRtotate {
        alpha: number;
        beta: number;
        radius: number;
        target: TOOLKIT.IUnityVector3;
    }
    export interface IEditorPostProcessing {
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
    export interface IEditorScreenSpace {
        SSAO: boolean;
        SSAORatio: number;
        combineRatio: number;
        totalStrength: number;
        radius: number;
        area: number;
        fallOff: number;
        baseValue: number;
    }
    export interface IEditorAntiAliasing {
        msaaSamples: number;
        fxaaEnabled: boolean;
        fxaaScaling: boolean;
        fxaaSamples: number;
    }
    export interface IEditorDepthOfField {
        depthOfField: boolean;
        blurLevel: number;
        focalStop: number;
        focalLength: number;
        focusDistance: number;
        maxLensSize: number;
    }
    export interface IEditorChromaticAberration {
        aberrationEnabled: boolean;
        aberrationAmount: number;
        adaptScaleViewport: boolean;
        alphaMode: number;
        alwaysForcePOT: boolean;
        pixelPerfectMode: boolean;
        fullscreenViewport: boolean;
    }
    export interface IEditorGlowLayer {
        glowEnabled: boolean;
        glowIntensity: number;
        blurKernelSize: number;
    }
    export interface IEditorGrainEffect {
        grainEnabled: boolean;
        grainAnimated: boolean;
        grainIntensity: number;
        adaptScaleViewport: boolean;
    }
    export interface IEditorSharpenEffect {
        sharpenEnabled: boolean;
        sharpEdgeAmount: number;
        sharpColorAmount: number;
        adaptScaleViewport: boolean;
    }
    export interface IEditorBloomProcessing {
        bloomEnabled: boolean;
        bloomKernel: number;
        bloomScale: number;
        bloomWeight: number;
        bloomThreshold: number;
    }
    export interface IEditorColorCurves {
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
    export interface IEditorImageProcessing {
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

    TOOLKIT.SceneManager.RegisterClass("PROJECT.DefaultCameraSystem", DefaultCameraSystem);
}