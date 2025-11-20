import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { LiaEditSolid } from "react-icons/lia";

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
  useDeleteContactMutation,
  useGetAllContactQuery,
  useUpdateContactMutation,
} from "../../../features/contact/contact";

export default function ContactTable() {
  const { data, isLoading, isError, error, refetch } = useGetAllContactQuery();
  const [updateContact] = useUpdateContactMutation();
  const [deleteContact] = useDeleteContactMutation();

  const [contacts, setContacts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isError) {
      console.error("Error fetching contacts:", error);
    } else if (!isLoading && data) {
      setContacts(data?.data || []);
    }
  }, [data, isLoading, isError, error]);

  const openModal = (item = null) => {
    if (item) {
      reset({
        phone: item.phone,
        branch: item.branch,
        location: item.location,
      });
      setSelectedId(item.id);
      setPreviewImage(`http://localhost:5000${item.image}`);
    } else {
      reset();
      setSelectedId(null);
      setPreviewImage(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedId(null);
    setPreviewImage(null);
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = async (formDataInput) => {
    const formData = new FormData();
    formData.append("phone", formDataInput.phone);
    formData.append("branch", formDataInput.branch);
    formData.append("location", formDataInput.location);
    if (image) formData.append("image", image);

    try {
      const res = await updateContact({ id: selectedId, data: formData });
      if (res.data?.success) {
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
    if (!window.confirm("Are you sure you want to delete this contact?"))
      return;

    try {
      const res = await deleteContact(id);
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

  return (
    <div className="w-full px-4 py-6 bg-gray-50">
      <div className="overflow-x-auto p-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr className="text-left">
                <th className="p-3">Phone</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Location</th>
                <th className="p-3">Image</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length > 0 ? (
                contacts.map((item, idx) => (
                  <tr
                    key={item._id}
                    className={`text-sm border-t border-gray-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">{item.phone}</td>
                    <td className="p-3 whitespace-nowrap">{item.branch}</td>
                    <td className="p-3 whitespace-nowrap">{item.location}</td>
                    <td className="p-3 whitespace-nowrap">
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.branch}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
                      <LiaEditSolid
                        className="cursor-pointer"
                        onClick={() => openModal(item)}
                      />
                      <FaTrash
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDelete(item.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No contacts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit/Create Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>{selectedId ? "Edit Contact" : "Add Contact"}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Phone
                </label>
                <Input
                  type="text"
                  {...register("phone", { required: "Phone is required" })}
                  onKeyDown={handleEnter}
                  className="shadow-md p-3"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Branch
                </label>
                <Input
                  type="text"
                  {...register("branch", { required: "Branch is required" })}
                  onKeyDown={handleEnter}
                  className="shadow-md p-3"
                />
                {errors.branch && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Location
                </label>
                <Input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  onKeyDown={handleEnter}
                  className="shadow-md p-3"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-16 h-16 object-cover mt-2 rounded"
                  />
                )}
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
