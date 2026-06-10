// ScFile
export interface ScFile {
    id: number;
    hash?: string;
    minioFileName?: string;
    originFileName?: string;
    fileKey?: number;
    filePath?: string;
    fileUri?: string;
    mime?: string;
    fileType?: string;
    isImage?: 0 | 1;
    model?: string;
    longitude?: number;
    latitude?: number;
    size?: number;
    fileUrl: string;
    dateTimeOriginal?: string;
    uploadTime?: string;
    source: string;
    creatorID?: number;
    creatorName?: string;
    dr: 0 | 1;
    ts?: string;
}
