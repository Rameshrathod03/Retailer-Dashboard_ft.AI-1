import React from "react";
import {  signOut } from "firebase/auth";
import {auth} from '../../firebase';
import { useNavigate } from 'react-router-dom';

import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
  } from "@material-tailwind/react";
  import {
    PresentationChartBarIcon,
    ArchiveBoxIcon,
    UserGroupIcon,
    MagnifyingGlassCircleIcon,
    MegaphoneIcon,
    PowerIcon,
    ShoppingBagIcon,
  } from "@heroicons/react/24/solid";
   
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";


const Sidebar = () => {

    const [open, setOpen] = React.useState(0);
  
    const handleOpen = (value) => {
      setOpen(open === value ? 0 : value);
    };

    const navigate = useNavigate();
 
    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }

    return (
      <Card className="h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
        <div className="mb-2 p-4">
          <Typography variant="h5" color="blue-gray">
            Retailer
          </Typography>
        </div>
        <List>
          {/* <a href='/dashboard'><ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem></a> */}
          <a href='/dashboard'><ListItem>
            <ListItemPrefix>
              <PresentationChartBarIcon className="h-5 w-5" />
            </ListItemPrefix>
            Dashboard
          </ListItem></a>
          <a href='/customers'><ListItem>
            <ListItemPrefix>
              <UserGroupIcon className="h-5 w-5" />
            </ListItemPrefix>
            Customers
          </ListItem></a>
          <a href='/marketing'><ListItem>
            <ListItemPrefix>
              <MegaphoneIcon className="h-5 w-5" />
            </ListItemPrefix>
            Marketing
          </ListItem></a>
          <a href='/inventory'><ListItem>
            <ListItemPrefix>
              <ArchiveBoxIcon className="h-5 w-5" />
            </ListItemPrefix>
            Inventory
          </ListItem></a>
          <a href='/market-analysis'><ListItem>
            <ListItemPrefix>
              <MagnifyingGlassCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            Market Analysis
          </ListItem></a>
          <ListItem onClick={handleLogout}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            Log Out
          </ListItem>
        </List>
      </Card>
    );
  }

export default Sidebar;