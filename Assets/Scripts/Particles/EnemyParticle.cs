#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEngine;

/**
 * Editor Script Component
 * @class EnemyParticle
 */
[Babylon(Class="PROJECT.EnemyParticle"), AddComponentMenu("Scripts/My Project/EnemyParticle")]
public class EnemyParticle : EditorScriptComponent
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
[CustomEditor(typeof(EnemyParticle)), CanEditMultipleObjects]
public class EnemyParticleEditor : Editor
{
    public void OnEnable()
    {
        EnemyParticle owner = (EnemyParticle)target;
    }
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();
    }
}
#endif