import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  useDeleteCategoryMutation,
  useGetAllCategoryQuery,
  useUpdateCategoryMutation,
} from "../../features/category/category";
import { LiaEditSolid } from "react-icons/lia";

export default function CategoryTable() {
  const { data, isLoading, isError, error, refetch } = useGetAllCategoryQuery();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [features, setFeatures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [image, setImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isError) {
      console.log("Error fetching", error);
    } else if (!isLoading && data) {
      setFeatures(data?.data || []);
    }
  }, [data, isLoading, isError, error]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const openModal = (item = null) => {
    if (item) {
      reset({ title: item.title, text: item.text });
      setSelectedId(item.categoryId);
    } else {
      reset();
      setSelectedId(null);
    }
    setImage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedId(null);
    setImage(null);
  };

  const onFormSubmit = async (formData) => {
    const payload = new FormData();
    payload.append("categoryTitle", formData.title);
    payload.append("mega", true);
    if (image) payload.append("default_image", image);

    try {
      console.log("selectedId", selectedId);
      const res = await updateCategory({ id: selectedId, data: payload });
      if (res.data?.success === true) {
        toast.success(res.data.message);
        refetch();
        closeModal();
      } else {
        toast.error(res.error?.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feature?"))
      return;

    try {
      const res = await deleteCategory(id);
      if (res.data?.success) {
        toast.success(res.data.message);
        refetch();
      } else {
        toast.error(res.error?.data?.message || "Delete failed");
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  console.log("category", features);

  return (
    <div className="w-full px-4 py-6 bg-gray-50">
      <div>
        {/* <h4 className="text-2xl md:text-md font-semibold text-gray-900">
          Category
        </h4> */}
        <p className="text-sm text-gray-500 mt-1"></p>
      </div>

      <div className="overflow-x-auto p-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr className="text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Image</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {features.length > 0 ? (
                features.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={`text-sm border-t border-gray-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">{item.text}</td>
                    <td className="p-3 whitespace-nowrap">
                      {item.icon ? (
                        <img
                          className="w-10 h-10 object-cover"
                          src={`https://zerohour-backend.onrender.com/${item.icon}`}
                          alt="Feature"
                        />
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
                      <LiaEditSolid
                        className="cursor-pointer"
                        onClick={() => openModal(item)}
                      />
                      <FaTrash
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDelete(item.categoryId)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No category found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>{selectedId ? "Edit Feature" : "Add Feature"}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Title
                </label>
                <Input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  onKeyDown={handleEnter}
                  className="shadow-md p-3"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control pt-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="submit" className="bg-brandRed text-white">
                Submit
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
