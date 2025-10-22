namespace PROJECT {
    /**
    * Babylon Script Component
    * @class AssetExporter
    */
    export class AssetExporter extends TOOLKIT.ScriptComponent {
        // Example: private helloWorld:string = "Hello World";

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.AssetExporter") {
            super(transform, scene, properties, alias);
        }
        
        protected awake(): void {
            /* Init component function */
        }

        protected start(): void {
            /* Start component function */
        }

        protected fixed(): void {
            /* Fixed update loop function */
        }

        protected update(): void {
            /* Update render loop function */
        }

        protected late(): void {
            /* Late update render loop function */
        }

        protected after(): void {
            /* After update render loop function */
        }

        protected ready(): void {
            /* Execute when ready function */
        }

        protected destroy(): void {
            /* Destroy component function */
        }
    }

    TOOLKIT.SceneManager.RegisterClass("PROJECT.AssetExporter", AssetExporter);
}