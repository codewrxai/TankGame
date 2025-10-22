namespace PROJECT {
    /**
    * Babylon Script Component
    * @class SoundManager
    */
    export class SoundManager extends TOOLKIT.ScriptComponent {
        private groupName: string = null;
        private cachedVolume: boolean = false;
        private volumeProperty: string = "volume";
        public getGroupName(): string { return this.groupName; }

        protected m_soundMap: Map<string, TOOLKIT.AudioSource> = null;
        protected m_soundList: TOOLKIT.AudioSource[] = null;

        constructor(transform: BABYLON.TransformNode, scene: BABYLON.Scene, properties: any = {}, alias: string = "PROJECT.SoundManager") {
            super(transform, scene, properties, alias);
        }
        
        protected awake(): void {
            this.groupName = this.getProperty("groupName", this.transform.name); // Note: Default Transform Group Name
            this.cachedVolume = this.getProperty("cachedVolume", this.cachedVolume);
            this.volumeProperty = this.getProperty("volumeProperty", this.volumeProperty);
            this.m_soundMap = new Map<string, TOOLKIT.AudioSource>()
            this.m_soundList = [];
        }

        protected start(): void {
            const audioTransforms: BABYLON.TransformNode[] = this.transform.getChildren(null, true) as BABYLON.TransformNode[];
            if (audioTransforms != null && audioTransforms.length > 0) {
                for (let index = 0; index < audioTransforms.length; index++) {
                    const audioTrackNode: BABYLON.TransformNode = audioTransforms[index];
                    const audioSource: TOOLKIT.AudioSource = TOOLKIT.SceneManager.FindScriptComponent(audioTrackNode, "TOOLKIT.AudioSource");
                    if (audioSource != null) {
                        if (this.cachedVolume === true) {
                            const volume: string = window.localStorage.getItem(this.volumeProperty); // Note: Local Window Storage Property
                            if (volume != null && volume !== "") {
                                const volumeLevel: number = parseFloat(volume);
                                if (volumeLevel != null) {
                                    audioSource.setVolume(volumeLevel);
                                }
                            }
                        }
                        this.m_soundMap.set(audioTrackNode.name, audioSource);
                        this.m_soundList.push(audioSource);
                    }
                }
            }
        }

        protected update(): void { /* TODO - Check Sound Track Ready State */ }

        protected destroy(): void {
            this.m_soundList = null;
            this.m_soundMap.clear();
            this.m_soundMap = null;
        }

        ///////////////////////////////////////////////////
        // Public Sound Manager Helpers
        //////////////////////////////////////////////////

        /**
         * Is the sound track currently playing
         * @param name The name of the sound track to check is playing
         */
        public isPlaying(name: string): boolean {
            const audioSource: TOOLKIT.AudioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.isPlaying() : false;
        }
        /**
         * Is the sound track currently paused
         * @param name The name of the sound track to check is paused
         */
        public isPaused(name: string): boolean {
            const audioSource: TOOLKIT.AudioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.isPaused() : false;
        }
        /**
         * Play the sound track by name
         * @param name The name of the sound track to play
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         * @param offset (optional) Start the sound at a specific time in seconds
         * @param length (optional) Sound duration (in seconds)
         */
        public async playTrack(name: string, time?: number, offset?: number, length?: number): Promise<boolean> {
            const audioSource: TOOLKIT.AudioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.play(time, offset, length) : false;
        }
        /**
         * Pause the sound track by name
         * @param name The name of the sound track to play
         */
        public pauseTrack(name: string): boolean {
            const audioSource: TOOLKIT.AudioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.pause() : false;
        }
        /**
         * Pause the sound for all tracks in the group
         */
        public pauseAllTracks(): void {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].pause();
                    }
                }
            }
        }
        /**
         * Stop the sound track by name
         * @param name The name of the sound track to play
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        public stopTrack(name: string, time?: number): boolean {
            const audioSource: TOOLKIT.AudioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.stop(time) : false;
        }
        /**
         * Stop the sound for all tracks in the group
         * @param time (optional) Stop the sound after X seconds. Stop immediately (0) by default.
         */
        public stopAllTracks(time?: number): void {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].stop(time);
                    }
                }
            }
        }
        /**
         * Mute the sound track by name
         * @param name The name of the sound track to play
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        public muteTrack(name: string, time?: number): boolean {
            const audioSource: TOOLKIT.AudioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.mute(time) : false;
        }
        /**
         * Unmute the sound track by name
         * @param name The name of the sound track to play
         * @param time (optional) Start the sound after X seconds. Start immediately (0) by default.
         */
        public unmuteTrack(name: string, time?: number): boolean {
            const audioSource: TOOLKIT.AudioSource = this.getAudioSource(name);
            return (audioSource != null) ? audioSource.unmute(time) : false;
        }
        /**
         * Mutes the volume for all sound tracks in the group
         * @param time Define time for gradual change to new volume
         */
        public muteAllTracks(time?: number): void {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].mute(time);
                    }
                }
            }
        }
        /**
         * Unmutes the volume for all sound tracks in the group
         * @param time Define time for gradual change to new volume
         */
        public unmuteAllTracks(time?: number): void {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].unmute(time);
                    }
                }
            }
        }
        /**
         * Sets the volume for all sound tracks in the group
         * @param volume Define the new volume of the sound
         * @param time Define time for gradual change to new volume
         */
        public setGroupVolume(volume: number, time?: number): void {
            if (this.m_soundList != null && this.m_soundList.length > 0) {
                for (let index = 0; index < this.m_soundList.length; index++) {
                    if (this.m_soundList[index] != null) {
                        this.m_soundList[index].setVolume(volume, time);
                    }
                }
            }
        }
        /**
         * Get a sound source by name
         * @param name The name of the sound track to play
         */
        public getAudioSource(name: string): TOOLKIT.AudioSource {
            return this.m_soundMap.get(name);
        }
    }

    TOOLKIT.SceneManager.RegisterClass("PROJECT.SoundManager", SoundManager);
}