using System;
using UnityEditor;
using UnityEngine;

/**
* Editor Script Component
* @class SoundManager
*/
[Babylon(Class="PROJECT.SoundManager", ScriptOrder=-5), AddComponentMenu(CanvasToolsStatics.CANVAS_TOOLS_MENU + "/Content Components/Sound/Sound Manager Control", 1010)]
public class SoundManager : EditorScriptComponent
{
    public string groupName = null;

    public bool cachedVolume = false;

    public string volumeProperty = "volume";
}
