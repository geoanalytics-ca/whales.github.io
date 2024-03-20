import React, { useState } from 'react';
import { 
    Modal,
    ModalHeader,
    ModalContent,
    ModalFooter,
    Button
 } from "@nextui-org/react";
import Image from 'next/image';
import { FaMap, FaInfo } from "react-icons/fa";
import { GiWhaleTail } from "react-icons/gi";
import styled from 'styled-components';

import collectionSelected from "@imgs/collection-selected.png";
import collectionSelect from "@imgs/collection-select.png";
import assetList from "@imgs/asset-list.png";
import assetSelect from "@imgs/asset-select.png";
import dateSelect from "@imgs/date-select.png";
import exampleOutput from "@imgs/example-output.png";
import foundItems from "@imgs/found-items.png";
import searchButton from "@imgs/search-button.png";
import startDateSelect from "@imgs/start-date-select.png";

const GuideContainer = styled.div`
    margin: 20px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f9f9f9;
    `;

const GuideTitle = styled.h2`
    color: #333;
    margin-bottom: 10px;
    `;

const GuideSectionTitle = styled.h3`
    color: #666;
    margin: 10px 0;
    `;

const GuideText = styled.p`
    color: #333;
    line-height: 1.6;
    `;

const UserGuideModal: React.FC = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div>
            <Button className="h-7" onClick={openModal}>
                <FaInfo size={20} />
                User Guide
            </Button>
            <Modal
                className="z-2 w-2/3 h-4/5 overflow-y-auto" 
                size={"3xl"}
                isOpen={modalIsOpen}
                onClose={closeModal}
            >
                <ModalHeader>User Guide <GiWhaleTail alt='' /></ModalHeader>
                <button onClick={closeModal}>close</button>
                <ModalContent className='' style={{ color: "black" }}>
                    <GuideContainer>
                        <GuideTitle>Introduction</GuideTitle>
                        <GuideText>
                            The Data Map is an innovative web-based platform that
                            empowers users to explore, query, and visualize remote
                            sensing data from a diverse range of sources in a user-friendly environment.
                            This guide will walk you through the key features of the application, 
                            providing detailed instructions on how to effectively query data, 
                            interpret results, and utilize the visualization tools available.
                        </GuideText>
                        <GuideText className="flex justify-center w-100">
                            <Image src={exampleOutput} alt="Example Output" />
                        </GuideText>
                    </GuideContainer>
                    <GuideContainer>
                        <GuideSectionTitle>Query</GuideSectionTitle>
                        <GuideText>
                            The Query section offers a versatile interface for querying
                            remote sensing data. It allows users to specify various parameters for precise results. 
                            This section will guide you through the process of setting up your query, 
                            including selecting data sources, defining temporal constraints, 
                            and choosing the appropriate data layers for visualization.
                        </GuideText>
                        <GuideContainer>
                            <GuideSectionTitle>Selecting Start and End Dates</GuideSectionTitle>
                            <GuideText>
                                The Start and End Date feature allows you to query Assets within a specific 
                                time frame. This is particularly useful when you are interested in data from a certain period.
                            </GuideText>
                            <GuideText className="flex justify-center w-100">
                                <Image src={dateSelect} alt="Date Select" />
                            </GuideText>
                            <GuideText>
                                To define your time frame, click on the date field to open the date picker. 
                                You can easily navigate through different months and years. 
                                Once you find the desired date, click on it to select. 
                                The selected date will then be displayed in the date field.
                            </GuideText>
                            <GuideText className="flex justify-center w-100">
                                <Image className="w-1/3" src={startDateSelect} alt="Start Date Select" />
                            </GuideText>
                        </GuideContainer>
                        <GuideContainer>
                            <GuideSectionTitle>Choosing a Collection</GuideSectionTitle>
                            <GuideText>
                                Choose the STAC Collection that you wish to query. 
                                This selection will determine the data sources available for your query.
                            </GuideText>
                            <GuideText className="flex justify-center w-100">
                                <Image src={collectionSelect} alt="Collection Selection Interface" />
                            </GuideText>
                            <GuideText>
                                The image above illustrates the collection selection interface. 
                                Once you have made your selection, it will be highlighted as shown below.
                            </GuideText>
                            <GuideText className="flex justify-center w-100">
                                <Image src={collectionSelected} alt="Selected Collection Highlighted" />
                            </GuideText>
                        </GuideContainer>
                        <GuideContainer>
                            <GuideSectionTitle>Executing a Search</GuideSectionTitle>
                            <GuideText>
                                To initiate a query of the remote data, simply click on the Search button.
                            </GuideText>
                            <GuideText className="flex justify-center w-100">
                                <Image src={searchButton} alt="Illustration of Search Button" />
                            </GuideText>
                        </GuideContainer>
                        <GuideContainer>
                            <GuideSectionTitle>Search Results</GuideSectionTitle>
                            <GuideText>
                                Upon completion of a query, a list of STAC
                                Items will be generated for your selection.
                            </GuideText>
                            <GuideText className="flex justify-center w-100">
                                <Image src={foundItems} alt="Displayed Items" />
                            </GuideText>
                        </GuideContainer>
                        <GuideContainer>
                            <GuideSectionTitle>Viewing Asset Results</GuideSectionTitle>
                            <GuideText>
                                After selecting an Item, the associated Assets
                                will be displayed for your further selection.
                            </GuideText>
                            <GuideText className="flex justify-center w-100">
                                <Image src={assetList} alt="List of Assets" />
                            </GuideText>
                        </GuideContainer>
                        <GuideContainer>
                            <GuideSectionTitle>Visualising Assets</GuideSectionTitle>
                            <GuideText>
                                Once an Item is selected, its associated Assets
                                will be displayed and ready for 
                                visualisation.
                                {/* <GuideText>
                                    <span style={{display: "inline-flex", alignItems: "center"}}>
                                        <FaImage alt='' /> : This icon indicates an option to generate a pop-up model of the Asset preview plot.
                                    </span>
                                </GuideText> */}
                                <GuideText>
                                    <span style={{display: "inline-flex", alignItems: "center"}}>
                                        <FaMap alt='' /> : Click this icon to project the remote data onto the map.
                                    </span>
                                </GuideText>
                            </GuideText>
                            <GuideText className="flex justify-center w-100">
                                <Image src={assetSelect} alt="Asset Selection Interface" />
                            </GuideText>
                        </GuideContainer>
                    </GuideContainer>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default UserGuideModal;