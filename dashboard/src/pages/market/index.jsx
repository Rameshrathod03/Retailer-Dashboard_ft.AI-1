import React, {useState, useEffect} from "react";

import { db, auth } from '../../firebase'; // Adjust the import path as needed
import { collection, query, where, getDocs } from 'firebase/firestore';

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

import Chart from 'react-apexcharts';

const Market = () => {

  const [categoriesData, setCategoriesData] = useState([]);
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allPurchases, setAllPurchases] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [topCategoriesData, setTopCategoriesData] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [chartConfig, setChartConfig] = useState({
    series: [{ name: "Sales", data: [] }],
    options: {
      chart: { type: "bar", height: 240 },
      plotOptions: { bar: { columnWidth: "40%", borderRadius: 2 } },
      xaxis: { categories: [] },
      // ... other chart options
    }
  }); 

  const calculateTopCategories = (purchases) => {
    const categoryQuantities = {};
  
    purchases.forEach(purchase => {
      purchase.orderProducts.forEach(product => {
        const { category, quantity } = product;
        categoryQuantities[category] = (categoryQuantities[category] || 0) + quantity;
      });
    });
  
    const sortedCategories = Object.entries(categoryQuantities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  
    return sortedCategories.map(([category, quantity]) => ({ category, quantity }));
  };
  
  const calculateTopItems = (purchases) => {
    const itemQuantities = {};
  
    purchases.forEach(purchase => {
      purchase.orderProducts.forEach(product => {
        const { title, quantity } = product;
        itemQuantities[title] = (itemQuantities[title] || 0) + quantity;
      });
    });
  
    const sortedItems = Object.entries(itemQuantities)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  
    return sortedItems.map(([title, quantity]) => ({ title, quantity }));
  };

  const fetchAndProcessData = async () => {
    try {
        const uid = auth.currentUser.uid; // Replace with actual retailer UID

        // Fetch categories data
        const categoriesRef = collection(db, `Retailers/${uid}/categories`);
        const categoriesSnapshot = await getDocs(categoriesRef);
        const categories = categoriesSnapshot.docs.map(doc => doc.data());
        setCategoriesData(categories);

        // Fetch products data
        const itemsRef = collection(db, `Retailers/${uid}/items`);
        const itemsSnapshot = await getDocs(itemsRef);
        const items = itemsSnapshot.docs.map(doc => doc.data());
        setItemsData(items);

        const customersRef = collection(db, `Retailers/${uid}/customers`);
        const customersSnapshot = await getDocs(customersRef);

        let allPurchases = [];

        for (const customerDoc of customersSnapshot.docs) {
            const purchasesRef = collection(customerDoc.ref, 'purchases');
            const purchasesSnapshot = await getDocs(purchasesRef);

            for (const purchaseDoc of purchasesSnapshot.docs) {
                const purchaseData = purchaseDoc.data();
                allPurchases.push(purchaseData); // Add each purchase to the array
            }
        }

        setAllPurchases(allPurchases);

        console.log('categories', categories);
        console.log('items', items);
        console.log('allPurchases', allPurchases);

    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
      fetchAndProcessData();
  }, []);

  useEffect(() => {
    if (allPurchases.length > 0) {
      const topCategories = calculateTopCategories(allPurchases);
      const topItems = calculateTopItems(allPurchases);
  
      setTopProductsData(topItems);
      setTopCategoriesData(topCategories);
    }
  }, [allPurchases]);

  const aggregateSalesByMonth = (allPurchases) => {
    const monthlySales = {
      "Jan": 0, "Feb": 0, "Mar": 0, "Apr": 0, "May": 0, "Jun": 0,
      "Jul": 0, "Aug": 0, "Sep": 0, "Oct": 0, "Nov": 0, "Dec": 0
    };
  
    allPurchases.forEach(purchase => {
      const month = new Date(purchase.metaInfo.date).toLocaleString('default', { month: 'short' });
      monthlySales[month] += purchase.total;
    });
  
    return Object.values(monthlySales);
  };
  
  useEffect(() => {
    if (allPurchases.length > 0) {
      const monthlySalesData = aggregateSalesByMonth(allPurchases);
  
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
  }, [allPurchases]);  

  useEffect(() => {
    const fetchAIInsigts = async () => {
      setAiLoading(true);
      try {
        const accessToken = await auth.currentUser.getIdToken();
        const uid = auth.currentUser.uid;

        const response = await fetch(`http://127.0.0.1:8000/api/marketAnalysis/?accessToken=${accessToken}&uid=${uid}`);
 
        if (response.ok) {
          response.json().then(jsonResponse => {
            const recommendations = jsonResponse.data;
            console.log("AI Recommendations:", recommendations);
            setAiRecommendations(recommendations);
          });
        } else {
          console.log('Error:', response.status);
        }
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setAiLoading(false);
      }
    } 

    fetchAIInsigts()
  }
  , []);

  if (loading || aiLoading) {
      return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-full">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Market Analysis
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information insights of the market.
              </Typography>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-2 flex flex-row gap-4 flex-wrap grid-cols-3">
          <div className="col-span-2 justify-center px-2">
            <div className="flex flex-row flex-wrap gap-4">
              <Card className=" w-fit p-4" >
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Top 5 Products:
                </Typography>
                <div className=" w-fit">
                    Product Name - Items Sold
                    <ol className=" list-decimal pl-4 mt-1">
                      {topProductsData.map(product => (
                        <li key={product.title}>{product.title} - {product.quantity}</li>
                      ))}
                    </ol>
                </div>
              </Card>
              <Card className=" w-fit p-4" >
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Top 5 Categories:
                </Typography>
                <div className=" w-fit">
                  Category Name - Items Sold
                    <ol className=" list-decimal pl-4 mt-1">
                        {topCategoriesData.map(category => (
                        <li key={category.category}>{category.category} - {category.quantity}</li>
                      ))}
                    </ol>
                </div>
              </Card>
            </div>
            <div className=" mt-6">
              <Card >
                <Typography variant="h6" color="blue-gray" className="mb-2 m-2">
                  Sales Trends:
                </Typography>
                {chartConfig && chartConfig.series[0].data.length > 0 && (
                  <Chart options={chartConfig.options} series={chartConfig.series} type="bar" height={220} />
                )}
              </Card>
            </div>
          </div>
          <div className=" col-span-1 px-2 w-1/2">
            <Card className=" p-4">
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Market Insights by AI:
              </Typography>
                {aiRecommendations}
            </Card>
          </div>
      </CardBody>
    </div>
  );
}

export default Market;