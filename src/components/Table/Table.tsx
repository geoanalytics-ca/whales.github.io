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
    { setMapCenter, setMapZoom, setMapMarkers } : 
    { setMapCenter:  React.Dispatch<React.SetStateAction<number[]>>, setMapZoom: React.Dispatch<React.SetStateAction<number>>, setMapMarkers: React.Dispatch<React.SetStateAction<mapMarker[]>> }
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
    const [startDate, setStartDate] = useState('2023-04-01');
    const [endDate, setEndDate] = useState('2023-09-30');

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

    const queryForBlobSAS = async (blobName: string) => {
        try {
            await getBlobSAS({ blobName, setDetectionImage });
        } catch (error) {
            console.error('Error fetching preview:', error);
        }
    };

    useEffect(() => {
        const markers: mapMarker[] = [];
        detections.forEach((detection) => {
            const marker: mapMarker = {
                det: detection,
                preview: queryForBlobSAS
            };
            markers.push(marker);
        });
        setMapMarkers(markers);
    }, [detections]);

    const handleRowClick = async (
        detection: Detection
    ) => {
        console.log('Row clicked:', detection);
        setMapCenter([detection.centroid[1], detection.centroid[0]]);
        setMapZoom(12);
        try {
            await getBlobSAS({ blobName: detection.blob_name, setDetectionImage });
        } catch (error) {
            console.error('Error fetching preview:', error);
        }
    };

    return (
        <Card className="stream1-pane">
            <CardBody>
                <div className="height:35%">
                    <Card className='width:100%'>
                        <div className="flex w-full">
                            <Card className='flex-1 space-x-1'>
                                <CardBody>
                                    <label htmlFor="startDateTime">Start Date: </label>
                                    <input type="date" id="startDateTime" value={startDate} onChange={handleStartDateChange} />
                                </CardBody>
                            </Card>
                            <Card className='flex-1 space-x-1'>
                                <CardBody>
                                    <label htmlFor="endDateTime">End Date: </label>
                                    <input type="date" id="endDateTime" value={endDate} onChange={handleEndDateChange} />
                                </CardBody>
                            </Card>
                        </div>
                        <Card className='w-full'>
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
                        </Card>
                        <Card className='w-full'>
                            <CardBody>
                                <Button onClick={fetchDetections}>Fetch Detections</Button>
                            </CardBody>
                        </Card>
                    </Card>
                </div>
                <div className="height:65%">
                    <Card className=' w-full'>
                        <div className='flex'>
                            <Card className='flex-1'>
                                <CardBody>
                                <>
                                { (detections.length > 0 && startDate < endDate) ? (
                                    Array.isArray(detections) && (
                                        <Table 
                                                aria-label="Example static collection table"
                                                color={"default"}
                                                isHeaderSticky={true}
                                                selectionMode="single" 
                                                defaultSelectedKeys={[""]} 
                                                classNames={{
                                                    base: "max-h-[400px] overflow-scroll",
                                                    table: "min-h-[320px]",
                                                  }}
                                                // onRowAction={handleRowClick}
                                            >
                                            <TableHeader>
                                                <TableColumn>ID</TableColumn>
                                                {/* <TableColumn>Scene Name</TableColumn> */}
                                                {/* <TableColumn>Detection Type</TableColumn> */}
                                                <TableColumn>Confidence</TableColumn>
                                                <TableColumn>Loc.</TableColumn>
                                                {/* <TableColumn>Image</TableColumn> */}
                                            </TableHeader>
                                            <TableBody>
                                                {
                                                    detections.map((detection, _) => (
                                                        <TableRow key={detection.id} 
                                                                textValue={detection.chipped_sat} 
                                                                onClick={() => handleRowClick(detection)}
                                                            > 
                                                            <TableCell>{detection.id}</TableCell>
                                                            {/* <TableCell>{detection.scene_name}</TableCell> */}
                                                            {/* <TableCell>{detection.detection_type}</TableCell> */}
                                                            <TableCell>{detection.confidence.toFixed(4)}</TableCell>
                                                            <TableCell>{detection.centroid[1].toFixed(4)}, {detection.centroid[0].toFixed(4)}</TableCell>
                                                            {/* <TableCell>{detection.chipped_sat}</TableCell> */}
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        </Table>
                                    )
                                ) : (
                                    <Table aria-label="Empty static collection table">
                                    <TableHeader>
                                        <TableColumn>...</TableColumn>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell><GiWhaleTail /></TableCell>
                                        </TableRow>
                                    </TableBody>
                                    </Table>
                                )}  
                                </>
                            </CardBody>
                        </Card>
                        <Card className='flex-1'>
                            <CardBody>
                                {detectionImage && (
                                    <Image className="brightness-150 height-30" src={detectionImage} />
                                )}
                                {!detectionImage && <GiWhaleTail />}
                            </CardBody>
                        </Card>
                    </div>
                </Card>
            </div>
        </CardBody>
    </Card>
    );
};

export default WhaleTable;