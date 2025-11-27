#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEngine;

/**
 * Editor Script Component
 * @class PlayerParticle
 */
[Babylon(Class="PROJECT.PlayerParticle"), AddComponentMenu("Scripts/My Project/PlayerParticle")]
public class PlayerParticle : EditorScriptComponent
{
    /** Add Editor Properties To Script Component */
    // Example: [Tooltip("Example hello world property")]
    // Example: [Auto] public string helloWorld = "Hello World";

    /** Add Editor Proxy Events To Script Component */
    // Example: public void onButtonClicked() {}

	/** [Serializable, HideInInspector] public string exportProperty = null; */
    public override void OnUpdateProperties(Transform transform, SceneExporterTool exporter)
    {
        // Example: this.helloWorld = "Update Hello World";
    }
}

/**
 * Optional Script Component Custom Editor Class
 */
[CustomEditor(typeof(PlayerParticle)), CanEditMultipleObjects]
public class PlayerParticleEditor : Editor
{
    public void OnEnable()
    {
        PlayerParticle owner = (PlayerParticle)target;
    }
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();
    }
}
#endif