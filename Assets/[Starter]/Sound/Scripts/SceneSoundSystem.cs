using System;
using UnityEditor;
using UnityEngine;

/**
* Editor Script Component
* @class SceneSoundSystem
*/
[Babylon(Class="PROJECT.SceneSoundSystem"), AddComponentMenu(CanvasToolsStatics.CANVAS_TOOLS_MENU + "/Content Components/Sound/Scene Sound System", 1005)]
public class SceneSoundSystem : EditorScriptComponent
{
    public string defaultMusicTrack = null;    
}
