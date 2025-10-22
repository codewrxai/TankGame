#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEngine;

/**
* Editor Script Component
* @class AssetPreloader
*/
[Babylon(Class="PROJECT.AssetPreloader"), AddComponentMenu(CanvasToolsStatics.CANVAS_TOOLS_MENU + "/Content Components/Loader/Asset Preloader", 1001)]
public class AssetPreloader : EditorScriptComponent
{
    [Auto] public bool parentMeshes = false;
    [Auto] public string[] importMeshes = null;
    [Auto] public string[] assetContainers = null;
}

#endif
