export interface ConnectionInfo {
    url: string
    password?: string
}

export interface OBSSource {
    sceneName: string
    sourceName: string
    sceneItemId: number
    enabled: boolean|null
}