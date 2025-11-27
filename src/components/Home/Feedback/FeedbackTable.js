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
  useDeleteFeedbackMutation,
  useGetAllFeedbackQuery,
  useUpdateFeedbackMutation,
} from "../../../features/feedback/feedback";

export default function FeedbackTable() {
  const { data, isLoading, isError, error, refetch } = useGetAllFeedbackQuery();
  const [updateFeedback] = useUpdateFeedbackMutation();
  const [deleteFeedback] = useDeleteFeedbackMutation();

  const [feedbackList, setFeedbackList] = useState([]);
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
      console.error("Error fetching feedback:", error);
    } else if (!isLoading && data) {
      setFeedbackList(data?.data || []);
    }
  }, [data, isLoading, isError, error]);

  const openModal = (item = null) => {
    if (item) {
      reset({
        name: item.name,
        designation: item.designation,
        text: item.text,
      });
      setSelectedId(item.id);
      setPreviewImage(`https://zerohour-backend.onrender.com${item.image}`);
    } else {
      reset();
      setSelectedId(null);
      setPreviewImage(null);
    }
    setImage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedId(null);
    setImage(null);
    setPreviewImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onFormSubmit = async (formData) => {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("designation", formData.designation);
    payload.append("text", formData.text);
    if (image) payload.append("image", image);

    try {
      const res = await updateFeedback({ id: selectedId, data: payload });
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
    if (!window.confirm("Are you sure you want to delete this feedback?"))
      return;

    try {
      const res = await deleteFeedback(id);
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
      <div>
        <h4 className="text-2xl md:text-md font-semibold text-gray-900">
          Feedback
        </h4>
      </div>

      <div className="overflow-x-auto p-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr className="text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Designation</th>
                <th className="p-3">Text</th>
                <th className="p-3">Image</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.length > 0 ? (
                feedbackList.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`text-sm border-t border-gray-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">{item.name}</td>
                    <td className="p-3 whitespace-nowrap">
                      {item.designation}
                    </td>
                    <td className="p-3 whitespace-nowrap">{item.text}</td>
                    <td className="p-3 whitespace-nowrap">
                      <img
                        src={`https://zerohour-backend.onrender.com${item.image}`}
                        alt={item.name}
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
                    No feedback found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>
          {selectedId ? "Edit Feedback" : "Add Feedback"}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Name</label>
                <Input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  onKeyDown={handleEnter}
                  className="shadow-md p-3"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Designation
                </label>
                <Input
                  type="text"
                  {...register("designation", {
                    required: "Designation is required",
                  })}
                  onKeyDown={handleEnter}
                  className="shadow-md p-3"
                />
                {errors.designation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.designation.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">Text</label>
                <Input
                  type="text"
                  {...register("text", { required: "Text is required" })}
                  onKeyDown={handleEnter}
                  className="shadow-md p-3"
                />
                {errors.text && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.text.message}
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
