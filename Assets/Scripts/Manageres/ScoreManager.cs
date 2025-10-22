using UnityEngine;
using UnityEngine.UI;

[Babylon(Class="PROJECT.ScoreManager"), AddComponentMenu("Scripts/My Project/ScoreManager")]
public class ScoreManager : EditorScriptComponent
{
    public static int score;        // The player's score.

    Text text;                      // Reference to the Text component.

    void Awake()
    {
        // Set up the reference.
        text = GetComponent<Text>();

        // Reset the score.
        score = 0;
    }

    // Update is called once per frame
    void Update()
    {
        // Set the displayed text to be the word "Score" followed by the score value.
        text.text = "Score: " + score;
    }
}
