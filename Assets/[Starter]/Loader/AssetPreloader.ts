namespace PROJECT {
    /**
    * Babylon Script Component
    * @class AssetPreloader
    */
    export class AssetPreloader extends TOOLKIT.ScriptComponent implements TOOLKIT.IAssetPreloader {
        private parentMeshes: boolean = false;
        private importMeshes: string[] = null;
        private assetContainers: string[] = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.AssetPreloader") {
            super(transform, scene, properties, alias);
        }

        protected destroy(): void {
            this.importMeshes = null;
            this.assetContainers = null;
        }

        /** Add asset preloader tasks (https://doc.babylonjs.com/divingDeeper/importers/assetManager) */
        public addPreloaderTasks(assetsManager: TOOLKIT.PreloadAssetsManager): void {
            const sceneRootUrl: string = TOOLKIT.SceneManager.GetRootUrl(this.scene);
            let rooturl: string = sceneRootUrl;
            let filename: string = "";
            if (this.importMeshes != null) {
                this.importMeshes.forEach((imporUrl: string, importIndex: number) => {
                    rooturl = sceneRootUrl;
                    filename = imporUrl;
                    if (imporUrl.indexOf("://") >= 0) {
                        rooturl = imporUrl.substring(0, imporUrl.lastIndexOf('/')) + "/";
                        filename = imporUrl.substring(imporUrl.lastIndexOf('/') + 1);
                    }
                    const importTask: BABYLON.MeshAssetTask = assetsManager.addMeshTask((this.transform.name + ".MeshTask." + importIndex.toString()), null, rooturl, filename);
                    importTask.onSuccess = (task: BABYLON.MeshAssetTask) => {
                        if (task.loadedMeshes != null) {
                            if (this.parentMeshes === true) task.loadedMeshes[0].parent = this.transform;
                            const meshTaskKey: string = task.sceneFilename.toString().toLowerCase();
                            TOOLKIT.SceneManager.RegisterImportMeshes(this.scene, meshTaskKey, task.loadedMeshes);
                            //console.log("Preloaded mesh: " + meshTaskKey);
                        }
                    };
                    importTask.onError = (task: BABYLON.MeshAssetTask, message?: string, exception?: any) => { console.error(message, exception); };
                });
            }
            if (this.assetContainers != null) {
                this.assetContainers.forEach((assetUrl: string, assetIndex: number) => {
                    let rooturl: string = sceneRootUrl;
                    let filename: string = assetUrl;
                    if (assetUrl.indexOf("://") >= 0) {
                        rooturl = assetUrl.substring(0, assetUrl.lastIndexOf('/')) + "/";
                        filename = assetUrl.substring(assetUrl.lastIndexOf('/') + 1);
                    }
                    const assetTask: BABYLON.ContainerAssetTask = assetsManager.addContainerTask((this.transform.name + ".ContainerTask." + assetIndex.toString()), null, rooturl, filename);
                    assetTask.onSuccess = (task: BABYLON.ContainerAssetTask) => {
                        if (task.loadedContainer != null) {
                            const assetTaskKey: string = task.sceneFilename.toString().toLowerCase();
                            TOOLKIT.SceneManager.RegisterAssetContainer(this.scene, assetTaskKey, task.loadedContainer);
                            //console.log("Preloaded asset: " + assetTaskKey);
                        }
                    };
                    assetTask.onError = (task: BABYLON.ContainerAssetTask, message?: string, exception?: any) => { console.error(message, exception); };
                });
            }
        }
    }

    TOOLKIT.SceneManager.RegisterClass("PROJECT.AssetPreloader", AssetPreloader);
}