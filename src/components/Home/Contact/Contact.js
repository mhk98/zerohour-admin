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
import ContactTable from "./ContactTable";
import { useCreateContactMutation } from "../../../features/contact/contact";

function Contact() {
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

  const [createContact] = useCreateContactMutation();

  const onFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("phone", data.phone);
    formData.append("location", data.location);
    formData.append("branch", data.branch);
    formData.append("image", image);
    try {
      const res = await createContact(formData);
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
              Contact
            </h4>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>Contact</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Left Side */}

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Phone
                      </label>
                      <Input
                        type="text"
                        {...register("phone")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
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
                        {...register("branch")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
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
                        {...register("location")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.location.message}
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
              + Add Contact
            </button>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      <ContactTable />
    </>
  );
}

export default Contact;
