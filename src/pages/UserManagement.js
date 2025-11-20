import React, { useState, useEffect } from "react";
import UserManagementFilter from "../components/UserManagement/UserManagementFilter";

import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useUserRegisterMutation } from "../features/auth/auth";

function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function closeModal() {
    setIsModalOpen(false);
  }

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [userRegister] = useUserRegisterMutation();

  const First_Name = localStorage.getItem("FirstName");
  const Last_Name = localStorage.getItem("LastName");

  const onFormSubmit = async (data) => {
    console.log("formData", data);
    const formData = new FormData();
    formData.append("FirstName", data.FirstName);
    formData.append("LastName", data.LastName);
    formData.append("Email", data.Email);
    formData.append("Password", data.Password);
    formData.append("Phone", data.Phone);
    formData.append("Role", data.Role);

    if (file) {
      formData.append("image", file);
    }

    try {
      const res = await userRegister(formData);
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
              User Management
            </h4>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalHeader>User Management</ModalHeader>
              <ModalBody>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Side */}

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        First Name
                      </label>
                      <Input
                        type="text"
                        {...register("FirstName")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.FirstName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.FirstName.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Last Name
                      </label>
                      <Input
                        type="text"
                        {...register("LastName")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.LastName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.LastName.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Mobile Number
                      </label>
                      <Input
                        type="number"
                        {...register("Phone")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.Phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.Phone.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Email
                      </label>
                      <Input
                        type="email"
                        {...register("Email")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.Email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm mb-1 text-gray-700">
                        Password
                      </label>
                      <Input
                        type="password"
                        {...register("Password")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full form-control shadow-md p-3"
                      />
                      {errors.Password && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.Password.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        {...register("Role")}
                        onKeyDown={handleEnter}
                        className="input input-bordered w-full p-2 border border-gray-300"
                      >
                        <option value="">Select Role</option>
                        <option value="student">User</option>
                        <option value="admin">Admin</option>
                        <option value="superAdmin">Super Admin</option>
                      </select>

                      {errors.Role && (
                        <p className="text-red-500 text-sm">
                          {errors.Role.message}
                        </p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="font-weight-700">Profile Image</label>
                      <input
                        onKeyDown={handleEnter}
                        type="file"
                        accept="image/*"
                        className="form-control"
                        style={{ paddingTop: "12px" }}
                        onChange={handleFileChange}
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
              + Add New User
            </button>
          </div>
        </div>
      </div>
      {/* <CTA /> */}

      <UserManagementFilter />
      {/* <UserManagementTable/> */}
    </>
  );
}

export default UserManagement;
