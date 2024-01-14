
import { Detection } from "./db";

export type mapMarker = {
    det: Detection;
    preview: (blobName: string) => Promise<void>;
}