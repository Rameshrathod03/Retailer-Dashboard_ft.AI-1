import { Fragment, useState } from 'react'
import { Dialog, Popover, RadioGroup, Tab, Transition } from '@headlessui/react'
import { Bars3Icon, QuestionMarkCircleIcon, MagnifyingGlassIcon, ShoppingBagIcon, XCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/solid'

import { useNavigate } from 'react-router-dom';

import {
  Typography,
  Button,
} from '@material-tailwind/react';

import { db, auth } from '../../../firebase'; // Import your Firebase configuration
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

import ItemModal from './ItemModal';

const deliveryMethods = [
  { id: 1, title: 'Standard', turnaround: '4–10 business days', price: '$5.00' },
  { id: 2, title: 'Express', turnaround: '2–5 business days', price: '$16.00' },
]
const paymentMethods = [
  { id: 'credit-card', title: 'Credit card' },
  { id: 'paypal', title: 'PayPal' },
  { id: 'etransfer', title: 'eTransfer' },
]
const footerNavigation = {
  products: [
    { name: 'Bags', href: '#' },
    { name: 'Tees', href: '#' },
    { name: 'Objects', href: '#' },
    { name: 'Home Goods', href: '#' },
    { name: 'Accessories', href: '#' },
  ],
  company: [
    { name: 'Who we are', href: '#' },
    { name: 'Sustainability', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Terms & Conditions', href: '#' },
    { name: 'Privacy', href: '#' },
  ],
  customerService: [
    { name: 'Contact', href: '#' },
    { name: 'Shipping', href: '#' },
    { name: 'Returns', href: '#' },
    { name: 'Warranty', href: '#' },
    { name: 'Secure Payments', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Find a store', href: '#' },
  ],
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [open, setOpen] = useState(false);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(deliveryMethods[0]);
  const [userVerified, setUserVerified] = useState(false);
  const [newUser, setNewUser] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemIdInput, setItemIdInput] = useState("");
  const [orderProducts, setOrderProducts] = useState([]); // Initialize with existing products

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  const navigate = useNavigate();

  const handleDeleteProduct = (productId) => {
    // Filter out the product with the specified ID
    const updatedProducts = orderProducts.filter((product) => product.id !== productId);
    // Update the state to reflect the changes
    setOrderProducts(updatedProducts);
  };

  const now = new Date();
  const date = now.toISOString().substring(0, 10); 
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  const verifyUser = async (phone) => {
    const customersRef = collection(db, "Retailers", auth.currentUser.uid, "customers");
    const q = query(customersRef, where("phone", "==", phone));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      setUserVerified(true);
      setNewUser(false);
    } else {
      setUserVerified(false);
      setNewUser(true);
    }
  };

  const handleAddItem = async (itemId) => {
    if (!itemId) return; // Exit if no item ID is provided
  
    // Query Firestore for the item
    const itemsRef = collection(db, "Retailers", auth.currentUser.uid, "items");
    const q = query(itemsRef, where("id", "==", itemId));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const itemData = querySnapshot.docs[0].data();

      // Check if the item is already in the orderProducts state
      const existingItemIndex = orderProducts.findIndex((item) => item.id === itemData.id);

      if (existingItemIndex !== -1) {
        // If the item already exists, update its quantity
        const updatedOrderProducts = [...orderProducts];
        updatedOrderProducts[existingItemIndex].quantity += 1;

        setOrderProducts(updatedOrderProducts);
      } else {
        // If the item doesn't exist, add it to the orderProducts state
        const newItem = {
          id: itemData.id,
          title: itemData.itemName,
          price: itemData.price,
          category: itemData.category,
          quantity: 1, // Initialize quantity to 1 for new items
        };

      // Add the item to the orderProducts state
      setOrderProducts((prevProducts) => [...prevProducts, newItem]);
      }
    } else {
      // Handle the case where the item is not found
      console.log("Item not found");
    }
  
    setIsModalOpen(false); // Close modal after processing
  };

  const calculateTotal = () => {
    return orderProducts.reduce((total, product) => {
      // Assuming product.price is a string like 'Rs. 100', extract the numeric part
      const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
      return total + (price * product.quantity);
    }, 0);
  };  

  const handleQuantityChange = (productId, newQuantity) => {
    // Convert newQuantity to an integer
    newQuantity = parseInt(newQuantity);
  
    setOrderProducts(currentProducts => {
      // If the new quantity is 0, filter out the product
      if (newQuantity === 0) {
        return currentProducts.filter(product => product.id !== productId);
      } else {
        // Otherwise, update the quantity of the product
        return currentProducts.map(product =>
          product.id === productId ? { ...product, quantity: newQuantity } : product
        );
      }
    });
  };

  const feedbackOptions = [
    { value: 'Whatsapp', label: 'Whatsapp' },
    { value: 'Message', label: 'Message' },
    { value: 'Email', label: 'Email' },
    { value: 'Word of Mouth', label: 'Word of Mouth' },
    { value: 'None', label: 'None' },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Create customer data object
    const customerData = {
      phone: phoneNumber,
      email,
      name,
      gender
    };
  
    // Meta information data
    const metaInfo = {
      date: date, // or use new Date().toISOString().substring(0, 10) if you want the current date
      time: time  // or use `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}` for current time
    };
  
    // Reference to the customers collection
    const customersRef = collection(db, "Retailers", auth.currentUser.uid, "customers");
  
    // Check if the user is new or existing
    if (newUser) {
      // Add the new customer
      const newCustomerRef = await addDoc(customersRef, customerData);
  
      // Create a purchase record under this new customer
      const purchaseRef = collection(newCustomerRef, "purchases");
      await addDoc(purchaseRef, {
        orderProducts,
        total: calculateTotal(),
        metaInfo,
        reach: document.getElementById("feedback").value,
      });
    } else {
      // Find existing customer
      const q = query(customersRef, where("phone", "==", phoneNumber));
      const querySnapshot = await getDocs(q);
      const existingCustomerRef = querySnapshot.docs[0].ref;
  
      // Add purchase to existing customer's purchases
      const purchaseRef = collection(existingCustomerRef, "purchases");
      await addDoc(purchaseRef, {
        orderProducts,
        total: calculateTotal(),
        metaInfo,
        feedback: document.getElementById("feedback").value,
      });
    }

    // Show a success message
  alert('Order placed successfully!');

  // Redirect to another page, e.g., order summary or home page
  navigate('/customers');

  };  

  return (
    <div className=' overflow-scroll'>
      <Typography variant="h4" color="blue-gray" className=' text-center pt-2'>
        Add Order
      </Typography>
      <main className="max-w-7xl mx-auto pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">User Information</h2>

                <div className="mt-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        autoComplete="tel"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                    <Button className=' mt-2' variant='outlined' size='sm' onClick={() => verifyUser(document.getElementById("phone").value)}>
                      Check
                    </Button>
                </div>

                {newUser && (
                  <div>
                    <div className="mt-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        name="gender"
                        id="gender"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="block w-full border-gray-300 rounded-md shadow-sm sm:text-sm"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Meta Information</h2>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="purchase-date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="purchase-date"
                        name="purchase-date"
                        autoComplete="given-name"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue={date}
                        readOnly
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="purchase-time" className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <div className="mt-1">
                      <input
                        type="time"
                        id="purchase-time"
                        name="purchase-time"
                        autoComplete="family-name"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue={time}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                      Reach
                    </label>
                    <div className="mt-1">
                      <select
                        id="feedback"
                        name="feedback"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        defaultValue=""
                        required
                      >
                         <option value="" disabled>
                          Select an option
                         </option>
                        {feedbackOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>


                  {/* <div className="sm:col-span-2">
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="company"
                        id="company"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        autoComplete="street-address"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div> */}

                  {/* <div className="sm:col-span-2">
                    <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">
                      Apartment, suite, etc.
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="apartment"
                        id="apartment"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700">
                      Postal code
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        autoComplete="postal-code"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        autoComplete="tel"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Payment */}
              {/* <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Feedback</h2>

                <fieldset className="mt-4">
                  <legend className="sr-only">Feedback</legend>
                  <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                    {paymentMethods.map((paymentMethod, paymentMethodIdx) => (
                      <div key={paymentMethod.id} className="flex items-center">
                        {paymentMethodIdx === 0 ? (
                          <input
                            id={paymentMethod.id}
                            name="payment-type"
                            type="radio"
                            defaultChecked
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                        ) : (
                          <input
                            id={paymentMethod.id}
                            name="payment-type"
                            type="radio"
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          />
                        )}

                        <label htmlFor={paymentMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                          {paymentMethod.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4">
                  <div className="col-span-4">
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                      Card number
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="card-number"
                        name="card-number"
                        autoComplete="cc-number"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                      Name on card
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name-on-card"
                        name="name-on-card"
                        autoComplete="cc-name"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="col-span-3">
                    <label htmlFor="expiration-date" className="block text-sm font-medium text-gray-700">
                      Expiration date (MM/YY)
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="expiration-date"
                        id="expiration-date"
                        autoComplete="cc-exp"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                      CVC
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="cvc"
                        id="cvc"
                        autoComplete="csc"
                        className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className="mt-10 border-t border-gray-200 pt-10">
                <RadioGroup value={selectedDeliveryMethod} onChange={setSelectedDeliveryMethod}>
                  <RadioGroup.Label className="text-lg font-medium text-gray-900">Delivery method</RadioGroup.Label>

                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    {deliveryMethods.map((deliveryMethod) => (
                      <RadioGroup.Option
                        key={deliveryMethod.id}
                        value={deliveryMethod}
                        className={({ checked, active }) =>
                          classNames(
                            checked ? 'border-transparent' : 'border-gray-300',
                            active ? 'ring-2 ring-indigo-500' : '',
                            'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                          )
                        }
                      >
                        {({ checked, active }) => (
                          <>
                            <div className="flex-1 flex">
                              <div className="flex flex-col">
                                <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                                  {deliveryMethod.title}
                                </RadioGroup.Label>
                                <RadioGroup.Description
                                  as="span"
                                  className="mt-1 flex items-center text-sm text-gray-500"
                                >
                                  {deliveryMethod.turnaround}
                                </RadioGroup.Description>
                                <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                                  {deliveryMethod.price}
                                </RadioGroup.Description>
                              </div>
                            </div>
                            {checked ? (
                              <CheckCircleIcon className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                            ) : null}
                            <div
                              className={classNames(
                                active ? 'border' : 'border-2',
                                checked ? 'border-indigo-500' : 'border-transparent',
                                'absolute -inset-px rounded-lg pointer-events-none'
                              )}
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>
              </div> */}
              
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

              <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="sr-only">Items in your cart</h3>
                <ul role="list" className="divide-y divide-gray-200">
                {orderProducts.length > 0 ? (
            <ul role="list" className="divide-y divide-gray-200">
              {orderProducts.map((product, index) => (
                
                  <li key={index} className="flex py-6 px-4 sm:px-6">
                      <div className="ml-6 flex-1 flex flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-medium text-gray-700 hover:text-gray-800">
                              {product.title}
                            </h4>
                            {/* <p className="mt-1 text-sm text-gray-500"></p> */}
                          </div>

                          <div className="ml-4 flex-shrink-0 flow-root">
                            <button
                              type="button"
                              className="-m-2.5 bg-white p-2.5 flex items-center justify-center text-gray-400 hover:text-gray-500"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <span className="sr-only">Remove</span>
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 pt-2 flex items-end justify-between">
                          <p className="mt-1 text-sm font-medium text-gray-900">Rs. {product.price}</p>

                          <div className="ml-4">
                            <label htmlFor={`quantity-${product.id}`} className="sr-only">
                              Quantity
                            </label>
                            <input
                              id={`quantity-${product.id}`}
                              type="number"
                              name="quantity"
                              value={product.quantity}
                              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                              className=" w-20 rounded-md border border-gray-300 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">No items added yet.</p>
            </div>
          )}
                  {/* {products.map((product) => (
                    <li key={product.id} className="flex py-6 px-4 sm:px-6">
                      <div className="flex-shrink-0">
                        <img src={product.imageSrc} alt={product.imageAlt} className="w-20 rounded-md" />
                      </div>

                      <div className="ml-6 flex-1 flex flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <a href={product.href} className="font-medium text-gray-700 hover:text-gray-800">
                                {product.title}
                              </a>
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                            <p className="mt-1 text-sm text-gray-500">{product.size}</p>
                          </div>

                          <div className="ml-4 flex-shrink-0 flow-root">
                            <button
                              type="button"
                              className="-m-2.5 bg-white p-2.5 flex items-center justify-center text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <TrashIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 pt-2 flex items-end justify-between">
                          <p className="mt-1 text-sm font-medium text-gray-900">{product.price}</p>

                          <div className="ml-4">
                            <label htmlFor="quantity" className="sr-only">
                              Quantity
                            </label>
                            <input
                              id="quantity"
                              type="number"
                              name="quantity"
                              defaultValue={1}
                              className=" w-20 rounded-md border border-gray-300 text-base font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))} */}
                </ul>
                <div className="flex shrink-0 gap-2 sm:flex-row w-full p-4">
                <Button variant="outlined" size="sm" onClick={() => setIsModalOpen(true)}>
                  Add Items
                </Button>

                <ItemModal 
                  isOpen={isModalOpen} 
                  onClose={() => setIsModalOpen(false)} 
                  onAdd={handleAddItem}
                />

                </div>
                <dl className="border-t border-gray-200 py-6 px-4 space-y-6 sm:px-6">
                  {/* <div className="flex items-center justify-between">
                    <dt className="text-sm">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">$64.00</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Taxes</dt>
                    <dd className="text-sm font-medium text-gray-900">$5.52</dd>
                  </div> */}
                  <div className="flex items-center justify-between pt-2">
                    <dt className="text-base font-medium">Total</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      Rs. {calculateTotal().toFixed(2)}
                    </dd>
                  </div>
                </dl>

                <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                  <Button
                    type="submit"
                    className="w-full rounded-md shadow-sm py-3 px-4 text-base font-medium "
                  >
                    Confirm order
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

    </div>
  )
}