import React, { useEffect, useState } from 'react';

import {
    MagnifyingGlassIcon,
    ChevronUpDownIcon,
  } from "@heroicons/react/24/outline";
  import { EyeIcon, UserPlusIcon } from "@heroicons/react/24/solid";
  import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    IconButton,
    Tooltip,
  } from "@material-tailwind/react";

  import { collection, getDocs } from "firebase/firestore";
  import { db, auth } from "../../firebase";
   
  const TABS = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Regular",
      value: "regular",
    },
    {
      label: "New",
      value: "new",
    },
  ];
  
  const TABLE_HEAD = ["Customer", "Stats", "Latest Purchase", "Details"];
  
  const TABLE_ROWS = [
    {
      name: "#1623123421",
      phone: "7981589112",
      orders: "10",
      ordervalue: "500",
      date: "23/04/18",
    },
    {
      name: "#1623123421",
      phone: "9623123421",
      orders: "16",
      ordervalue: "850",
      date: "23/04/18",
    },
    {
      name: "#1213212342",
      phone: "8623123421",
      orders: "30",
      ordervalue: "250",
      date: "19/09/17",
    },
    {
      name: "#1623123421",
      phone: "7981589112",
      orders: "20",
      ordervalue: "650",
      date: "23/04/18",
    },
    {
      name: "#1623123421",
      phone: "9623123421",
      orders: "12",
      ordervalue: "480",
      date: "23/04/18",
    },
    {
      name: "#1623123421",
      phone: "7981589112",
      orders: "10",
      ordervalue: "500",
      date: "23/04/18",
    },
    {
      name: "#1623123421",
      phone: "9623123421",
      orders: "16",
      ordervalue: "850",
      date: "23/04/18",
    },
  ];
   
const UserTable = () => {

  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const retailerId = auth.currentUser.uid; // Ensure auth.currentUser.uid is available
        const customersSnapshot = await getDocs(collection(db, "Retailers", retailerId, "customers"));
        let customers = [];
        for (let doc of customersSnapshot.docs) {
          const customer = { id: doc.id, ...doc.data() };
          const purchasesSnapshot = await getDocs(collection(db, `Retailers/${retailerId}/customers/${doc.id}/purchases`));
          customer.purchases = purchasesSnapshot.docs.map(purchaseDoc => purchaseDoc.data());
          customers.push(customer);
        }
        setCustomerData(customers);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }


    return (
      <div className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Customers List
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all the registered customers.
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {/* <Button variant="outlined" size="sm">
                view insights
              </Button> */}
              <a href="customers/add-order"><Button className="flex items-center gap-3" size="sm">
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Order
              </Button></a>
            </div>
          </div>
          
        </CardHeader>
        <CardBody className="overflow-scroll px-0">
          <table className="mt-4 w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={head}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}{" "}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            
            <tbody>
              {customerData.map((customer) =>{

                const latestPurchaseDate = customer.purchases
                .map(purchase => new Date(purchase.metaInfo.date))
                .reduce((a, b) => a > b ? a : b, new Date(0));

                const formattedLatestDate = latestPurchaseDate.toISOString().split('T')[0];
              
                 return (
                <tr key={customer.id}>
                  <td className="p-4 border-b border-blue-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {customer.name} {/* Replace with the actual field name for the customer's name */}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          Phone: {customer.phone} {/* Replace with the actual field name for the customer's phone */}
                        </Typography>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            No.of Purchases: {customer.purchases.length}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            Avg. Order Value: &#8377;{customer.purchases.reduce((total, purchase) => total + purchase.total, 0) / customer.purchases.length}
                          </Typography>
                        </div>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {formattedLatestDate}
                        </Typography>
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    <a href={`/customers/${customer.phone}`}><Tooltip content="View User">
                      <IconButton variant="text">
                        <EyeIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip></a>
                  </td>
                </tr>
                 )
              })}
            </tbody>
          </table>
        </CardBody>
        {/* <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Typography variant="small" color="blue-gray" className="font-normal">
            Page 1 of 10
          </Typography>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">
              Previous
            </Button>
            <Button variant="outlined" size="sm">
              Next
            </Button>
          </div>
        </CardFooter> */}
      </div>
    );
  }

export default UserTable;