import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import {
    collection, getDocs, query, where, updateDoc, deleteDoc, arrayRemove
} from "firebase/firestore";

const EditItem = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [categories, setCategories] = useState([]);
    const { itemId } = useParams(); // Assuming itemId is passed via URL

    useEffect(() => {
        const fetchCategoriesAndItem = async () => {
            const { uid } = auth.currentUser;

            // Fetch categories
            const categoriesRef = collection(db, "Retailers", uid, "categories");
            const categoriesSnapshot = await getDocs(categoriesRef);
            setCategories(categoriesSnapshot.docs.map(doc => doc.data()));

            // Fetch item data based on itemId field
            const itemsRef = collection(db, "Retailers", uid, "items");
            const itemQuery = query(itemsRef, where("id", "==", itemId));
            const itemSnapshot = await getDocs(itemQuery);

            if (!itemSnapshot.empty) {
                const itemData = itemSnapshot.docs[0].data();
                setValue("itemName", itemData.itemName);
                setValue("itemDescription", itemData.itemDescription);
                setValue("price", itemData.price);
                setValue("unitsInInventory", itemData.unitsInInventory);
                setValue("category", itemData.category);
            }
        };

        fetchCategoriesAndItem();
    }, [itemId, setValue]);

    const onSubmit = async (data) => {
        const { uid } = auth.currentUser;
        try {
            const itemsRef = collection(db, "Retailers", uid, "items");
            const itemQuery = query(itemsRef, where("id", "==", itemId));
            const itemSnapshot = await getDocs(itemQuery);

            if (!itemSnapshot.empty) {
                const itemDocRef = itemSnapshot.docs[0].ref;
                await updateDoc(itemDocRef, data);
            }

            window.location.href = "/inventory";
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    };

    const deleteItem = async () => {
        const { uid } = auth.currentUser;
        try {
            const itemsRef = collection(db, "Retailers", uid, "items");
            const itemQuery = query(itemsRef, where("id", "==", itemId));
            const itemSnapshot = await getDocs(itemQuery);
    
            if (!itemSnapshot.empty) {
                const itemDoc = itemSnapshot.docs[0];
                const itemDocRef = itemDoc.ref;
    
                // itemDoc.id will give you the Firestore document ID
                const itemFirestoreId = itemDoc.id;
                const itemData = itemDoc.data();
    
                // Update category document only if category is not "No Category"
                if (itemData.category && itemData.category !== "No Category") {
                    const categoriesRef = collection(db, "Retailers", uid, "categories");
                    const categoryQuery = query(categoriesRef, where("categoryName", "==", itemData.category));
                    const categorySnapshot = await getDocs(categoryQuery);
    
                    if (!categorySnapshot.empty) {
                        const categoryDocRef = categorySnapshot.docs[0].ref;
                        await updateDoc(categoryDocRef, {
                            items: arrayRemove(itemFirestoreId)
                        });
                    }
                }
    
                // Delete the item document
                await deleteDoc(itemDocRef);
            }
    
            window.location.href = "/inventory";
        } catch (e) {
            console.error("Error deleting item: ", e);
        }
    };    

    return (
        <div className="w-2/3 mx-auto p-8 overflow-scroll">
            <h1 className="text-2xl font-bold mb-8">Edit Item</h1>
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
                        {...register("category", { required: false })}
                    >
                        <option value="">Select a category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.categoryName}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-xs italic">Category is required</p>}
                </div>

                <a href="/add-category" className='text-xs text-white bg-black rounded-md p-1'>Add New Category</a>

                <div className="flex justify-between">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Update
                    </button>
                    <button type="button" onClick={deleteItem} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditItem;
