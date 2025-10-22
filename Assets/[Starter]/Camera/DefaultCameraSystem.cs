#if UNITY_EDITOR
using System;
using UnityEngine;
using UnityEditor;

[InitializeOnLoad]
[RequireComponent(typeof(UnityEngine.Camera))]
[Babylon(Class="PROJECT.DefaultCameraSystem"), AddComponentMenu(CanvasToolsStatics.CANVAS_TOOLS_MENU + "/Content Components/Camera/Default Camera System", 2188)]
public class DefaultCameraSystem : EditorScriptComponent
{   public enum FullScreenToggle { EnableKeyboardButtonF = 0, DisableKeyboardButtonF = 1 }
    public EditorCameraOptions mainCameraType = EditorCameraOptions.UniversalCamera;
    public FullScreenToggle fullScreenToggle = FullScreenToggle.EnableKeyboardButtonF;
    [Auto] public Transform setCameraTarget = null;
    [Range(0.0f, 1.0f)] public float setCameraInertia = 0.9f;
    public bool setSpatialAudio = true;
    public bool setPointerLock = false;
    public EditorAttachControl cameraController = null;
    public EditorVirtualReality immersiveOptions = null;
    public EditorMultiPlayer multiPlayerSetup = null;
    public EditorPostProcessing renderingPipeline = null;
}

[CustomEditor(typeof(DefaultCameraSystem)), CanEditMultipleObjects]
public class DefaultCameraSystemEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();
        DefaultCameraSystem script = (DefaultCameraSystem)target;
    }
}

////////////////////////////////////////////////////////////////
// Camera System
////////////////////////////////////////////////////////////////

[Serializable]
public enum EditorCameraOptions
{
    UniversalCamera = 0,
    AugmentedReality = 1,
    VirtualReality = 2,
    MultiPlayer = 3,
    FreeCamera = 4
}

[Serializable]
public enum EditorCameraControl
{
    DefaultRig = 0,
    AttachControl = 1,
    DetachParent = 2,
    FollowTarget = 3
}

[Serializable]
public enum EditorToneMapping
{
    Standard = 0,
    ACES = 1
}

[Serializable]
public enum EditorVignetteBlending
{
    Multiply = 0,
    Opaque = 1
}

[Serializable]
public enum EditorPlayerIndex
{
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4
}

[Serializable]
public class EditorAttachControl
{
    public EditorCameraControl cameraControl = EditorCameraControl.DefaultRig;
    public bool preventDefault = false;
    public bool disableTouches = false;
    public bool checkCollisions = false;
    public bool setApplyGravity = false;

    [Header("Key Assignment")]
    public bool keyboardWASD = false;
    public bool arrowKeyRotation = false;

    [Header("Move Sensibility")]
    public float cameraSpeed = 2.0f;
    public float rotationSpeed = 0.5f;
    public float invRotationSpeed = 0.2f;

    [Header("Touch Sensibility")]
    public float touchRotation = 200000;
    public float touchMovement = 250;

    [Header("Gamepad Sensibility")]
    public float gamepadRotation = 200;
    public float gamepadMovement = 40;

    [Header("Follow Target Mode")]
    public bool targetTracking = true;
	public bool rotateCamera = true;
   	public bool mouseWheel = true;
	public EditorPlayerIndex playerNumber = EditorPlayerIndex.One;
    [Range(0.0f, 5.0f)] public float pivotHeight = 1.5f;
    public Vector3 boomPosition = new Vector3(0.0f, 0.25f, -5.0f);
    [Range(0.0f, 90.0f)] public float topLookLimit = 60.0f;
    [Range(0.0f, 90.0f)] public float downLookLimit = 30.0f;
    [Range(0.0f, 15.0f)] public float maxTiltAngle = 5.0f;
    [Range(0.0f, 50.0f)] public float maxDistance = 5.0f;
	[Range(0.0f, 50.0f)] public float minDistance = 0.5f;
    [Range(0.0f, 50.0f)] public float rotateSpeed = 2.0f;
    [Range(0.0f, 50.0f)] public float scrollSpeed = 25f;
    public bool autoUpdate = true;

    [Header("Follow Target Collider")]
	[Range(0.1f, 1.0f)] public float sphereRadius = 0.45f;
	[Range(0.1f, 1.0f)] public float distanceFactor = 0.85f;
    [Range(0.0f, 50.0f)] public float cameraSmoothing = 8;
   	public bool cameraCollisions = true;
}

