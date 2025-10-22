using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using UnityEngine.Audio;
#if UNITY_EDITOR
using UnityEditor;
#endif


[Babylon(Class="PROJECT.PauseManager"), AddComponentMenu("Scripts/My Project/PauseManager")]
public class PauseManager : EditorScriptComponent
{
    //public AudioMixerSnapshot paused;
    //public AudioMixerSnapshot unpaused;

    Canvas canvas;

    void Start()
    {
        canvas = GetComponent<Canvas>();
    }

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            canvas.enabled = !canvas.enabled;
            Pause();
        }
    }

    public void Pause()
    {
        Time.timeScale = Time.timeScale == 0f ? 1f : 0f;
        Lowpass();

    }

    void Lowpass()
    {
        //if (Time.timeScale == 0)
        //{
        //    paused.TransitionTo(.01f);
        //}

        //else

        //{
        //    unpaused.TransitionTo(.01f);
        //}
    }

    public void Quit()
    {
#if UNITY_EDITOR
        EditorApplication.isPlaying = false;
#else
		Application.Quit();
#endif
    }
}
