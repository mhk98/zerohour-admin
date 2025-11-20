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
import FeatureTable from "./FeatureTable";
import { useCreateFeatureMutation } from "../../../features/feature/feature";

function Feature() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState(null);

  const [createFeature] = useCreateFeatureMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return;
    }
    setImage(file);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  const onFormSubmit = async (data) => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("image", image);

    try {
      const res = await createFeature(formData).unwrap();
      toast.success(res.message);
      reset();
      setImage(null);
      closeModal();
    } catch (error) {
      toast.error(error?.data?.message || "An unexpected error occurred");
    }
  };

  return (
    <>
      <div className="w-full px-4 py-6 bg-gray-50">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Header Section */}
          <div>
            <h4 className="text-2xl md:text-md font-semibold text-gray-900">
              Feature
            </h4>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>Feature</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Title
                      </label>
                      <Input
                        type="text"
                        {...register("title", {
                          required: "Title is required",
                        })}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Text
                      </label>
                      <Input
                        type="text"
                        {...register("text", { required: "Text is required" })}
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
                      <label className="block text-sm mb-1 text-gray-700">
                        Image
                      </label>
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
              + Add Feature
            </button>
          </div>
        </div>
      </div>

      {/* Table showing features */}
      <FeatureTable />
    </>
  );
}

export default Feature;
