import React, { useState, useEffect, MouseEvent, SetStateAction } from "react";
import SBDSClient from "@services/sbds";
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
    Modal,
    ModalHeader,
    ModalContent,
    ModalFooter,
    Button,
} from "@nextui-org/react";
import { LatLngExpression } from "leaflet";

// Python Table:
// class DetectedObject(Base):
//     __tablename__ = 'DetectedObject'

//     id = Column(Integer, primary_key=True)
//     chipped_sat = Column(String, ForeignKey('ChippedSatelliteImage.filename'))
//     confidence = Column(Float)
//     label = Column(String)
//     px = Column(Integer)
//     py = Column(Integer)
//     width = Column(Integer)
//     height = Column(Integer)
//     detection_type = Column(String)
//     detect_model_version = Column(String)
//     created_at = Column(DateTime)
//     geom = Column(Geometry('POLYGON', srid=4326))
//     centroid = Column(Geometry('POINT', srid=4326)) 

const sbdsClient = new SBDSClient(process.env.NEXT_PUBLIC_API_URL as string);

type Detection = {
    id: number;
    chipped_sat: string;
    confidence: number;
    label: string;
    px: number;
    py: number;
    width: number;
    height: number;
    detection_type: string;
    detect_model_version: string;
    created_at: string;
    geom: string;
    centroid: string;
    scene_name: string
};

type TableProps = {
    detections: Detection[];
};

// const imageCard = (image: string) => {
//     return (
//         <Card>
//             <CardBody>
//                 <img src={image} />
//             </CardBody>
//         </Card>
//     );
// }
                        

const WhaleTable = ({ setMapCenter }: { setMapCenter:  React.Dispatch<React.SetStateAction<number[]>> }) => {

     var DetectionTypes = {
        "validated_definite": "validated_definite",
        "validated_all": "validated_all",
        "missed": "missed",
        "misclassified": "misclassified",
        "model": "model"
     }

    const [detections, setDetections] = useState<Detection[]>([]);
    const [detectionType, setDetectionType] = useState<string>(DetectionTypes['validated_definite']);
    const [startDate, setStartDate] = useState<Date>(new Date('2021-01-01'));
    const [endDate, setEndDate] = useState<Date>(new Date('2021-01-31'));

    // const [imageURL, setImageURL] = useState<string>("");
    // const [isOpen, setIsOpen] = useState(false);


    console.log('Starting up Whale Table UI')
    console.log('startDate', startDate)
    console.log('endDate', endDate)
    console.log('detectionType', DetectionTypes['validated_definite'])
    console.log('detections', detections)


    // useEffect(() => {
    //     let fetchData;
    //     startDate && endDate && detectionType && (
    //         fetchData = async () => {
    //             await fetchDetections(startDate.toISOString(), endDate.toISOString(), detectionType);
    //         }
    //     )
    //     console.log('detections', detections)
    // } , [startDate, detectionType]); // Run once on component mount

    // const openModal = () => {
    //     setIsOpen(true);
    // }

    // const closeModel = () => {
    //     setIsOpen(false);
    // }

    // const openImageInModal = (e: MouseEvent<HTMLTableRowElement>) => {
    //     return (
    //         <>
    //         {isOpen && (
    //             <Modal>
    //                 <ModalHeader>Modal header</ModalHeader>
    //                 <ModalContent>
    //                     {imageURL && imageCard(imageURL)}
    //                 </ModalContent>
    //                 <Button onClick={closeModel}>Close</Button>
    //             </Modal>
    //         )}
    //         </>
    //     )
    // }

    useEffect(() => {
        const fetchDetections = async () => {
            try {
                const response = await sbdsClient.getDetections(startDate.toISOString(), endDate.toISOString(), detectionType);
                setDetections(response as Detection[]);
            } catch (error) {
                console.error('Error fetching detections:', error);
                // throw error;
                setDetections([]);
            } finally {
                
            }
        };
        fetchDetections();
    } , [startDate, endDate, detectionType]); // Run once on component mount

    return (
        <>
            <div className="stream1-pane">
                <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input type="date" id="startDate" onChange={(e) => setStartDate(new Date(e.target.value))} />
                </div>
                <div>
                    <label htmlFor="endDate">End Date:</label>
                    <input type="date" id="endDate" onChange={(e) => setEndDate(new Date(e.target.value))} />
                </div>
                <div>
                    <label htmlFor="detectionType">Detection Type:</label>
                    <select id="detectionType" defaultValue={detectionType} onChange={(e) => setDetectionType(e.target.value)} >
                        {Object.values(DetectionTypes).map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                { detections.length !== 0 ? (
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
                                        <TableRow key={index} textValue={detection.chipped_sat}> 
                                            <TableCell>{detection.id}</TableCell>
                                            <TableCell>{detection.scene_name}</TableCell>
                                            <TableCell>{detection.detection_type}</TableCell>
                                            <TableCell>{detection.confidence}</TableCell>
                                            <TableCell>{detection.px}, {detection.py}</TableCell>
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
                </div>
            </div>
        </>
    );
};

export default WhaleTable;