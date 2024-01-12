
import { Detection } from "./db";

export type mapMarker = {
    det: Detection;
    preview: React.Dispatch<React.SetStateAction<string>>
}