[Serializable]
public class EditorPostProcessing
{
    public bool usePostProcessing = false;
    public bool highDynamicRange = false;
    public EditorAntiAliasing screenAntiAliasing = null;
    public EditorDepthOfField focalDepthOfField = null;
    public EditorChromaticAberration chromaticAberration = null;
    public EditorGlowLayer glowLayerProperties = null;
    public EditorGrainEffect grainEffectProperties = null;
    public EditorSharpenEffect sharpEffectProperties = null;
    public EditorBloomProcessing bloomEffectProperties = null;
    public EditorScreenSpaceRendering screenSpaceRendering = null;
    public EditorImageProcessing imageProcessingConfig = null;
}

[Serializable]
public class EditorScreenSpaceRendering
{
    public bool SSAO = false;
    public float SSAORatio = 0.5f;
    public float combineRatio = 1.0f;
    public float totalStrength = 1.0f;
    public float radius = 0.0001f;
    public float area = 0.0075f;
    public float fallOff = 0.000001f;
    public float baseValue = 0.5f;
}

[Serializable]
public class EditorBloomProcessing
{
    public bool bloomEnabled = false;
    public int bloomKernel = 64; // 64 by default
    public float bloomScale = 0.5f; // 0.5 by default
    public float bloomWeight = 0.15f; // 0.15 by default
    public float bloomThreshold = 0.9f; // 0.9 by default
}

[Serializable]
public class EditorChromaticAberration
{
    public bool aberrationEnabled = false;
    public int aberrationAmount = 30; // 30 by default
    public bool adaptScaleViewport = false; // false by default
    public int alphaMode = 0; // 0 by default
    public bool alwaysForcePOT = false; // false by default
    public bool pixelPerfectMode = false; // false by default
    public bool fullscreenViewport = true; // true by default
}

[Serializable]
public class EditorDepthOfField
{
    public bool depthOfField = false;
    public float blurLevel = 0; // 0 by default
    public float focalStop = 1.4f; // 1.4 by default
    public int focalLength = 50; // 50 by default, mm
    public int focusDistance = 2000; // 2000 by default, mm
    public int maxLensSize = 50; // 50 by default
}

[Serializable]
public class EditorAntiAliasing
{
    [Range(1, 8)] public int msaaSamples = 1; // 1 by default
    public bool fxaaEnabled = false; // false by default
    public bool fxaaScaling = false; // false by default
    [Range(1, 8)] public int fxaaSamples = 1; // 1 by default
}

[Serializable]
public class EditorGlowLayer
{
    public bool glowEnabled = false;
    [Range(0.0f, 10.0f)] public float glowIntensity = 1.0f; // 1 by default
    public int blurKernelSize = 16; // 16 by default
}

[Serializable]
public class EditorGrainEffect
{
    public bool grainEnabled = false;
    public bool grainAnimated = false; // false by default
    [Range(0.0f, 100.0f)] public float grainIntensity = 30.0f; // 30 by default
    public bool adaptScaleViewport = false; // false by default
}

[Serializable]
public class EditorSharpenEffect
{
    public bool sharpenEnabled = false;
    public float sharpEdgeAmount = 0.3f; // 0.3 by default
    public float sharpColorAmount = 1f; // 1 by default
    public bool adaptScaleViewport = false; // false by default
}

[Serializable]
public class EditorColorCurves
{
    public bool curvesEnabled = false;
    public float globalDen = 0; // 0 by default
    public float globalExp = 0; // 0 by default
    public float globalHue = 30; // 30 by default
    public float globalSat = 0; // 0 by default
    public float highlightsDen = 0; // 0 by default
    public float highlightsExp = 0; // 0 by default
    public float highlightsHue = 30; // 30 by default
    public float highlightsSat = 0; // 0 by default
    public float midtonesDen = 0; // 0 by default
    public float midtonesExp = 0; // 0 by default
    public float midtonesHue = 30; // 30 by default
    public float midtonesSat = 0; // 0 by default
    public float shadowsDen = 80; // 80 by default
    public float shadowsExp = 0; // 0 by default
    public float shadowsHue = 30; // 30 by default
    public float shadowsSat = 0; // 0 by default;
}

