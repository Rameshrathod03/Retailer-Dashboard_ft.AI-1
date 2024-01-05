import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth, useAuthState } from '../../../firebase';
import { collection, addDoc, setDoc, doc, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const AddItem = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

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

    const onSubmit = async (data) => {
        const { uid } = auth.currentUser;
        try {
            const itemId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
            const itemData = { ...data, id: itemId }; // Include the unique ID in the item data

            const collectionRef = collection(db, "Retailers", uid, "items");
            const docRef = await addDoc(collectionRef, itemData);
            console.log("Document written with ID: ", docRef.id);

            const categoryRef = collection(db, "Retailers", uid, "categories");
            const categoryQuery = query(categoryRef, where("categoryName", "==", data.category));
            const categorySnapshot = await getDocs(categoryQuery);

            const categoryId = categorySnapshot.docs[0].id;
            const categoryDocRef = doc(db, "Retailers", uid, "categories", categoryId);
            await updateDoc(categoryDocRef, {
                items: arrayUnion(docRef.id)
            });

            window.location.href = "/inventory";
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div className=" w-2/3 mx-auto p-8 overflow-scroll">
            <h1 className="text-2xl font-bold mb-8">Add Item</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div className="form-control">
                    <label className="block text-sm font-medium mb-2">Item Name</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register("itemName", { required: true })}
                    />
                    {errors.itemName && <p className="text-red-500 text-xs italic">Item Name is required.</p>}
                </div>

                <div className="form-control">
                    <label className="block text-sm font-medium mb-2">Description of Item</label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register("itemDescription", { required: true })}
                    ></textarea>
                    {errors.itemDescription && <p className="text-red-500 text-xs italic">Description of Item is required.</p>}
                </div>

                <div className="form-control">
                    <label className="block text-sm font-medium mb-2">Price (in Rs.)</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register("price", { required: true })}
                    />
                    {errors.price && <p className="text-red-500 text-xs italic">Price is required</p>}
                </div>

                <div className="form-control">
                    <label className="block text-sm font-medium mb-2">Units in Inventory</label>
                    <input
                        type="number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register("unitsInInventory", { required: true })}
                    />
                    {errors.unitsInInventory && <p className="text-red-500 text-xs italic">Units in Inventory is required</p>}
                </div>

                <div className="form-control">
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register("category", { required: true })}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.categoryName} value={category.categoryName}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs italic">Category is required</p>}
                </div>
                <a href="/add-category" className=' text-xs text-white bg-black rounded-md p-1'>Add New Category</a>

                <div className="form-control">
                    <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddItem;
