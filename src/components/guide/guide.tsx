import React, { useState } from 'react';
import { 
    Modal,
    ModalHeader,
    ModalContent,
    ModalFooter
 } from "@nextui-org/react";
import { FaInfo } from "react-icons/fa";
import styled from 'styled-components';

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
            <FaInfo size={20} onClick={openModal} />
            <Modal
                className="z-2 w-1/2 h-2/3 overflow-y-auto" 
                size={"3xl"}
                isOpen={modalIsOpen}
                onClose={closeModal}
            >
                <ModalHeader>User Guide</ModalHeader>
                <button onClick={closeModal}>close</button>
                <ModalContent className='' style={{ color: "black" }}>
                    <GuideContainer>
                        <GuideTitle>Introduction</GuideTitle>
                        <GuideText>
                            The Data Map is a web-based application that
                            allows users to query and visualise remote
                            sensing data from a variety of sources.
                        </GuideText>
                    </GuideContainer>
                    <GuideContainer>
                        <GuideSectionTitle>Query</GuideSectionTitle>
                        <GuideText>
                            The Query section provides a way to query
                            remote sensing data based on a number of
                            parameters. 
                        </GuideText>
                        <GuideContainer>
                            <GuideSectionTitle>Start/End Date</GuideSectionTitle>
                            <GuideText>
                                Start and End Date selection provides a
                                way to query Assets over a specific 
                                temporal range. 
                            </GuideText>
                        </GuideContainer>
                        <GuideContainer>
                            <GuideSectionTitle>Collections</GuideSectionTitle>
                            <GuideText>
                                Select the STAC Collection you want to
                                query from.
                            </GuideText>
                        </GuideContainer>
                        <GuideContainer>
                            <GuideSectionTitle>Item Results</GuideSectionTitle>
                            <GuideText>
                                Once a query has completed, a set of STAC
                                Items will be listed for you to select from.
                            </GuideText>
                        </GuideContainer>
                        <GuideContainer>
                            <GuideSectionTitle>Asset Visualisation</GuideSectionTitle>
                            <GuideText>
                                The Assets associated to the selected Item
                                will be listed and available for 
                                visualisation.
                                Clicking the <i className="fas fa-camera"></i> icon will 
                                create a pop-up model of the Asset preview plot.
                                The <i className="fas fa-map"></i> icon will visualise
                                the remote data onto the map.
                            </GuideText>
                        </GuideContainer>
                    </GuideContainer>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default UserGuideModal;