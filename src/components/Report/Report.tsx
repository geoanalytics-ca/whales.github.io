import React from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalContent,
    ModalFooter,
    Button,
    useDisclosure,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    DropdownTrigger
} from "@nextui-org/react";
import { IoDocumentsOutline } from "react-icons/io5";

const originUrl: string = 'https://acri.blob.core.windows.net/acri'
const blobPrefix: string = 'reports'
const pdfList = [
    { key: 'Final Report', label: 'FinalReport_Modelisation_SIMBA_MS6_TJ.pdf'},
    { key: 'Chla ATBD', label: 'SIMBA_Chla_ATBD_V2.3.2_Signed.pdf'},
    { key: 'OCR Report', label: 'SIMBA_OCR_Report_V2.1.1_Signed.pdf'},
    { key: 'Phenology ATBD', label: 'SIMBA_Phenology_ATBD_V2.1.1_Signed.pdf'}
]

export interface ReportProps {
    // TODO
    };

const Report: React.FC<ReportProps> = () => {

    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [fileURL, setFileURL] = React.useState('');


    const handlePdf = (pdf: string) => {
        getReport(pdf);
        onOpen();
    }

    const getReport = (pdf: string) => {
        const url = `${originUrl}/${blobPrefix}/${pdf}`;
            console.log(url);
            setFileURL(url);
            //Open the URL on new Window
            // window.open(url);
    };

    const DropdownItems: React.FC = () => {
        return (
            <Dropdown className='fill-black'>
                <DropdownTrigger>
                    <Button className="h-7 z-2 bg-buttonbg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6">
                            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                        </svg>
                        Reports
                    </Button>
                </DropdownTrigger>
                <DropdownMenu items={pdfList} >
                    {(item) => (
                        <DropdownItem
                            key={item.key}
                            className='bg-buttonbg text-black hover:bg-slate'
                            onClick={() => handlePdf(item.label)}
                        >
                        {item.key}
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        )
    };

    return (
        <div>
            <DropdownItems />
            <Modal className="z-2 h-screen" size={'5xl'} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Preview</ModalHeader>
                    <ModalBody >
                        { (fileURL !== '' && 
                            <iframe 
                                src={fileURL}
                                style={{width: '100%', height: '100%'}}
                            >
                                This browser does not support PDFs. Please download the PDF to view it.
                            </iframe>
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Report;