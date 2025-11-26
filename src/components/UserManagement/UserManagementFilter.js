import React, { useEffect, useState } from "react";
import {
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "@windmill/react-ui";
import {
  useDeleteUserMutation,
  useGetAllUserQuery,
  useUpdateUserMutation,
} from "../../features/auth/auth";
import toast from "react-hot-toast";
import { BiSolidTrashAlt } from "react-icons/bi";
import { LiaEditSolid } from "react-icons/lia";
import { useForm } from "react-hook-form";

const UserManagementFilter = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagesPerSet, setPagesPerSet] = useState(10);
  const [itemsPerPage] = useState(10);

  // Search input states
  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");

  const [searchActive, setSearchActive] = useState(false);

  // Filtered query states
  const [searchFilter, setSearchFilter] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
  });

  const { data, isLoading, isError, error, refetch } = useGetAllUserQuery(
    {
      ...(searchActive ? searchFilter : {}),
      page: currentPage,
      limit: itemsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setPagesPerSet(5);
      else if (window.innerWidth < 1024) setPagesPerSet(7);
      else setPagesPerSet(10);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching user data", error);
    } else if (!isLoading && data) {
      setUsers(data.data);
      setTotalPages(Math.ceil(data.meta.total / itemsPerPage));
    }
  }, [data, isLoading, isError, error, itemsPerPage]);

  console.log("users", users);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  const [userId, setUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFormEdit = async (formData) => {
    try {
      const res = await updateUser({ id: userId, data: formData });
      if (res.data?.success) {
        toast.success(res.data.message);
        refetch();
        setIsModalOpen(false);
      } else {
        toast.error(res.error?.data?.message || "Update failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const res = await deleteUser(id);
      if (res.data?.success) {
        toast.success(res.data.message);
        refetch();
      } else {
        toast.error(res.error?.data?.message || "Deletion failed.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setStartPage(1);
    setSearchActive(true);
    setSearchFilter({
      FirstName: firstNameInput,
      LastName: lastNameInput,
      Email: emailInput,
    });
  };

  const handleClearSearch = () => {
    setFirstNameInput("");
    setLastNameInput("");
    setEmailInput("");
    setSearchFilter({ FirstName: "", LastName: "", Email: "" });
    setSearchActive(false);
    setCurrentPage(1);
    setStartPage(1);
  };

  //Pagination
  const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (pageNumber < startPage) setStartPage(pageNumber);
    else if (pageNumber > endPage) setStartPage(pageNumber - pagesPerSet + 1);
  };

  const handlePreviousSet = () =>
    setStartPage(Math.max(startPage - pagesPerSet, 1));
  const handleNextSet = () =>
    setStartPage(
      Math.min(startPage + pagesPerSet, totalPages - pagesPerSet + 1)
    );

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Label>
          <span>First Name</span>
          <Input
            value={firstNameInput}
            onChange={(e) => setFirstNameInput(e.target.value)}
            className="mt-1"
            placeholder="First Name"
          />
        </Label>
        <Label>
          <span>Last Name</span>
          <Input
            value={lastNameInput}
            onChange={(e) => setLastNameInput(e.target.value)}
            className="mt-1"
            placeholder="Last Name"
          />
        </Label>
        <Label>
          <span>Email</span>
          <Input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="mt-1"
            placeholder="Email"
          />
        </Label>
        <div className="flex items-end gap-2">
          <Button
            onClick={handleSearch}
            className="w-full bg-brandRed text-white"
          >
            Search
          </Button>
          <Button
            onClick={handleClearSearch}
            className="w-full bg-brandRed text-white"
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3">First Name</th>
              <th className="p-3">Last Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Profile</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, idx) => (
              <tr
                key={user.id}
                className={`${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } border-t`}
              >
                <td className="p-3">{user.FirstName}</td>
                <td className="p-3">{user.LastName}</td>
                <td className="p-3">{user.Email}</td>
                <td className="p-3">{user.Phone}</td>
                <td className="p-3">{user.Role}</td>
                <td className="p-3">{user.Profile}</td>
                <td className="p-3 flex gap-2 text-red-500">
                  <BiSolidTrashAlt
                    onClick={() => handleDeleteUser(user.id)}
                    className="cursor-pointer"
                  />
                  <LiaEditSolid
                    onClick={() => {
                      setUserId(user.id);
                      setIsModalOpen(true);
                      reset(); // optional: preload data here
                    }}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {/* <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={handlePreviousSet}
          disabled={startPage === 1}
          className="px-3 py-2 text-white bg-brandRed rounded-md disabled:bg-brandDisable"
        >
          Prev
        </button>
        {[...Array(endPage - startPage + 1)].map((_, idx) => {
          const pageNum = startPage + idx;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 text-white rounded-md ${
                pageNum === currentPage
                  ? 'bg-brandRed'
                  : 'bg-brandDisable'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={handleNextSet}
          disabled={endPage === totalPages}
          className="px-3 py-2 text-white bg-brandRed rounded-md disabled:bg-brandDisable"
        >
          Next
        </button>
      </div> */}

      <div className="flex items-center justify-center space-x-2 mt-6">
        <button
          onClick={handlePreviousSet}
          disabled={startPage === 1}
          className="px-3 py-2 text-white bg-brandRed rounded-md disabled:bg-brandDisable"
        >
          Prev
        </button>
        {[...Array(endPage - startPage + 1)].map((_, idx) => {
          const pageNum = startPage + idx;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 text-white rounded-md transition ${
                pageNum === currentPage
                  ? "bg-brandRed"
                  : "bg-brandDisable hover:bg-brandRed"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={handleNextSet}
          disabled={endPage === totalPages}
          className="px-3 py-2 text-white bg-brandRed rounded-md disabled:bg-brandDisable"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalHeader className="mb-4">Edit User Information</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormEdit)} className="space-y-4">
            <div>
              <Label>
                <span>Role</span>
                <select
                  {...register("Role")}
                  onKeyDown={handleEnter}
                  className="input input-bordered w-full p-2 border border-gray-300"
                >
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                  <option value="superAdmin">Super Admin</option>
                </select>
              </Label>
              {errors.Role && (
                <p className="text-red-500 text-sm">{errors.Role.message}</p>
              )}
            </div>
            <div>
              <Label>
                <span>Profile Status</span>
                <select
                  {...register("Profile")}
                  onKeyDown={handleEnter}
                  className="input input-bordered w-full p-2 border border-gray-300"
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="archive">Archive</option>
                </select>
              </Label>
              {errors.Profile && (
                <p className="text-red-500 text-sm">{errors.Profile.message}</p>
              )}
            </div>

            <div>
              <Label>
                <span>Regional Status</span>
                <select
                  {...register("RegionalStatus")}
                  onKeyDown={handleEnter}
                  className="input input-bordered w-full p-2 border border-gray-300"
                >
                  <option value="">Select Regional Status</option>
                  <option value="Manager">Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </Label>
              {errors.RegionalStatus && (
                <p className="text-red-500 text-sm">
                  {errors.RegionalStatus.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <Input
                type="password"
                {...register("newPassword")}
                className="shadow-md p-3"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-brandRed text-white">
                Save
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default UserManagementFilter;
