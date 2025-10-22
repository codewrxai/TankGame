#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEngine;

/**
 * Editor Script Component
 * @class TestController
 */
[Babylon(Class="PROJECT.TestController"), AddComponentMenu("Scripts/My Project/TestController")]
public class TestController : EditorScriptComponent
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
[CustomEditor(typeof(TestController)), CanEditMultipleObjects]
public class TestControllerEditor : Editor
{
    public void OnEnable()
    {
        TestController owner = (TestController)target;
    }
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();
    }
}
#endif