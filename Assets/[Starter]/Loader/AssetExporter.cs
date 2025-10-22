#if UNITY_EDITOR
using System;
using UnityEditor;
using UnityEngine;

/**
* Editor Script Component
* @class AssetExporter
*/
[Babylon(Class="PROJECT.AssetExporter"), AddComponentMenu(CanvasToolsStatics.CANVAS_TOOLS_MENU + "/Content Components/Loader/Asset Exporter", 1001)]
public class AssetExporter : EditorScriptComponent
{
    public TextAsset[] textAssets = null;
    public Font[] fontAssets = null;
    public Sprite[] spriteAssets = null;
    public Texture2D[] imageAssets = null;
    public AudioClip[] audioAssets = null;
    public UnityEngine.Video.VideoClip[] videoAssets = null;
    public DefaultAsset[] defaultAssets = null;
}

#endif
