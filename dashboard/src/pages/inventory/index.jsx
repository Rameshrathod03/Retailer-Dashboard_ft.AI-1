import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    Input,
    Button,
} from "@material-tailwind/react";

import React, { useState, useEffect } from 'react';

import { EyeIcon, ArchiveBoxIcon } from "@heroicons/react/24/solid";

import { db, auth, useAuthState } from '../../firebase';
import { collection, addDoc, setDoc, doc, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Inventory =() => {
  const data = [
    {
      label: "HTML",
      value: "html",
      desc: `It really matters and then like it really doesn't matter.
      What matters is the people who are sparked by it. And the people
      who are like offended by it, it doesn't matter.`,
    },
    {
      label: "React",
      value: "react",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "Vue",
      value: "vue",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
    {
      label: "Angular",
      value: "angular",
      desc: `Because it's about motivating the doers. Because I'm here
      to follow my dreams and inspire other people to follow their dreams, too.`,
    },
    {
      label: "Svelte",
      value: "svelte",
      desc: `We're not always in the position that we want to be at.
      We're constantly growing. We're constantly making mistakes. We're
      constantly trying to express ourselves and actualize our dreams.`,
    },
  ];
 
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
        const { uid } = auth.currentUser;
        const categoriesRef = collection(db, "Retailers", uid, "categories");
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categoriesData = categoriesSnapshot.docs.map((doc) => doc.data());
        setCategories(categoriesData);
    };

    fetchCategories();
}, []);

const [items, setItems] = useState([]);

useEffect(() => {
    const fetchItems = async () => {
        const { uid } = auth.currentUser;
        const itemsRef = collection(db, "Retailers", uid, "items");
        const itemsSnapshot = await getDocs(itemsRef);
        const itemsData = itemsSnapshot.docs.map((doc) => doc.data());
        setItems(itemsData);
    };

    fetchItems();
}, []);

  return (
    <div className=" overflow-scroll">
        <div className="mb- flex items-center justify-between gap-8 px-2 pt-1">
                <div>
                <Typography variant="h5" color="blue-gray">
                    Inventory Tally
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    See information about all the registered customers.
                </Typography>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <a href='/add-category'><Button variant="outlined" size="sm">
                    Add Category
                </Button></a>
                <a href="/add-item"><Button className="flex items-center gap-3" size="sm">
                    <ArchiveBoxIcon strokeWidth={2} className="h-4 w-4" /> Add Items
                </Button></a>
                </div>
        </div>
        
        <Tabs value="html" orientation="vertical" className="mt-12">
            <TabsHeader className=" w-48 gap-4">
                <Typography variant="h6" color="blue-gray" className="text-center mt-2">
                    Categories
                </Typography>
                {categories.map((category) => (
                <Tab key={category.categoryName} value={category.categoryName}>
                    {category.categoryName}
                </Tab>
                ))}
            </TabsHeader>
            <TabsBody className=" px-6">
                {items.map((item) => (
                <TabPanel key={item.category} value={item.category} className="py-0 col-span-8 flex flex-row gap-4 flex-wrap p-2">
                    
                    <div class="mx-auto bg-white shadow-lg w-90 h-50 rounded-2xl hover:cursor-pointer">
                        <div class="h-40 overflow-hidden p-2">
                            <img src="https://htmlcolorcodes.com/assets/images/colors/light-blue-color-solid-background-1920x1080.png" alt="" className='rounded-md shadow-sm' />
                        </div>
                        <div class=" p-4">
                            <div class="grid grid-cols-2 gap-4 mt-1 px-6">
                                <div class="h-8 rounded">
                                    <Typography variant="h6" color="blue-gray">
                                        {item.itemName}
                                    </Typography>
                                    <Typography variant="p" color="blue-gray">
                                        {item.itemDescription}
                                    </Typography>
                                </div>
                                <div class="h-8 rounded text-right">
                                    <Typography variant="p" color="blue-gray">
                                        In Stock: {item.unitsInInventory}
                                    </Typography>
                                    <Typography variant="p" color="blue-gray">
                                        Id: {item.id}
                                    </Typography>
                                </div>
                                <div class="h-8 rounded mt-4">
                                    <Button variant="outlined" size="sm">
                                        edit item
                                    </Button>
                                </div>
                                <div class="h-8 rounded mt-4 text-right">
                                    <Button size="sm">
                                        view item
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    </div>
  );
}

export default Inventory;