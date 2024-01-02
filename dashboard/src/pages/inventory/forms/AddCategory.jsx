import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db, auth, useAuthState } from '../../../firebase';
import { collection, addDoc, setDoc, doc, query, where, getDocs, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { v4 as uuidv4 } from 'uuid';

const AddCategory = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { uid } = auth.currentUser;
        try {
            const categoryData = { categoryName: data.categoryName, categoryDescription: data.categoryDescription, items:{} };
            const categoryCollectionRef = collection(db, "Retailers", uid, "categories");
            const categoryDocRef = await addDoc(categoryCollectionRef, categoryData);
            console.log("Category document written with ID: ", categoryDocRef.id);

            window.location.href = "/inventory";
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    return (
        <div className=" w-2/3 mx-auto p-8 overflow-scroll">
            <h1 className="text-2xl font-bold mb-8">Add Category</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                <div className="form-control">
                    <label className="block text-sm font-medium mb-2">Category Name</label>
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register("categoryName", { required: true })}
                    />
                    {errors.categoryName && <p className="text-red-500 text-xs italic">Category Name is required.</p>}
                </div>

                <div className="form-control">
                    <label className="block text-sm font-medium mb-2">Description of Category</label>
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        {...register("categoryDescription", { required: true })}
                    ></textarea>
                    {errors.categoryDescription && <p className="text-red-500 text-xs italic">Description of Category is required.</p>}
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

export default AddCategory;
