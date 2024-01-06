import React, { useState, useEffect } from "react";
import { db, auth } from '../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

const Marketing = () => {

  const [marketingData, setMarketingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalMessagesSent, setTotalMessagesSent] = useState(0);
  const [totalUsersReached, setTotalUsersReached] = useState(0);
  const [scheduledMessages, setScheduledMessages] = useState(0); 

  const fetchMarketingData = async () => {
    const uid = auth.currentUser.uid; // Get the current user's UID
    const marketingRef = collection(db, `Retailers/${uid}/marketing`);
    const marketingSnapshot = await getDocs(marketingRef);

    const marketingList = [];
    marketingSnapshot.forEach((doc) => {
      const data = doc.data();
      const phoneNumber = doc.id;
      const email = data.email; // Assuming email is stored at this path
      const marketingInfo = data.Marketing;

      for (const key in marketingInfo) {
        if (marketingInfo.hasOwnProperty(key)) {
          marketingList.push({
            phoneNumber: phoneNumber,
            email: email,
            ...marketingInfo[key]
          });
        }
      }
    });

    setMarketingData(marketingList);
    setLoading(false);
  };

  const fetchMarketingStats = async () => {
    const uid = auth.currentUser.uid;
    const marketingRef = collection(db, `Retailers/${uid}/marketing`);
    const marketingSnapshot = await getDocs(marketingRef);

    let messagesSent = 0;
    let usersReached = 0;
    let scheduled = 0; // Variable for scheduled messages

    const marketingList = [];
    marketingSnapshot.forEach((doc) => {
      usersReached += 1;

      const phoneNumber = doc.id;
      const email = doc.data().email; // Assuming email is stored at this path
      const marketingInfo = doc.data().Marketing;
      
      for (const key in marketingInfo) {
        if (marketingInfo.hasOwnProperty(key)) {
          const marketingEntry = marketingInfo[key];
          if (marketingEntry.Status === true) {
            messagesSent += 1;
          } else {
            scheduled += 1; // Increment for scheduled messages
          }
          marketingList.push({
            phoneNumber: phoneNumber,
            email: email,
            ...marketingEntry
          });
        }
      }
    });

    setTotalMessagesSent(messagesSent);
    setTotalUsersReached(usersReached);
    setScheduledMessages(scheduled); // Set the count for scheduled messages
    setMarketingData(marketingList);
    setLoading(false);
  };


  useEffect(() => {
    fetchMarketingData();
    fetchMarketingStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSend = async (id, phoneNumber, email) => {
    try {
      const accessToken = await auth.currentUser.getIdToken();
      const uid = auth.currentUser.uid;

      const response = await fetch(`http://127.0.0.1:8000/api/marketing/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary headers, like authentication tokens
        },
        body: JSON.stringify({ id, phoneNumber, email, uid, accessToken }),
      });

      if (response.ok) {
        console.log('Message sent successfully');
        alert('Sent successfully!');
        window.location.reload();
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) {
      return text;
    }
    return text.substring(0, limit) + '...';
  };

  return <div>
    <div class="m-6">
      <div class="flex flex-wrap -mx-6">
            <div class="w-full px-6 sm:w-1/2 xl:w-1/3">
                <div class="flex items-center px-5 py-6 shadow-md rounded-lg bg-slate-100">
                    <div class="p-3 rounded-full bg-black bg-opacity-75">
                        <svg class="h-8 w-8 text-white" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
                                fill="currentColor"></path>
                            <path
                                d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                                fill="currentColor"></path>
                            <path
                                d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                                fill="currentColor"></path>
                            <path
                                d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                                fill="currentColor"></path>
                            <path
                                d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                                fill="currentColor"></path>
                            <path
                                d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                                fill="currentColor"></path>
                        </svg>
                    </div>

                    <div class="mx-5">
                        <h4 class="text-2xl ">{totalMessagesSent}</h4>
                        <div class="text-gray-500">Mails Sent</div>
                    </div>
                </div>
            </div>

            <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                <div class="flex items-center px-5 py-6 shadow-md rounded-lg bg-slate-100">
                    <div class="p-3 rounded-full bg-black bg-opacity-75">
                        <svg class="h-8 w-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z"
                                fill="currentColor"></path>
                            <path
                                d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z"
                                fill="currentColor"></path>
                            <path
                                d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z"
                                fill="currentColor"></path>
                        </svg>
                    </div>

                    <div class="mx-5">
                        <h4 class="text-2xl ">{totalUsersReached}</h4>
                        <div class="text-gray-500">Users Reached</div>
                    </div>
                </div>
            </div>

            {/* <div class="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                <div class="flex items-center px-5 py-6 shadow-md rounded-lg bg-slate-100">
                    <div class="p-3 rounded-full bg-black bg-opacity-75">
                        <svg class="h-8 w-8 text-white" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4.19999 1.4C3.4268 1.4 2.79999 2.02681 2.79999 2.8C2.79999 3.57319 3.4268 4.2 4.19999 4.2H5.9069L6.33468 5.91114C6.33917 5.93092 6.34409 5.95055 6.34941 5.97001L8.24953 13.5705L6.99992 14.8201C5.23602 16.584 6.48528 19.6 8.97981 19.6H21C21.7731 19.6 22.4 18.9732 22.4 18.2C22.4 17.4268 21.7731 16.8 21 16.8H8.97983L10.3798 15.4H19.6C20.1303 15.4 20.615 15.1004 20.8521 14.6261L25.0521 6.22609C25.2691 5.79212 25.246 5.27673 24.991 4.86398C24.7357 4.45123 24.2852 4.2 23.8 4.2H8.79308L8.35818 2.46044C8.20238 1.83722 7.64241 1.4 6.99999 1.4H4.19999Z"
                                fill="currentColor"></path>
                            <path
                                d="M22.4 23.1C22.4 24.2598 21.4598 25.2 20.3 25.2C19.1403 25.2 18.2 24.2598 18.2 23.1C18.2 21.9402 19.1403 21 20.3 21C21.4598 21 22.4 21.9402 22.4 23.1Z"
                                fill="currentColor"></path>
                            <path
                                d="M9.1 25.2C10.2598 25.2 11.2 24.2598 11.2 23.1C11.2 21.9402 10.2598 21 9.1 21C7.9402 21 7 21.9402 7 23.1C7 24.2598 7.9402 25.2 9.1 25.2Z"
                                fill="currentColor"></path>
                        </svg>
                    </div>

                    <div class="mx-5">
                        <h4 class="text-2xl ">{scheduledMessages}</h4>
                        <div class="text-gray-500">Scheduled Messages</div>
                    </div>
                </div>
            </div> */}
      </div>
      <div className=" pt-6">
            <div className="w-full overflow-x-auto relative">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="py-3 px-6">Phone Number</th>
                        <th scope="col" className="py-3 px-6">Content</th>
                        <th scope="col" className="py-3 px-6">Status</th>
                        <th scope="col" className="py-3 px-6">Send</th>
                    </tr>
                    </thead>
                    <tbody>
                    {marketingData
                      .sort((a, b) => {
                        // If both items have the same status, keep their original order
                        if (a.Status === b.Status) return 0;
                        // If the first item is sent and the second is not, move the first item to the end
                        if (a.Status && !b.Status) return 1;
                        // Otherwise, move the second item to the end
                        return -1;
                      })
                      .map((item, index) => (
                        <tr key={index} className="bg-white border-b">
                          <td className="py-4 px-6">
                            <a href={`http://localhost:3000/customers/${item.phoneNumber}`} target="_blank" rel="noopener noreferrer" className="text-blue-300">
                              {item.phoneNumber}
                            </a>
                          </td>
                          <td className="py-4 px-6">{item.Content}</td>
                          <td className="py-4 px-6">{item.Status ? "Sent" : "Pending"}</td>
                          <td className="py-4 px-6">
                            <button 
                              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${item.Status ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => handleSend(item.id, item.phoneNumber, item.email)}
                              disabled={item.Status} // Disable button if status is true
                            >
                              Send
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
            </div>
      </div>
    </div>
</div>;
}

export default Marketing;