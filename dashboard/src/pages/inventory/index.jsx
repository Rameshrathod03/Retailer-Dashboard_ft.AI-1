import React from 'react';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Input,
    Button,
  } from "@material-tailwind/react";
  import {
    UserCircleIcon,
    ArrowRightIcon,
    Cog6ToothIcon,
    PowerIcon,
  } from "@heroicons/react/24/solid";

  import { EyeIcon, UserPlusIcon } from "@heroicons/react/24/solid";

  import {
    MagnifyingGlassIcon,
  } from "@heroicons/react/24/outline";
  
  

const Inventory = () => {

    const [open, setOpen] = React.useState(0);
    const [openAlert, setOpenAlert] = React.useState(true);
    
    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };

    return (
        <div className='overflow-scroll'>
            <div className="mb-8 flex items-center justify-between gap-8 px-2 pt-1">
                <div>
                <Typography variant="h5" color="blue-gray">
                    Inventory Tally
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    See information about all the registered customers.
                </Typography>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button variant="outlined" size="sm">
                    view insights
                </Button>
                <Button className="flex items-center gap-3" size="sm">
                    <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Product
                </Button>
                </div>
            </div>
            <div className=' grid-cols-12 flex'>
                <div className=' col-span-4 flex flex-col p-2'>
                    <Card className="h-[calc(85vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5 bg-blue-gray-50">
                        <div className="p-2">
                            <Input icon={<MagnifyingGlassIcon className="h-5 w-5" />} label="Search" />
                        </div> 
                        <List>
                            <ListItem>
                            Winter Wear (Women)
                            <ListItemPrefix>
                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </ListItemPrefix>
                            </ListItem>
                            <ListItem>
                            Winter Wear (Men)
                            <ListItemPrefix>
                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </ListItemPrefix>
                            </ListItem>
                            <ListItem>
                            Foot Wear
                            <ListItemPrefix>
                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </ListItemPrefix>
                            </ListItem>
                            <ListItem>
                            Amenities
                            <ListItemPrefix>
                                <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </ListItemPrefix>
                            </ListItem>
                        </List>
                    </Card>
                </div>
                <div className=' col-span-8 flex flex-row gap-4 flex-wrap p-2'>
                    <div class="mx-auto bg-white shadow-lg w-80 h-72 rounded-2xl hover:cursor-pointer">
                        <div class="h-40 overflow-hidden p-2">
                            <img src="https://marvel-b1-cdn.bc0a.com/f00000000114841/www.florsheim.com/styleguide/resources/images/about/styleTips/Q27/27header.jpg" alt="" className='rounded-md shadow-sm' />
                        </div>
                        <div class="p-3 h-">
                            <div class="grid grid-cols-2 gap-4 mt-1">
                                <div class="h-8 rounded">
                                    <Typography variant="h6" color="blue-gray">
                                        Formal Wear
                                    </Typography>
                                </div>
                                <div class="h-8 rounded text-center">
                                    <Typography variant="p" color="blue-gray">
                                        In Stock: 10
                                    </Typography>
                                </div>
                                <div class="h-8 rounded ">
                                    <Button variant="outlined" size="sm">
                                        view insights
                                    </Button>
                                </div>
                                <div class="h-8 rounded ">
                                    <Button className="flex items-center gap-3" size="sm">
                                        Add to List
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mx-auto bg-white shadow-lg w-80 h-72 rounded-2xl hover:cursor-pointer">
                        <div class="h-40 overflow-hidden p-2">
                            <img src="https://marvel-b1-cdn.bc0a.com/f00000000114841/www.florsheim.com/styleguide/resources/images/about/styleTips/Q27/27header.jpg" alt="" className='rounded-md shadow-sm' />
                        </div>
                        <div class="p-3 h-">
                            <div class="grid grid-cols-2 gap-4 mt-1">
                                <div class="h-8 rounded">
                                    <Typography variant="h6" color="blue-gray">
                                        Formal Wear
                                    </Typography>
                                </div>
                                <div class="h-8 rounded text-center">
                                    <Typography variant="p" color="blue-gray">
                                        In Stock: 10
                                    </Typography>
                                </div>
                                <div class="h-8 rounded ">
                                    <Button variant="outlined" size="sm">
                                        view insights
                                    </Button>
                                </div>
                                <div class="h-8 rounded ">
                                    <Button className="flex items-center gap-3" size="sm">
                                        Add to List
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mx-auto bg-white shadow-lg w-80 h-72 rounded-2xl hover:cursor-pointer">
                        <div class="h-40 overflow-hidden p-2">
                            <img src="https://marvel-b1-cdn.bc0a.com/f00000000114841/www.florsheim.com/styleguide/resources/images/about/styleTips/Q27/27header.jpg" alt="" className='rounded-md shadow-sm' />
                        </div>
                        <div class="p-3 h-">
                            <div class="grid grid-cols-2 gap-4 mt-1">
                                <div class="h-8 rounded">
                                    <Typography variant="h6" color="blue-gray">
                                        Formal Wear
                                    </Typography>
                                </div>
                                <div class="h-8 rounded text-center">
                                    <Typography variant="p" color="blue-gray">
                                        In Stock: 10
                                    </Typography>
                                </div>
                                <div class="h-8 rounded ">
                                    <Button variant="outlined" size="sm">
                                        view insights
                                    </Button>
                                </div>
                                <div class="h-8 rounded ">
                                    <Button className="flex items-center gap-3" size="sm">
                                        Add to List
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="mx-auto bg-white shadow-lg w-80 h-72 rounded-2xl hover:cursor-pointer">
                        <div class="h-40 overflow-hidden p-2">
                            <img src="https://marvel-b1-cdn.bc0a.com/f00000000114841/www.florsheim.com/styleguide/resources/images/about/styleTips/Q27/27header.jpg" alt="" className='rounded-md shadow-sm' />
                        </div>
                        <div class="p-3 h-">
                            <div class="grid grid-cols-2 gap-4 mt-1">
                                <div class="h-8 rounded">
                                    <Typography variant="h6" color="blue-gray">
                                        Formal Wear
                                    </Typography>
                                </div>
                                <div class="h-8 rounded text-center">
                                    <Typography variant="p" color="blue-gray">
                                        In Stock: 10
                                    </Typography>
                                </div>
                                <div class="h-8 rounded ">
                                    <Button variant="outlined" size="sm">
                                        view insights
                                    </Button>
                                </div>
                                <div class="h-8 rounded ">
                                    <Button className="flex items-center gap-3" size="sm">
                                        Add to List
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
    }

export default Inventory;