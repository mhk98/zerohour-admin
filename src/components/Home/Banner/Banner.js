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
import BannerTable from "./BannerTable";
import { useCreateBannerMutation } from "../../../features/banner/banner";

function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files); // FileList object
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [createBanner] = useCreateBannerMutation();

  const onFormSubmit = async (data) => {
    console.log("formData", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("text", data.text);

    // If using upload.array('files') or similar in backend
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await createBanner(formData);
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
              Banner
            </h4>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>Banner</ModalHeader>
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
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Text
                      </label>
                      <textarea
                        rows={4}
                        {...register("text")}
                        className="textarea textarea-bordered w-full shadow-md p-3"
                      ></textarea>
                      {errors.text && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.text.message}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="block text-sm mb-1 text-gray-700">
                        Banner Image
                      </label>
                      <input
                        name="files"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <Button type="submit" className="btn bg-brandRed">
                      Save
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
              + Add New Banner
            </button>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      <BannerTable />
      {/* <UserManagementTable/> */}
    </>
  );
}

export default Banner;
