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

import Barcode from 'react-barcode';

import { db, auth, useAuthState } from '../../firebase';
import { collection, addDoc, setDoc, doc, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const Inventory =() => {
 
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

const downloadPng = async (containerId, name) => {
    const container = document.getElementById(containerId);
    if (container) {
      const svgEl = container.querySelector('svg');
      if (svgEl) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svgEl);
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const image = new Image();
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);
          URL.revokeObjectURL(svgUrl);
          
          canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = name;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          }, 'image/png');
        };
        image.src = svgUrl;
      } else {
        console.error('SVG element not found');
      }
    } else {
      console.error('Container element not found');
    }
  };
  
  const trimText = (text, maxWordCount) => {
    const words = text.split(" ");
    if (words.length > maxWordCount) {
      return words.slice(0, maxWordCount).join(" ") + "...";
    }
    return text;
  };
  
  

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
            <TabsHeader className=" w-48 gap-4 text-center">
                <Typography variant="h6" color="blue-gray" className="text-center mt-2">
                    Categories
                </Typography>
                {categories.map((category) => (
                <Tab key={category.categoryName} value={category.categoryName}>
                    {category.categoryName}
                </Tab>
                ))}
                <Tab key="No Category" value="No Category">
                    No Category
                </Tab>
                <a href='/delete-category' className=" mb-2"><Button variant="outlined" size="sm">
                    Delete Category
                </Button></a>
            </TabsHeader>
            <TabsBody className=" px-4 flex gap-1 flex-wrap">
                {items.map((item) => (
                <TabPanel key={item.category} value={item.category} className="p-2 w-[420px] h-fit">
                    <div class="mx-auto bg-white shadow-lg rounded-2xl hover:cursor-pointer">
                        <div className="overflow-hidden p-4 flex justify-center align-middle" id={`barcode-container-${item.id}`}>
                            <Barcode value={item.id} height="50"/>
                        </div>
                        <div class="p-4 h-fit">
                            <div class="grid grid-cols-2 gap-4 mt-1 px-6 h-30">
                                <div class="h-8 rounded text-nowrap">
                                    <Typography variant="h6" color="blue-gray">
                                        {item.itemName}
                                    </Typography>
                                    <Typography variant="p" color="blue-gray">
                                        {trimText(item.itemDescription, 4)} {/* Adjust the number of words as needed */}
                                    </Typography>
                                </div>
                                <div class="h-8 rounded text-right">
                                    <Typography variant="p" color="blue-gray">
                                        In Stock: {item.unitsInInventory}
                                    </Typography>
                                    <Typography variant="p" color="blue-gray">
                                        Price: Rs {item.price}
                                    </Typography>
                                </div>
                                <div class="h-8 rounded mt-4">
                                <Button 
                                    variant="outlined" 
                                    size="sm" 
                                    onClick={() => downloadPng(`barcode-container-${item.id}`, `${item.itemName}.png`)}
                                >
                                    Download
                                </Button>
                                </div>
                                <div class="h-8 rounded mt-4 text-right">
                                    <a href={`/edit-item/${item.id}`}><Button size="sm">
                                        edit item
                                    </Button></a>
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