import { fetchCatalog, fetchCollection, fetchItems, fetchItem } from '@services/stac';
import React, { useState, useEffect, useCallback } from 'react';
import { Catalog, Collection, Asset, STACLink } from '../../stac/StacObjects';
import { FaImage, FaMap } from "react-icons/fa";
import { GiWhaleTail } from "react-icons/gi";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { 
    Card,
    CardBody,
    RadioGroup,
    Radio,
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
    Link
} from "@nextui-org/react";

type assetLink = {
    assetName: string;
    href: string;
    parent: string;
};

type itemVisProperties = {
    [key: string]: string;
};

const DataPane = (
    { 
        mapCenter, setMapCenter, mapZoom, 
        setMapData, setColorMap, setDataRange, setScale,
        setUnits
    } : { 
        mapCenter: number[],
        setMapCenter: React.Dispatch<React.SetStateAction<number[]>>
        mapZoom: number
        setMapData: React.Dispatch<React.SetStateAction<string|undefined>>
        setColorMap: React.Dispatch<React.SetStateAction<string|undefined>>
        setDataRange: React.Dispatch<React.SetStateAction<number[]>>
        setScale: React.Dispatch<React.SetStateAction<string|undefined>>
        setUnits: React.Dispatch<React.SetStateAction<string|undefined>>
    }
    ) => {
    const [selected, setSelected] = React.useState("");
    const [catalog, setCatalog] = useState<Catalog>(); 
    const [itemLinks, setItemLinks] = useState<STACLink[]>([]);
    const [itemVisProperties, setItemVisProperties] = useState<itemVisProperties>({});
    const [assetLinks, setAssetLinks] = useState<assetLink[]>([]);
    const [assetHref, setAssetHref] = useState<string>('');
    // Track the state of the query parameters
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 3);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 2);
        return date.toISOString().split('T')[0];
    });
    // Track which Item's should be rendered
    const [selectedCollection, setSelectedCollection] = useState<STACLink>(); // Track selected collections
    // PNG Modal
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [previewLink, setPreviewLink] = useState<string>('');
        
    const nameMap = (input: string) => {
        if (input === 'acri') {
            return 'Ocean color remote sensing';
        }
        return input;
    };

    const shortenItemId = (itemId: string) => {
        const datePattern = /\d{8}/;
        const dateMatch = itemId.match(datePattern);
        const date = dateMatch ? dateMatch[0] : 'YYYYMMDD';

        if (itemId.includes('L3') && itemId.includes('CHL-PCA')) {
            return `L3_${date}_CHL_PCA`;
        } else if (itemId.includes('L4') && itemId.includes('CHL-PCA')) {
            return `L4_${date}_GAP_FREE_CHL_PCA`;
        } else if (itemId.includes('L3') && itemId.includes('PP')) {
            return `L3_${date}_PP`;
        } else {
            return itemId;
        }
    };

    const shortAssetName = (assetName: string) => {
        if (assetName.includes('L3') && assetName.includes('CHL-PCA')) {
            return `CHL-PCA`;
        } else if (assetName.includes('L4') && assetName.includes('CHL-PCA')) {
            return `GAP-FREE-CHL-PCA`;
        } else {
            return assetName;
        }
    };

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

    useEffect(() => {
        const handleCollectionChange = async () => {
            let collectionId = selected;
            console.log('Collection ID:', collectionId);
            if (catalog === undefined) {
                return;
            }
            const collection = catalog.links.find((c: STACLink) => c.title === collectionId);
            console.log('Collection:', collection);
            if (collection !== undefined) {
                const isAlreadySelected = selectedCollection === collection;
                if (!isAlreadySelected) {
                    setSelectedCollection(collection);
                } else if (collection !== undefined && selectedCollection !== undefined) {
                    setSelectedCollection(undefined);
                }
            }
        }
        if (selected !== '' && catalog !== undefined && selectedCollection === undefined) {
            handleCollectionChange();
        }
    }, [selected, catalog, selectedCollection]);

    const queryForItems = async () => {
        console.log('Querying for items');
        console.log('Selected Collections:', selectedCollection);

        const queriedItems: STACLink[] = [];

        if (startDate < endDate && selectedCollection !== undefined) {
            console.log('Collection:', selectedCollection);
            fetchCollection(selectedCollection.href).then((collection) => {
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
        }
    };

    const getItemAssetLinks = async (itemHref: string) => {
        console.log('Fetching item assets');
        console.log('Item HREF:', itemHref);

        const _assetLinks: assetLink[] = [];

        await fetchItem(itemHref).then((item) => {
            if ('visualization' in item.properties) {
                console.log('Item Properties:', item.properties);
                console.log('Visualization:', item.properties.visualization);
                setItemVisProperties(item.properties.visualization);
            }
            for (const [key, value] of Object.entries(item.assets)) {
                const _asset = value as Asset;
                console.log(`${key}: ${value}`);
                if (selectedCollection?.title === 'acri') {
                    if (
                        key === 'data' ||
                        key === 'netcdf' ||
                        key === 'reference'
                    ) {
                        continue;
                    }
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
        if (catalog === undefined) {
            fetchCatalogData();
            console.log('Catalog:', catalog);
        }
    }, [catalog]);

    const CollectionPane = (
        { catalog } : { catalog: Catalog | undefined }
    ) => {
        return (
            <Card className="collection-pane">
                <CardBody>
                    Collections: 
                    <div className="flex w-full">
                        <RadioGroup
                        value={selected}
                        onValueChange={setSelected}
                        >
                        {
                        (catalog && catalog.links) ? (
                            catalog.links.filter((link: STACLink) => link.rel === 'child').map((link: STACLink) =>
                                <Radio className="flex-1" key={link.title} value={link.title}>
                                    {nameMap(link.title)}
                                </Radio>
                            )
                        ) : (
                            <></>
                        )
                        }
                        </RadioGroup>
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

    const downloadAsset = async (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const thisAssetHref = event.currentTarget.getAttribute('name');
        (thisAssetHref) ? (
            setAssetHref(thisAssetHref),
            onOpen()
        ) : (
            console.log('No item href')
        )
    }

    const renderOnMap = async (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        console.log('Render on Map');
        const assetHref = event.currentTarget.getAttribute('name');
        (assetHref) ? (
            setColorMap(itemVisProperties.colorRamp),
            setDataRange(typeof itemVisProperties.range === 'number' ? itemVisProperties.range : itemVisProperties.range.split(',').map(parseFloat)),
            setScale(itemVisProperties.scaling),
            setUnits(itemVisProperties.units),
            setMapData(assetHref)
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
            <Modal className="z-2" size={"3xl"} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Preview</ModalHeader>
                    <ModalBody>
                        <Image src={previewLink} alt='' />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                        Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal className="z-2" size={"3xl"} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1 w-half">Download Asset</ModalHeader>
                    <ModalBody>
                        <Button 
                            color="primary" 
                            variant="ghost" 
                            onClick={async () => {
                                const response = await fetch(assetHref);
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', assetHref.split('/').pop() as string);
                                document.body.appendChild(link);
                                link.click();
                                link.parentNode?.removeChild(link);
                                onClose();
                            }}
                        >
                            Download: {assetHref.split('/').pop()?.toString()}
                        </Button>
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
                    <Button className="flex-1" onClick={queryForItems}>Search</Button>
                </div>
                <div className="flex">
                    <Card className="flex-1">
                        <CardBody>
                        {(itemLinks.length > 0) ? (
                            <Table 
                                aria-label="Example static collection table"
                                color={"default"}
                                selectionMode='single'
                                defaultSelectedKeys={[]}
                                isHeaderSticky={true}
                                classNames={{
                                    base: "max-h-[300px] overflow-scroll",
                                    table: "min-h-[325px]",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>Item</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {
                                        itemLinks.map((item: STACLink) => (
                                        <TableRow key={item.title} onClick={() => getItemAssetLinks(item.href)} >
                                            <TableCell>{shortenItemId(item.title)}</TableCell>
                                        </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                            ) : (
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
                                                <TableCell>{shortAssetName(asset.assetName)}</TableCell>
                                                <TableCell>
                                                    <IoCloudDownloadOutline name={asset.href} size={20} onClick={downloadAsset} alt='' />
                                                </TableCell>
                                                <TableCell>
                                                    <FaMap name={asset.href} size={20} onClick={renderOnMap} alt=''/>
                                                </TableCell>
                                                {/* )} */}
                                            </TableRow>
                                        ))) || <></>
                                    }
                                </TableBody>
                            </Table>
                            ) : (
                            console.log('No assets to display'),
                            <div className="flex justify-center">
                                <FaImage size={10} alt='' />
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
                
