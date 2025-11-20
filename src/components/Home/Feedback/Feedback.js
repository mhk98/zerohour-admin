import React, { useState } from "react";

import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import FeedbackTable from "./FeedbackTable";
import { useCreateFeedbackMutation } from "../../../features/feedback/feedback";

function Feedback() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [createFeedback] = useCreateFeedbackMutation();

  const onFormSubmit = async (data) => {
    console.log("formData", data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("designation", data.designation);
    formData.append("text", data.text);
    formData.append("image", image);

    // If using upload.array('files') or similar in backend

    try {
      const res = await createFeedback(formData);
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
              Feedback
            </h4>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>Feedback</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Left Side */}

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Name
                      </label>
                      <Input
                        type="text"
                        {...register("name")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Designation
                      </label>
                      <Input
                        type="text"
                        {...register("designation")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.designation && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.designation.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Text
                      </label>
                      <Input
                        type="text"
                        {...register("text")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.text && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.text.message}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="font-weight-700">Image</label>
                      <br />
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        style={{ paddingTop: "12px" }}
                        onChange={handleImageChange}
                      />
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
              + Add Feedback
            </button>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      <FeedbackTable />
    </>
  );
}

export default Feedback;