[Serializable]
public class EditorImageProcessing
{
    public bool imageProcessing = true;
    [Range(0.0f, 5.0f)] public float imageContrast = 1.0f;
    [Range(0.0f, 5.0f)] public float imageExposure = 1.0f;
    public bool toneMapping = false;
    public EditorToneMapping toneMapType = EditorToneMapping.Standard;
    public bool vignetteEnabled = false;
    public EditorVignetteBlending vignetteBlendMode = EditorVignetteBlending.Multiply;
    public float vignetteCameraFov = 0.5f;
    public float vignetteStretch = 0.0f;
    public float vignetteCentreX = 0.0f;
    public float vignetteCentreY = 0.0f;
    public float vignetteWeight = 1.5f;
    public Color vignetteColor = new Color(0,0,0,0);
    public bool useColorGrading = false;
    public Texture2D setGradingTexture = null;
    public EditorColorCurves imagingColorCurves = null;
}

[Serializable]
public class EditorTeleportationOptions
{
    public bool useTeleportation = true;
    public bool rotationsEnabled = true;
    public bool backwardsEnabled = true;    
    public float backwardsDistance = 1.0f;
    public float turningAxisAngle = 22.5f;
    public float parabolicRadius = 5.0f;
}

////////////////////////////////////////////////////////////////
// Multi Player
////////////////////////////////////////////////////////////////

[Serializable]
public class EditorMultiPlayer
{
    public EditorMultiPlayerView playerStartupMode = EditorMultiPlayerView.SinglePlayer;
    public bool stereoSideBySide = true;
}

[Serializable]
public enum EditorMultiPlayerView
{
    SinglePlayer = 1,
    DualPlayers = 2,
    ThreePlayers = 3,
    FourPlayers = 4
}

////////////////////////////////////////////////////////////////
// Virtual Reality
////////////////////////////////////////////////////////////////

[Serializable]
public class EditorVirtualReality
{
    public bool optionalFeatures = true;
    public bool useStablePlugins = true;
    public bool localStorageOption = false;
    public bool ignoreNativeCamera = false;
    public bool disableUserInterface = false;
    public bool disablePointerSelect = false;
    public int renderingGroupNum = 0;
    public string setFloorMeshesTags = "Navigation";
    public EditorWebXRReferenceType referenceSpaceType = EditorWebXRReferenceType.LocalFloor;
    public EditorWebXRInputOptions experienceInputOptions = null;
    public EditorTeleportationOptions defaultTeleportationSetup = null;
}

[Serializable]
public class EditorWebXRInputOptions
{
    /**
    * If set to true no model will be automatically loaded
    */
    public bool disableMeshLoad = false;

    /**
    * Do not send a request to the controller repository to load the profile.
    *
    * Instead, use the controllers available in babylon itself.
    */
    public bool disableRepository = false;

    /**
    * A custom URL for the controllers repository
    */
    public string customRepository = null;

    /**
    * If set, this profile will be used for all controllers loaded (for example "microsoft-mixed-reality")
    * If not found, the xr input profile data will be used.
    * Profiles are defined here - https://github.com/immersive-web/webxr-input-profiles/
    */
    public string forceInputProfile = null;

    /**
    * Should the controller model's components not move according to the user input
    */
    public bool disableModelAnim = false;

    /**
    * Optional options to pass to the controller. Will be overridden by the Input options where applicable
    */
    public EditorWebXRControllerOptions controllerOptions = null;
}

[Serializable]
public class EditorWebXRControllerOptions
{
    /**
    * Should the controller mesh be animated when a user interacts with it
    * The pressed buttons / thumbstick and touchpad animations will be disabled
    */
    public bool disableCtrlAnim = false;
    /**
    * Do not load the controller mesh, in case a different mesh needs to be loaded.
    */
    public bool disableCtrlMesh = false;
    /**
    * Force a specific controller type for this controller.
    * This can be used when creating your own profile or when testing different controllers
    */
    public string forceCtrlProfile = null;
}

[Serializable]
public enum EditorWebXRImmersiveMode
{
    VirtualReality = 0,
    AugmentedReality = 1
}

[Serializable]
public enum EditorWebXRReferenceType
{
    Viewer = 0,
    Local = 1,
    LocalFloor = 2,
    BoundedFloor = 3,
    Unbounded = 4
}
#endif
