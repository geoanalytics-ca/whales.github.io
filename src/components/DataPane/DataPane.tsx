import { fetchCatalog, fetchCollection, fetchItems, fetchItem } from '@services/stac';
import React, { useState, useEffect, use } from 'react';
import { Catalog, Collection, Item, Asset, STACLink } from '@stac/StacObjects';
import { FaImage, FaMap } from "react-icons/fa";
import { GiWhaleTail } from "react-icons/gi";
import { 
    Card,
    CardBody,
    Spinner,
    Checkbox,
    Table,
    TableHeader,
    TableColumn,
    TableRow,
    TableBody,
    TableCell,
    Modal,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalContent,
    useDisclosure,
    Button,
    Image,
} from "@nextui-org/react";

type assetLink = {
    assetName: string;
    href: string;
    parent: string;
};

const DataPane = (
    { 
        mapCenter, setMapCenter, mapZoom, setMapData
    } : { 
        mapCenter: number[], setMapCenter: React.Dispatch<React.SetStateAction<number[]>>, mapZoom: number, setMapData: React.Dispatch<React.SetStateAction<string>>
    }
    ) => {

    const [catalog, setCatalog] = useState<Catalog>(); 
    const [collections, setCollections] = useState<Collection[]>([]);     
    const [itemLinks, setItemLinks] = useState<STACLink[]>([]);
    const [assetLinks, setAssetLinks] = useState<assetLink[]>([]);
    
    // Track the state of the query parameters
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Track which Item's should be rendered
    const [selectedCollections, setSelectedCollections] = useState<STACLink[]>([]); // Track selected collections

    // PNG Modal
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [previewLink, setPreviewLink] = useState<string>('');
        
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

    const handleCollectionChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const collectionId = event.target.name;
        console.log('Collection ID:', collectionId);
        if (catalog === undefined) {
            return;
        }
        const collection = catalog.links.find((c) => c.title === collectionId);
        console.log('Collection:', collection);
        if (event.target.checked && collection !== undefined) {
            const isAlreadySelected = selectedCollections.some((c) => c === collection);
            if (!isAlreadySelected) {
                selectedCollections.push(collection);
            } else if (!event.target.checked && collection !== undefined && selectedCollections.length > 0) {
                setSelectedCollections((prevSelectedCollections) => prevSelectedCollections.filter((c) => c !== collection));
            }
        };
        if (!event.target.checked && collection !== undefined && selectedCollections.length > 0) {
            setSelectedCollections((prevSelectedCollections) => prevSelectedCollections.filter((c) => c !== collection));
        }
    };

    const queryForItems = async (colls: STACLink[]) => {
        console.log('Querying for items');
        console.log('Selected Collections:', colls);

        const queriedItems: STACLink[] = [];

        if (startDate < endDate && colls.length > 0) {
            colls.forEach((collection) => {
                console.log('Collection:', collection);
                fetchCollection(collection.href).then((collection) => {
                    fetchItems(collection, startDate, endDate).then((items) => {
                        items.forEach((item: STACLink) => {
                            const existingItem = queriedItems.find((i) => i.title === item.title);
                            if (!existingItem) {
                                queriedItems.push(item);
                            }
                        });
                        setItemLinks(queriedItems);
                    });
                });
            });
        }
    };

    const getItemAssetLinks = async (itemHref: string) => {
        console.log('Fetching item assets');
        console.log('Item HREF:', itemHref);

        const _assetLinks: assetLink[] = [];

        const item = await fetchItem(itemHref).then((item) => {
            for (const [key, value] of Object.entries(item.assets)) {
                const _asset = value as Asset;
                console.log(`${key}: ${value}`);
                if (
                    key === 'data' ||
                    key === 'netcdf' ||
                    key === 'reference'
                ) {
                    continue;
                }
                const asset = {
                    assetName: key as string,
                    parent: item.title as string,
                    href: _asset.href as string,
                };
                _assetLinks.push(asset);
            }
            setAssetLinks(_assetLinks);
        });
    };

    useEffect(() => {
        const fetchCatalogData = async () => {
            await fetchCatalog().then((catalog) => {
                setCatalog(catalog);
            });
        };
        fetchCatalogData();
        console.log('Catalog:', catalog);
    }, []);

    const CollectionPane = (
        { catalog } : { catalog: Catalog | undefined }
    ) => {
        return (
            <Card className="collection-pane">
                <CardBody>
                    Collections: 
                    <div className="flex">
                    {
                        (catalog && catalog.links) ? (
                            catalog.links.filter((link) => link.rel === 'child').map((link) =>
                                <Checkbox className="flex-1" key={link.title} name={link.title} defaultSelected={false} onChange={handleCollectionChange}>
                                    {link.title}
                                </Checkbox>
                            )
                        ) : (
                            <Spinner />
                        )
                    }
                    </div>
                </CardBody>
            </Card>
        );
    };

    const showPreview = async (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const itemHref = event.currentTarget.getAttribute('name');
        (itemHref) ? (
            setPreviewLink(itemHref),
            onOpen()
            ) : (
                console.log('No item href')
            )
    };

    const renderOnMap = async (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        console.log('Render on Map');
        const itemHref = event.currentTarget.getAttribute('name');
        (itemHref) ? (
            setMapData(itemHref)
        ) : (
            console.log('No item href')
        )
    }

    useEffect(() => {
        console.log('Item Links:', itemLinks);
    }, [itemLinks]);

    useEffect(() => {
        console.log('Asset Links:', assetLinks);
    }, [assetLinks]);

    return (
        <Card className='datapane'>
            <Modal className="z-2" size={"4xl"} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
                    <ModalBody>
                        <Image src={previewLink} />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <CardBody>
                <div className="flex space-x-4">
                    <Card className="flex-1">
                        <CardBody>
                            <label htmlFor="startDateTime">Start Date: </label>
                            <input type="date" id="startDateTime" value={startDate} onChange={handleStartDateChange} />
                        </CardBody>
                    </Card>
                    <Card className="flex-1 w-full">
                        <CardBody>
                            <label htmlFor="endDateTime">End Date: </label>
                            <input type="date" id="endDateTime" value={endDate} onChange={handleEndDateChange} />
                        </CardBody>
                    </Card>
                </div>
                <div className="flex">
                    < CollectionPane catalog={catalog} />
                </div>
                <div className="flex w-full">
                    <Button className="flex-1" onClick={() => queryForItems(selectedCollections)}>Search</Button>
                </div>
                <div className="flex">
                    <Card className="flex-1">
                        <CardBody>
                        {(itemLinks.length > 0) ? (
                            console.log('Rendering items'),
                            <Table 
                                aria-label="Example static collection table"
                                color={"default"}
                                selectionMode='single'
                                defaultSelectedKeys={[]}
                                isHeaderSticky={true}
                                classNames={{
                                    base: "max-h-[400px] overflow-scroll",
                                    table: "min-h-[425px]",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>Item</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {
                                        itemLinks.map((item: STACLink) => (
                                        <TableRow key={item.title} onClick={() => getItemAssetLinks(item.href)} >
                                            <TableCell>{item.title}</TableCell>
                                        </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                            ) : (
                            console.log('No items to display'),
                            <div className="flex justify-center">
                                <GiWhaleTail size={50} />
                            </div>
                        )}   
                </CardBody>
                </Card>
                </div>
                <div>
                <Card className="flex">
                    <CardBody>
                        {(assetLinks.length > 0) ? (
                            console.log('Rendering assets'),
                            <Table 
                            aria-label="Example static collection table"
                            color={"default"}
                            selectionMode='single'
                            defaultSelectedKeys={[]}
                            isHeaderSticky={true}
                            classNames={{
                                base: "max-h-[150px] overflow-scroll",
                                table: "min-h-[100px]",
                            }}
                            >
                                <TableHeader>
                                    <TableColumn>Asset</TableColumn>
                                    <TableColumn>Item</TableColumn>
                                    <TableColumn>Data</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {
                                        (assetLinks.length > 0 &&
                                            assetLinks.map((asset: assetLink) => (
                                            <TableRow key={asset.assetName}>
                                                <TableCell>{asset.assetName}</TableCell>
                                                <TableCell>{asset.parent}</TableCell>
                                                {(asset.assetName === 'image') ? (
                                                <TableCell>
                                                    <FaImage name={asset.href} size={20} onClick={showPreview} />
                                                </TableCell>
                                                ) : (
                                                <TableCell>
                                                    <FaMap name={asset.href} size={20} onClick={renderOnMap} />
                                                </TableCell>
                                                )}
                                            </TableRow>
                                        ))) || <></>
                                    }
                                </TableBody>
                            </Table>
                            ) : (
                            console.log('No assets to display'),
                            <div className="flex justify-center">
                                <FaImage size={10} />
                            </div>
                            )}
                    </CardBody>
                </Card>
                </div>
            </CardBody>
        </Card>
    );
};

export default DataPane;
                
