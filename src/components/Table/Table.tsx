import React, { useState, useEffect } from "react";
// import SBDSClient from "@services/sbds";
import { 
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Spinner,
    Card,
    CardBody,
    Image,
    Button
} from "@nextui-org/react";

import { GiWhaleTail } from "react-icons/gi";

import { mapMarker } from "../../types/map";
import { Detection } from "../../types/db";
import {
    getDetections,
    getBlobSAS
} from "@services/sbds";

const WhaleTable = (
    { setMapCenter, setMapMarkers } : 
    { setMapCenter:  React.Dispatch<React.SetStateAction<number[]>>, setMapMarkers: React.Dispatch<React.SetStateAction<mapMarker[]>> }
    ) => {

    // const sbdsClient = new SBDSClient(process.env.API_URL as string);

     var DetectionTypes = {
        "validated_definite": "validated_definite",
        "validated_all": "validated_all",
        "missed": "missed",
        "misclassified": "misclassified",
        "model": "model"
    }

    // Track the state of the query parameters
    const [startDate, setStartDate] = useState('2022-01-01');
    const [endDate, setEndDate] = useState('2022-12-31');

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value > endDate) {
            setEndDate(event.target.value);
        }
        setStartDate(event.target.value);
    };
    
    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value < startDate) {
            setStartDate(event.target.value);
        }
        setEndDate(event.target.value);
    };

    const [detections, setDetections] = useState<Detection[]>([]);
    const [detectionType, setDetectionType] = useState<string>(DetectionTypes['validated_definite']);

    const [previewImage, setPreviewImage] = useState<string>("");
    const [detectionImage, setDetectionImage] = useState<string>("");

    const fetchDetections = async () => {
        try {
            console.log('Fetching detections...')
            const _detections = await getDetections(startDate, endDate, detectionType);
            const parsedDetections: Detection[] = JSON.parse(_detections);
            console.log('parsedDetections', parsedDetections);
            setDetections(parsedDetections);
        } catch (error) {
            console.error('Error fetching detections:', error);
            // throw error;
            setDetections([]);
        }
    };

    // useEffect(() => {
    //     const markers: mapMarker[] = [];
    //     detections.forEach((detection) => {
    //         const marker: mapMarker = {
    //             det: detection,
    //             preview: setPreviewImage
    //         };
    //         markers.push(marker);
    //     });
    //     setMapMarkers(markers);
    // }, [detections]);

    const updatePreview = async (
        detection: Detection
    ) => {
        setMapCenter([detection.centroid[0], detection.centroid[1]]);
        setDetectionImage(detection.chipped_sat);
        try {
            await getBlobSAS(detectionImage, setPreviewImage);
        } catch (error) {
            console.error('Error fetching preview:', error);
        }
    };

    return (
        <Card className="stream1-pane">
            <CardBody className='stream1-input'>
                <CardBody>
                    <label htmlFor="startDateTime">Start Date: </label>
                    <input type="date" id="startDateTime" value={startDate} onChange={handleStartDateChange} />
                    <br />
                    <label htmlFor="endDateTime">End Date: </label>
                    <input type="date" id="endDateTime" value={endDate} onChange={handleEndDateChange} />
                </CardBody>
                <CardBody>
                <>
                    <label htmlFor="detectionType">Detection Type:</label>
                    <select id="detectionType" defaultValue={detectionType} onChange={(e) => setDetectionType(e.target.value)} >
                        {Object.values(DetectionTypes).map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </>
                </CardBody>
                <CardBody>
                    <Button onClick={fetchDetections}>Fetch Detections</Button>
                </CardBody>
            </CardBody>
            <CardBody className='stream1-table'>
                <>
                { (detections.length > 0 && startDate < endDate) ? (
                    Array.isArray(detections) && (
                        <Table aria-label="Example static collection table">
                            <TableHeader>
                                <TableColumn>ID</TableColumn>
                                <TableColumn>Scene Name</TableColumn>
                                <TableColumn>Detection Type</TableColumn>
                                <TableColumn>Confidence</TableColumn>
                                <TableColumn>Loc.</TableColumn>
                                <TableColumn>Image</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {
                                    detections.map((detection, index) => (
                                        <TableRow key={index} textValue={detection.chipped_sat} onClick={() => updatePreview(detection)}> 
                                            <TableCell>{detection.id}</TableCell>
                                            <TableCell>{detection.scene_name}</TableCell>
                                            <TableCell>{detection.detection_type}</TableCell>
                                            <TableCell>{detection.confidence}</TableCell>
                                            <TableCell>{detection.centroid[0]}, {detection.centroid[1]}</TableCell>
                                            <TableCell>{detection.chipped_sat}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    )
                ) : (
                    <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Loading...</TableColumn>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell><Spinner /></TableCell>
                        </TableRow>
                    </TableBody>
                    </Table>
                )}  
                </>
            </CardBody>
            <CardBody className='stream1-preview'>
                <>
                {   
                    (detectionImage) ? (
                        <Card>
                            <CardBody>
                                <Image src={previewImage} />
                            </CardBody>
                        </Card>
                    ) : (
                        <GiWhaleTail />
                    )
                }
                </>
            </CardBody>
    </Card>
    );
};

export default WhaleTable;