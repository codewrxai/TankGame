using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[Babylon(Class="PROJECT.AutoDestruction"), AddComponentMenu("Scripts/My Project/AutoDestruction")]
public class AutoDestruction : EditorScriptComponent
{
    public float timeToDie = 15f; //How many seconds this object will survive

    void Start()
    {
        Destroy(gameObject, timeToDie);
    }
}
