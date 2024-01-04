import { fetchCatalog, fetchCollection, fetchItems, fetchItem } from '@services/stac';
import React, { useState, useEffect } from 'react';
import { Catalog, Collection, Item, STACLink } from '@stac/StacObjects';
import { FaImage } from "react-icons/fa6";
import { 
    Card,
    CardBody,
    Spinner,
    Checkbox,
    Modal,
    ModalContent, 
    ModalHeader, 
    ModalBody, 
    ModalFooter,
    Button,
    toggle
} from "@nextui-org/react";

const DataPane = () => {
    // Track the state of the query parameters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [catalog, setCatalog] = useState<Catalog>(); 
    const [collections, setCollections] = useState<Collection[]>([]); 
    const [items, setItems] = useState<Item[]>([]); 
    
    // Track which Item's should be rendered
    const [selectedCollections, setSelectedCollections] = useState<Collection[]>([]); // Track selected collections
    const [selectedItems, setSelectedItems] = useState<Item[]>([]); // Track selected items
    
    // PNG Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(false);

    // Fetch the catalog and set it in the state
    const _fetchCatalog = async () => {
        const catalogData = await fetchCatalog();
        setCatalog(catalogData);
    };

    // Fetch the items and set them in the state
    const _fetchItems = async (collection: Collection, startDateTime: string, endDateTime: string) => {
        const items = await fetchItems(collection, startDateTime, endDateTime);
        setItems(items);
    };

    // Fetch the item and set it in the state
    const _fetchItem = async (itemLink: string): Promise<Item> => {
        const item = await fetchItem(itemLink);
        return item;
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            await _fetchCatalog();
        };
        fetchData();
    }, []); // Run once on component mount

    const handleCollectionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedCollection = selectedCollections.find((collection) => collection.id === event.target.name);
        if (event.target.checked) {
            if (!selectedCollection) {
                const collection = collections.find((collection) => collection.id === event.target.name);
                if (collection) {
                    selectedCollections.push(collection);
                    await _fetchItems(collection, startDate, endDate);
                }
            }
        }
        else {
            if (selectedCollection) {
                const index = selectedCollections.indexOf(selectedCollection);
                if (index > -1) {
                    selectedCollections.splice(index, 1);
                }
            }
        }
        console.log('Selected Collections:', selectedCollections);
    }

    const handleItemChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('Item changed:', event.target.name, event.target.checked);
        const selectedItem = selectedItems.some((item) => item.title === event.target.name);
        const item = items.find((item) => item.title === event.target.name);
        console.log('selectedItem:', selectedItem);
        if (event.target.checked && !selectedItem) {
                if (item) {
                    selectedItems.push(item);
                }
        }
        else {
            (item && selectedItems.splice(selectedItems.indexOf(item), 1));
        }
        console.log('Selected Items:', selectedItems);
    }

    const handleImgOnClick = () => {
        setIsModalOpen(true);
    }

    const closeModel = () => {
        setIsModalOpen(false);
    }

    useEffect(() => {
        const fetchData = async (catalog: Catalog) => {
            const links: STACLink[] = catalog.links.filter((link) => link.rel === 'child');
            if (links) {
                for (const link of links) {
                    console.log('Looking for collection:', link.title);
                    const isCollectionPresent = collections.some(c => c.id === link.title);
                    console.log('isCollectionPresent:', isCollectionPresent);
                    if (!isCollectionPresent) {
                        console.log('Collection not present. Fetching...');
                        const collection: Collection = await fetchCollection(link.href);
                        // setCollections(prevCollections => [...prevCollections, collection]); // Add the selected collection to the list of collections
                        collections.push(collection);
                    }
                }
            }
        };
        catalog && fetchData(catalog);
        }, [catalog, collections]); // Run once on component mount

    return (
        <Card className='datapane'>
            <CardBody>
                <Card>
                    <CardBody>
                        <div>
                            <label htmlFor="startDateTime">Start Date:</label>
                            <input className='date-box' type="date" id="startDateTime" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div>
                            <label htmlFor="endDateTime">End Date:</label>
                            <input className='date-box' type="date" id="endDateTime" value={endDate} onChange={handleEndDateChange} />
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody>
                        Collections:
                        {collections && (
                            collections.map((collection) =>
                                <Checkbox key={collection.id} name={collection.id} defaultSelected={false} onChange={handleCollectionChange}>
                                    {collection.id}
                                </Checkbox>
                                )
                        )}
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className='item-list'>
                        Items:
                        {items && (
                            items.map((item) =>
                                <Checkbox key={item.title} name={item.title} defaultSelected={false} onChange={handleItemChange}>
                                    {item.title}
                                </Checkbox>
                                )
                            )
                        }
                    </CardBody>
                </Card>
            </CardBody>
        </Card>
    );
};

export default DataPane;
                


// import React, { useState } from 'react';

// const DataPane: React.FC = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     const handleIconClick = () => {
//         setIsModalOpen(true);
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//     };

//     return (
//         <div>
//             {/* Render the clickable image icon */}
//             <img src="icon.png" alt="Icon" onClick={handleIconClick} />

//             {/* Render the modal */}
//             {isModalOpen && (
//                 <div className="modal">
//                     <div className="modal-content">
//                         <img src="image.png" alt="Image" />
//                         <button onClick={closeModal}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };