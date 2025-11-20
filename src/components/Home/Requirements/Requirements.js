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
import { useCreateRequirementsMutation } from "../../../features/requirements/requirements";
import RequirementsTable from "./RequirementsTable";

function Requirements() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  console.log("image", image);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [createRequirements] = useCreateRequirementsMutation();

  const onFormSubmit = async (formData) => {
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("text", formData.text); // এটা বাদ ছিল
    payload.append("requirements", formData.requirements);
    payload.append("programs", formData.programs);
    payload.append("IELTS", formData.IELTS);
    payload.append("solvency", formData.solvency);
    payload.append("processing", formData.processing);
    payload.append("scholarships", formData.scholarships);
    if (image) payload.append("image", image);

    try {
      const res = await createRequirements(payload); // ✅ FormData পাঠানো হয়েছে
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
              Requirements
            </h4>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>Requirements</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <label className="font-weight-700">Icon</label>
                      <br />
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        style={{ paddingTop: "12px" }}
                        onChange={handleImageChange}
                      />
                      {/* <input type="file" accept="application/pdf" onChange={handleImageChange} /> */}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Requirements
                      </label>
                      <Input
                        type="text"
                        {...register("requirements")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.requirements && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.requirements.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Programs
                      </label>
                      <Input
                        type="text"
                        {...register("programs")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.programs && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.programs.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        IELTS
                      </label>
                      <Input
                        type="text"
                        {...register("IELTS")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.IELTS && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.IELTS.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Solvency
                      </label>
                      <Input
                        type="text"
                        {...register("solvency")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.solvency && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.solvency.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Processing
                      </label>
                      <Input
                        type="text"
                        {...register("processing")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.processing && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.processing.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Scholarships
                      </label>
                      <Input
                        type="text"
                        {...register("scholarships")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.scholarships && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.scholarships.message}
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
              + Add Requirements
            </button>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      <RequirementsTable />
    </>
  );
}

export default Requirements;
