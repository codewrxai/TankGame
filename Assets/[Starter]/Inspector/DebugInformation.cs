#if UNITY_EDITOR
using System;
using UnityEngine;
using UnityEditor;

/**
* Editor Script Class
* @class DebugInformation
*/
[Babylon(Class="PROJECT.DebugInformation"), AddComponentMenu(CanvasToolsStatics.CANVAS_TOOLS_MENU + "/Content Components/Debug/Debug Panel Information", 9999)]
public class DebugInformation : EditorScriptComponent
{
	[ReadOnly] public bool inspectorKeyIsI = true;
	public bool enableDebugKeys = true;
	public bool showDebugLabels = true;
	public bool popupDebugPanel = false;
	public bool togglePlayerViews = false;
	public bool allowXboxLiveSignIn = false;
	public Color debugOutputTextColor = Color.green;	
}

#endif
