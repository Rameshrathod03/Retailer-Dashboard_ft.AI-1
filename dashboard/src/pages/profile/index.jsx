import React from 'react';
import { useForm } from 'react-hook-form';
import {db, auth, useAuthState} from '../../firebase'
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ProfileForm = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
      const { uid } = auth.currentUser;
      try {
        const docRef = await setDoc(doc(db, "Retailers", uid), {
          profileInfo: data,
        });
        console.log("Document written with ID: ", uid);

      window.location.href = "/dashboard";

      } catch (e) {
        console.error("Error adding document: ", e);
      }
    };
  
    return (
        <div className=" w-2/3 mx-auto p-8 overflow-scroll">
            <h1 className="text-2xl font-bold mb-8">Business Profile Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("businessName", { required: true })}
                />
                {errors.businessName && <p className="text-red-500 text-xs italic">Business Name is required.</p>}
              </div>
              
              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Business Phone No.</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("businessPhone", { required: true })}
                />
                {errors.businessPhone && <p className="text-red-500 text-xs italic">Business Phone No. is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Owner Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("ownerName", { required: true })}
                />
                {errors.ownerName && <p className="text-red-500 text-xs italic">Owner Name is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Owner Contact</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("ownerContact", { required: true })}
                />
                {errors.ownerContact && <p className="text-red-500 text-xs italic">Owner Contact is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("address", { required: true })}
                />
                {errors.address && <p className="text-red-500 text-xs italic">Address is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("state", { required: true })}
                />
                {errors.state && <p className="text-red-500 text-xs italic">State is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Country</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("country", { required: true })}
                />
                {errors.country && <p className="text-red-500 text-xs italic">Country is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Pincode</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("pincode", { required: true })}
                />
                {errors.pincode && <p className="text-red-500 text-xs italic">Pincode is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">GST No.</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("gstNo", { required: true })}
                />
                {errors.gstNo && <p className="text-red-500 text-xs italic">GST No. is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Description of Business</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("businesssDescription", { required: true })}
                ></textarea>
                {errors.businessDescription && <p className="text-red-500 text-xs italic">Description of Inventory is required.</p>}
              </div>

              <div className="form-control">
                <label className="block text-sm font-medium mb-2">Approx. No. of Purchases per day</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register("purchasesPerDay", { required: true })}
                />
                {errors.purchasesPerDay && <p className="text-red-500 text-xs italic">Approx. No. of Purchases per day is required.</p>}
              </div>

              <div className="form-control">
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Submit
                </button>
              </div>
            </form>
        </div>
    );
}

export default ProfileForm;
