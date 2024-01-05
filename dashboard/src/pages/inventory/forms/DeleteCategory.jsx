import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth, useAuthState } from '../../../firebase';
import { collection, addDoc, setDoc, doc, query, where, getDocs, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const DeleteCategory = () => {
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
            // Step 1: Get the category document reference based on the selected category name
            const categoryRef = collection(db, "Retailers", uid, "categories");
            const categoryQuery = query(categoryRef, where("categoryName", "==", data.category));
            const categorySnapshot = await getDocs(categoryQuery);
    
            if (!categorySnapshot.empty) {
                const categoryDoc = categorySnapshot.docs[0];
                const categoryDocRef = doc(db, "Retailers", uid, "categories", categoryDoc.id);
    
                // Optional Step 2: Update items if they store category references
                // If your items have a reference to the category, update them here.
                // This step depends on your data model.
                // Example (assuming each item has a 'category' field):
                
                const itemsRef = collection(db, "Retailers", uid, "items");
                const itemsQuery = query(itemsRef, where("category", "==", data.category));
                const itemsSnapshot = await getDocs(itemsQuery);
                itemsSnapshot.forEach(async (itemDoc) => {
                    const itemDocRef = doc(db, "Retailers", uid, "items", itemDoc.id);
                    await updateDoc(itemDocRef, {
                        category: "No Category" // or remove the category field
                    });
                });
                
    
                // Step 3: Delete the category document
                await deleteDoc(categoryDocRef);
            }
    
            window.location.href = "/inventory"; // Redirect after operation
        } catch (e) {
            console.error("Error in deleting category: ", e);
        }
    };
    
    

    return (
        <div className=" w-2/3 mx-auto p-8 overflow-scroll">
            <h1 className="text-2xl font-bold mb-8">Delete Category</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                

                <div className="form-control">
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DeleteCategory;
