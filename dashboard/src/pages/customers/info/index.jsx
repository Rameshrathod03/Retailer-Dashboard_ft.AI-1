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

import Chart from 'react-apexcharts';

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
    const [aiRecommendations, setAiRecommendations] = useState([]);
    const [chartConfig, setChartConfig] = useState(null); 

    // Function to aggregate sales by month
  const aggregateSalesByMonth = (purchases) => {
    const monthlySales = {
      "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
      "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
    };

    purchases.forEach(purchase => {
      const month = new Date(purchase.metaInfo.date).toLocaleString('default', { month: 'short' });
      monthlySales[month] += purchase.total;
    });

    return Object.values(monthlySales);
  };

  useEffect(() => {
    if (purchases) {
      const monthlySalesData = aggregateSalesByMonth(purchases);

      const newChartConfig = {
        series: [{
          name: "Sales",
          data: monthlySalesData
        }],
        options: {
          chart: {
            type: "bar",
            height: 240
          },
          plotOptions: {
            bar: {
              columnWidth: "40%",
              borderRadius: 2
            }
          },
          xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          },
          // ... other chart configurations
        }
      };

      setChartConfig(newChartConfig);
    }
  }, [purchases]);

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
            try {
              const accessToken = await auth.currentUser.getIdToken();
              const uid = auth.currentUser.uid;
    
              const response = await fetch(`http://127.0.0.1:8000/api/customerProfile/?accessToken=${accessToken}&uid=${uid}&phone=${phone}&purchasedata=${purchasesData}`);
    
              if (response.ok) {
                const data = await response.json();
                const recommendationsString = data.content;
              
                try {
                  // First, replace single quotes at the start and end of each element with double quotes
                  let validJsonString = recommendationsString.replace(/'\[/g, '["').replace(/\]'/g, '"]');
              
                  // Then replace single quotes around each element with double quotes
                  validJsonString = validJsonString.replace(/', '/g, '", "').replace(/',"/g, '","').replace(/"', '/g, '","');
              
                  // Finally, parse the string as JSON
                  const recommendations = JSON.parse(validJsonString);
              
                  setAiRecommendations(recommendations);
                } catch (error) {
                  console.error('Error parsing AI recommendations:', error);
                  setAiRecommendations(recommendationsString);
                }
              } else {
                console.log('Error:', response.status);
              }
            } catch (error) {
              console.error('Error fetching customer data:', error);
            }
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

    const calculatePurchaseStats = (purchases) => {
      const totalOrders = purchases.length;
      const totalValue = purchases.reduce((sum, purchase) => sum + purchase.total, 0);
      const avgOrderValue = totalOrders > 0 ? (totalValue / totalOrders) : 0;
      const maxOrderValue = purchases.reduce((max, purchase) => purchase.total > max ? purchase.total : max, 0);
    
      return {
        totalOrders,
        avgOrderValue,
        maxOrderValue
      };
    };    

    const { totalOrders, avgOrderValue, maxOrderValue } = calculatePurchaseStats(purchases);

    const getTopCategories = (purchases) => {
      const categoryStats = {};
    
      purchases.forEach(purchase => {
        purchase.orderProducts.forEach(product => {
          const { category, price, quantity } = product;
    
          // Skip if the category is "No Category"
          if (category === "No Category") {
            return;
          }
    
          if (!categoryStats[category]) {
            categoryStats[category] = { amountSpent: 0, itemsBought: 0 };
          }
    
          categoryStats[category].amountSpent += parseFloat(price) * quantity;
          categoryStats[category].itemsBought += quantity;
        });
      });
    
      // Convert the object to an array, sort by amount spent, and get the top 3
      return Object.entries(categoryStats)
        .map(([category, stats]) => ({ category, ...stats }))
        .sort((a, b) => b.amountSpent - a.amountSpent)
        .slice(0, 3); // Get only the top 3 categories
    };
    

    const sortPurchasesByRecent = (purchases) => {
      return purchases.sort((a, b) => {
        // Compare dates
        if (a.metaInfo.date > b.metaInfo.date) return -1;
        if (a.metaInfo.date < b.metaInfo.date) return 1;
    
        // If dates are equal, compare times
        return b.metaInfo.time.localeCompare(a.metaInfo.time);
      });
    };
    

    const topCategories = getTopCategories(purchases);

    

    return (
        <div className="flex flex-row justify-evenly w-full grid-cols-12 flex-wrap overflow-scroll">
            <div className="p-4 flex flex-col gap-6 col-span-8 w-3/5">
                <div className="flex gap-8 flex-row flex-wrap">
                    <Card className="flex flex-row w-fit p-4 gap-6 align-middle flex-wrap">
                        <div className="flex flex-col gap-1">
                            <Typography variant="h6" color="blue-gray">{customer.name}</Typography>
                            <Typography variant="p" color="gray">{customer.phone}</Typography>
                            <Typography variant="p" className=" text-sm" color="gray">{customer.email}</Typography>
                            {/* <Rating value={4} readonly/> */}
                        </div>
                    </Card>
                    <Card className="flex flex-row w-fit p-4 gap-6 align-middle flex-wrap">
                        <div className="flex flex-col gap-1">
                            <Typography variant="h6" color="blue-gray">Stats:</Typography>
                            <Typography variant="p" color="gray">Total Orders: {totalOrders}</Typography>
                            <Typography variant="p" color="gray">Avg. Order Value: &#8377; {avgOrderValue.toFixed(2)}</Typography>
                            <Typography variant="p" color="gray">Max Order Value: &#8377; {maxOrderValue}</Typography>
                        </div>
                    </Card>
                </div>
                <Card className=" w-full">
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
                        {/* <ol className=" list-decimal">
                          {aiRecommendations.map((recommendation, index) => (
                            <li key={index} className="flex flex-row gap-2">
                              <Typography variant="p" color="gray">{recommendation}</Typography>
                            </li>
                          ))}
                        </ol> */}
                         <Typography variant="p" color="gray">{aiRecommendations}</Typography>
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
                      <Chart options={chartConfig.options} series={chartConfig.series} type="bar" height={220} />
                    </CardBody>
                </Card>
            </div>
            <div className="p-4 flex flex-col gap-2 col-span-3 w-2/5">
                <Typography variant="h6" color="blue-gray">Top Categories </Typography>
                <div className="pt-2">
                    <Timeline>
                        {topCategories.map((category, index) => (
                            <TimelineItem key={index} className="h-28">
                                <TimelineConnector className="!w-[78px]" />
                                <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white py-3 pl-4 pr-8 shadow-lg shadow-blue-gray-900/5">
                                    <TimelineIcon className="p-3" variant="ghost">
                                        {/* Choose an icon based on category or use a default one */}
                                        <BellIcon className="h-5 w-5" />
                                    </TimelineIcon>
                                    <div className="flex flex-col gap-1">
                                        <Typography variant="h6" color="blue-gray">
                                            {category.category}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="font-normal">
                                            Amount Spent: &#8377; {category.amountSpent.toFixed(2)}
                                            <br />
                                            Items Bought: {category.itemsBought}
                                        </Typography>
                                    </div>
                                </TimelineHeader>
                            </TimelineItem>
                        ))}
                    </Timeline>
                </div>
                <div className="flex gap-8 flex-row flex-wrap m-auto w-[320px] md:w-[400px]">
                  <Card className="p-4">
                    <Typography variant="h6" color="blue-gray" className="p-2">Previous Purchases</Typography>
                    <div className=" h-[270px] overflow-scroll">
                    <div className=" h-[270px] overflow-scroll">
  {sortPurchasesByRecent(purchases).map((purchase, index) => {
    // Extract categories for this purchase
    const categories = purchase.orderProducts.map(product => product.category).join(', ');

    return (
      <Card key={index} className="min-h-[240px] w-[360px] mt-2 object-cover bg-[#343845] px-6">
        <CardBody className="m-auto">
          <Typography variant="h6" color="white">
            Order #{index + 1}
          </Typography>
          <Typography variant="p" color="white">
            Date: {purchase.metaInfo.date}
          </Typography>
          <Typography variant="p" color="white">
            Time: {purchase.metaInfo.time}
          </Typography>
          <Typography variant="p" color="white">
            Amount: &#8377; {purchase.total}
          </Typography>
          <Typography variant="p" color="white">
            Categories: {categories}
          </Typography>
          <Typography variant="p" color="white">
            Items:
          </Typography>
          <ul className="flex flex-row flex-wrap gap-2 p-2">
            {purchase.orderProducts.map((product, prodIndex) => (
              <li key={prodIndex}>
                <Typography className="bg-gray-300 p-1 rounded-lg" variant="p" color="grey">
                  {product.title} - {product.quantity} pcs
                </Typography>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    );
  })}
</div>

                    </div>
                  </Card>
                </div>
            </div>
        </div>
    );
}

export default CustomerInfo;