
// {
//     "confidence": 0.888167679309845,
//     "detection_type": "validated_definite",
//     "id": 8826,
//     "chipped_sat": "sbdswhales/23APR13152142-S2AS_R1C1-015696339010_05_P001/chip/window_663/23APR13152142-S2AS_R1C1-015696339010_05_P001_window_663.tif",
//     "centroid": "POINT (-70.19307599999999 41.936773)",
//     "scene_name": "23APR13152142-S2AS_R1C1-015696339010_05_P001",
//     "blob_name": "sbdswhales/23APR13152142-S2AS_R1C1-015696339010_05_P001/chip/window_663/23APR13152142-S2AS_R1C1-015696339010_05_P001_window_663.png"
// }

export type Detection = {
    confidence: number;
    detection_type: string;
    id: number;
    chipped_sat: string;
    centroid: number[];
    scene_name: string;
    blob_name: string;
};

