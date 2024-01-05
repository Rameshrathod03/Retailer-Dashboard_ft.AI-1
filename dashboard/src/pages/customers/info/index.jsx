import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";

import { db, auth } from '../../../firebase'; // Adjust the import path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';

import { 
    Avatar,
    Card,
    CardBody,
    CardHeader,
    Typography,
    Rating,
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineIcon,
    TimelineHeader,
    Carousel,
 } from "@material-tailwind/react";

import Chart from "react-apexcharts";

import {
    BellIcon,
    ArchiveBoxIcon,
    CurrencyDollarIcon,
  } from "@heroicons/react/24/solid";

const chartConfig = {
    type: "bar",
    height: 240,
    series: [
      {
        name: "Sales",
        data: [50, 40, 300, 320, 500, 350, 200, 230, 500],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      title: {
        show: "",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#020617"],
      plotOptions: {
        bar: {
          columnWidth: "40%",
          borderRadius: 2,
        },
      },
      xaxis: {
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
        categories: [
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        labels: {
          style: {
            colors: "#616161",
            fontSize: "12px",
            fontFamily: "inherit",
            fontWeight: 400,
          },
        },
      },
      grid: {
        show: true,
        borderColor: "#dddddd",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 5,
          right: 20,
        },
      },
      fill: {
        opacity: 0.8,
      },
      tooltip: {
        theme: "dark",
      },
    },
  };  

const CustomerInfo = () => {
    const { phone } = useParams();
    const [customer, setCustomer] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchCustomerData = async () => {
        try {
          const customerQuery = query(collection(db, 'Retailers', auth.currentUser.uid, 'customers'), where('phone', '==', phone));
          const customerSnapshot = await getDocs(customerQuery);
          if (!customerSnapshot.empty) {
            const customerData = customerSnapshot.docs[0].data();
            const customerId = customerSnapshot.docs[0].id;
            setCustomer(customerData);
  
            // Fetch purchases for this customer
            const purchasesQuery = query(collection(db, 'Retailers', auth.currentUser.uid, 'customers', customerId, 'purchases'));
            const purchasesSnapshot = await getDocs(purchasesQuery);
            const purchasesData = purchasesSnapshot.docs.map(doc => doc.data());
            setPurchases(purchasesData);
          } else {
            console.log('No customer found with phone number:', phone);
          }
        } catch (error) {
          console.error('Error fetching customer data:', error);
        }
        setLoading(false);
      };
  
      fetchCustomerData();
    }, [phone]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!customer) {
      return <div>No customer data found.</div>;
    }

    return (
        <div className="flex flex-row justify-evenly w-full grid-cols-12 flex-wrap overflow-scroll">
            <div className="p-4 flex flex-col gap-6 col-span-9">
                <div className="flex gap-8 flex-row flex-wrap">
                    <Card className="flex flex-row w-fit p-4 gap-6 align-middle flex-wrap">
                        <Avatar src="https://docs.material-tailwind.com/img/face-1.jpg" alt="avatar" size="xxl" />
                        <div className="flex flex-col gap-1">
                            <Typography variant="h6" color="blue-gray">{customer.name}</Typography>
                            <Typography variant="p" color="gray">{customer.phone}</Typography>
                            <Typography variant="p" color="gray">{customer.email}</Typography>
                            {/* <Rating value={4} readonly/> */}
                        </div>
                    </Card>
                    <Card className="flex flex-row w-fit p-4 gap-6 align-middle flex-wrap">
                        <div className="flex flex-col gap-1">
                            <Typography variant="h6" color="blue-gray">Stats:</Typography>
                            <Typography variant="p" color="gray">Total Orders: {purchases.length}</Typography>
                            <Typography variant="p" color="gray">Avg. Order Value: &#8377; 350</Typography>
                            <Typography variant="p" color="gray">Max Order Value: &#8377; 670</Typography>
                        </div>
                    </Card>
                </div>
                <Card>
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="flex flex-col gap-2 rounded-none md:flex-row md:items-center"
                    >
                        <div>
                        <Typography variant="h6" color="blue-gray">
                            AI Recommendations
                        </Typography>
                        </div>
                    </CardHeader>
                    <CardBody className="px-4">
                        <ul className="">
                            <li className="flex flex-row gap-2">
                                1. <Typography variant="p" color="gray">Buy 2 more items to get a 10% discount on your next order.</Typography>
                            </li>
                            <li className="flex flex-row gap-2">
                                2. <Typography variant="p" color="gray">Buy 2 more items to get a 10% discount on your next order.</Typography>
                            </li>
                            <li className="flex flex-row gap-2">
                                3. <Typography variant="p" color="gray">Buy 2 more items to get a 10% discount on your next order.</Typography>
                            </li>
                            <li className="flex flex-row gap-2">
                                4. <Typography variant="p" color="gray">Buy 2 more items to get a 10% discount on your next order.</Typography>
                            </li>
                        </ul>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader
                        floated={false}
                        shadow={false}
                        color="transparent"
                        className="flex flex-col gap-2 rounded-none md:flex-row md:items-center"
                    >
                        <div>
                        <Typography variant="h6" color="blue-gray">
                            Purchases by Month
                        </Typography>
                        </div>
                    </CardHeader>
                    <CardBody className="px-2 pb-0">
                        <Chart {...chartConfig} />
                    </CardBody>
                </Card>
            </div>
            <div className="p-4 flex flex-col gap-2 col-span-3">
                <Typography variant="h6" color="blue-gray">Active Categories </Typography>
                <div className="pt-2">
                    <Timeline>
                        <TimelineItem className="h-28">
                            <TimelineConnector className="!w-[78px]" />
                            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                                <TimelineIcon className="p-3" variant="ghost">
                                <BellIcon className="h-5 w-5" />
                                </TimelineIcon>
                                <div className="flex flex-col gap-1">
                                <Typography variant="h6" color="blue-gray">
                                    Footwears
                                </Typography>
                                <Typography variant="small" color="gray" className="font-normal">
                                    Amount Spent: &#8377; 1200
                                    <br></br>
                                    Items Bought: 12
                                </Typography>
                                </div>
                            </TimelineHeader>
                        </TimelineItem>
                        <TimelineItem className="h-28">
                            <TimelineConnector className="!w-[78px]" />
                            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                                <TimelineIcon className="p-3" variant="ghost" color="red">
                                <ArchiveBoxIcon className="h-5 w-5" />
                                </TimelineIcon>
                                <div className="flex flex-col gap-1">
                                <Typography variant="h6" color="blue-gray">
                                    Toiletries
                                </Typography>
                                <Typography variant="small" color="gray" className="font-normal">
                                    Amount Spent: &#8377; 1000
                                    <br></br>
                                    Items Bought: 20
                                </Typography>
                                </div>
                            </TimelineHeader>
                        </TimelineItem>
                        <TimelineItem className="h-28">
                            <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                                <TimelineIcon className="p-3" variant="ghost" color="green">
                                <CurrencyDollarIcon className="h-5 w-5" />
                                </TimelineIcon>
                                <div className="flex flex-col gap-1">
                                <Typography variant="h6" color="blue-gray">
                                    Amenities
                                </Typography>
                                <Typography variant="small" color="gray" className="font-normal">
                                    Amount Spent: &#8377; 800
                                    <br></br>
                                    Items Bought: 18
                                </Typography>
                                </div>
                            </TimelineHeader>
                        </TimelineItem>
                    </Timeline>
                </div>
                <div className="flex gap-8 flex-row flex-wrap m-auto w-[320px] md:w-[400px]">
                  <Card className="p-4">
                    <Typography variant="h6" color="blue-gray" className="p-2">Recent Purchases</Typography>
                    <Carousel className="rounded-xl">
                      <Card className="h-[270px] w-[360px] object-cover bg-[#343845] px-6">
                        <CardBody className="m-auto">
                          <Typography variant="h6" color="white">
                            Order #1234
                          </Typography>
                          <Typography variant="p" color="white">
                            Date: 12/12/2021
                          </Typography>
                          <Typography variant="p" color="white">
                            Amount: &#8377; 1200
                          </Typography>
                          <Typography variant="p" color="white">
                            Items Purchased: 12
                          </Typography>
                          <Typography variant="p" color="white">
                            Top Categories:
                          </Typography>
                          <ul className="flex flex-row flex-wrap gap-2 p-2">
                            <Typography className=" bg-gray-300 p-1 rounded-lg" variant="p" color="grey">Footwear</Typography>
                            <Typography className="bg-gray-300 p-1 rounded-lg" variant="p" color="grey">Amenities</Typography>
                            <Typography className="bg-gray-300 p-1 rounded-lg" variant="p" color="grey">Footwear</Typography>
                            <Typography className="bg-gray-300 p-1 rounded-lg" variant="p" color="grey">Medical</Typography>
                          </ul>
                        </CardBody>
                      </Card>
                    </Carousel>
                  </Card>
                </div>
            </div>
        </div>
    );
}

export default CustomerInfo;