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
import { useCreateCustomizeMutation } from "../../../features/customize/customize";
import CustomizeTable from "./CustomizeTable";

function Customize() {
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

  const [createCustomize] = useCreateCustomizeMutation();

  const onFormSubmit = async (data) => {
    console.log("formData", data);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("subTitle1", data.subTitle1);
    formData.append("subText1", data.subText1);
    formData.append("subTitle2", data.subTitle2);
    formData.append("subText2", data.subText2);
    formData.append("subTitle3", data.subTitle3);
    formData.append("subText3", data.subText3);
    formData.append("image", image);

    // If using upload.array('files') or similar in backend

    try {
      const res = await createCustomize(formData);
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
              Customize
            </h4>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>Customize</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtitle 1
                      </label>
                      <Input
                        type="text"
                        {...register("subTitle1")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.subTitle1 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subTitle1.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtext 1
                      </label>
                      <textarea
                        rows={4}
                        {...register("subText1")}
                        className="textarea textarea-bordered w-full shadow-md p-3"
                      ></textarea>
                      {errors.subText1 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subText1.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtitle 2
                      </label>
                      <Input
                        type="text"
                        {...register("subTitle2")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.subTitle2 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subTitle2.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtext 2
                      </label>
                      <textarea
                        rows={4}
                        {...register("subText2")}
                        className="textarea textarea-bordered w-full shadow-md p-3"
                      ></textarea>
                      {errors.subText2 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subText2.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtitle 3
                      </label>
                      <Input
                        type="text"
                        {...register("subTitle3")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.subTitle3 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subTitle3.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Subtext 3
                      </label>
                      <textarea
                        rows={4}
                        {...register("subText3")}
                        className="textarea textarea-bordered w-full shadow-md p-3"
                      ></textarea>
                      {errors.subText3 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.subText3.message}
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
                      {/* <input type="file" accept="application/pdf" onChange={handleImageChange} /> */}
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
              + Add Customize
            </button>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      <CustomizeTable />
    </>
  );
}

export default Customize;
