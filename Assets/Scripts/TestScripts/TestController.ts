namespace PROJECT {
    /**
     * Babylon Script Component
     * @class TestController
     */
    export class TestController extends TOOLKIT.ScriptComponent {
        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.TestController") {
            super(transform, scene, properties, alias);
        }

        protected awake(): void {
            
        }

        protected start(): void {
           
        }

        protected ready(): void {
            const container = SM.GetAssetContainer(this.scene, "testcube.glb"); 
            console.log("TestController: Loaded asset container:", container);
            const testObject = SM.InstantiatePrefabFromContainer(container, "TestCube", "TestCube_Clone");
            console.log("TestController: Instantiated TestCube:", testObject);

            const container1 = SM.GetAssetContainer(this.scene, "enemy.glb"); 
            console.log("TestController: Loaded asset container:", container1);
            const testObject1 = SM.InstantiatePrefabFromContainer(container1, "Enemy", "Enemy_Clone");
            console.log("TestController: Instantiated Enemy:", testObject1);
        }

        protected update(): void {
            /* Update render loop function */
        }

        protected late(): void {
            /* Late update render loop function */
        }

        protected step(): void {
            /* Before physics step function (remove empty function for performance) */
        }

        protected fixed(): void {
            /* After physics step function (remove empty function for performance) */
        }

        protected after(): void {
            /* After update render loop function */
        }

        protected reset(): void {
            /* Reset component function */
        }

        protected destroy(): void {
            /* Destroy component function */
        }
    }

    TOOLKIT.SceneManager.RegisterClass("PROJECT.TestController", TestController);
}