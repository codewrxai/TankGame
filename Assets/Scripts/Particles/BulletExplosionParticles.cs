#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEngine;

/**
 * Editor Script Component
 * @class BulletExplosionParticles
 */
[Babylon(Class="PROJECT.BulletExplosionParticles"), AddComponentMenu("Scripts/My Project/BulletExplosionParticles")]
public class BulletExplosionParticles : EditorScriptComponent
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
[CustomEditor(typeof(BulletExplosionParticles)), CanEditMultipleObjects]
public class BulletExplosionParticlesEditor : Editor
{
    public void OnEnable()
    {
        BulletExplosionParticles owner = (BulletExplosionParticles)target;
    }
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();
    }
}
#endif