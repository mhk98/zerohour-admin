import React, { useEffect, useState } from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SubCategoryTable from "./SubCategoryTable";
import { useCreateSubCategoryMutation } from "../../features/subCategory/subCategory";
import { useGetAllSubCategoryHeadingsQuery } from "../../features/subCategoryHeading/subCategoryHeading";
import { useGetAllCategoryQuery } from "../../features/category/category";

function SubCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [createSubCategory] = useCreateSubCategoryMutation();

  const onFormSubmit = async (data) => {
    const payload = {
      subCategoryItemTitle: data.title,
      category_id: data.category_id,
      subCategory_id: data.subCategory_id,
    };

    // If using upload.array('files') or similar in backend

    try {
      const res = await createSubCategory(payload);
      if (res.data?.success) {
        toast.success(res.data.message);
        reset();
        setIsModalOpen(false);
      } else {
        toast.error(res.error?.data?.message || "Failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  const { data, isLoading, isError, error } = useGetAllCategoryQuery();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (isError) {
      console.log("Error fetching", error);
    } else if (!isLoading && data) {
      setCategories(data?.data || []);
    }
  }, [data, isLoading, isError, error]);

  const [subCategories, setSubCategories] = useState([]);

  const {
    data: data1,
    isLoading: isLoading1,
    isError: isError1,
    error: error1,
    refetch: refetch1,
  } = useGetAllSubCategoryHeadingsQuery();

  useEffect(() => {
    if (isError1) {
      console.log("Error fetching", error1);
    } else if (!isLoading1 && data1) {
      setSubCategories(data1?.data || []);
    }
  }, [data1, isLoading1, isError1, error1]);
  console.log("categories", categories);
  console.log("subCategories", subCategories);

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <>
      {/* <PageTitle>Dashboard</PageTitle> */}
      <div className="w-full px-4 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Header Section */}
          <div>
            <h4 className="text-2xl md:text-md font-semibold text-gray-900">
              Sub Category
            </h4>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader> Sub Category</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Left Side */}

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Title
                      </label>
                      <Input
                        type="text"
                        {...register("title")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1 text-gray-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("category_id", {
                          required: "Category is required",
                        })}
                        className="input input-bordered w-full p-2 border border-gray-300"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option
                            key={category.categoryId}
                            value={category.categoryId}
                          >
                            {category.text}
                          </option>
                        ))}
                      </select>
                      {errors.category_id && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.category_id.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1 text-gray-700">
                        Sub Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register("subCategory_id", {
                          required: "Sub Category is required",
                        })}
                        className="input input-bordered w-full p-2 border border-gray-300"
                      >
                        <option value="">Select Sub Category</option>
                        {subCategories.map((subCategory) => (
                          <option
                            key={subCategory.subCategoryId}
                            value={subCategory.subCategoryId}
                          >
                            {subCategory.subCategoryHeading}
                          </option>
                        ))}
                      </select>
                      {errors.subCategory_id && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subCategory_id.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" className="btn bg-brandRed">
                      Submit
                    </Button>
                  </div>
                </form>
              </ModalBody>
            </Modal>
          </div>

          {/* Right Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition"
            >
              + Add Sub Category
            </button>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      <SubCategoryTable />
    </>
  );
}

export default SubCategory;
