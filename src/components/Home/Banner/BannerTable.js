import React, { useEffect, useState } from "react";
import {
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
} from "@windmill/react-ui";
import toast from "react-hot-toast";
import { BiSolidTrashAlt } from "react-icons/bi";
import { LiaEditSolid } from "react-icons/lia";
import { useForm } from "react-hook-form";
import {
  useDeleteBannerMutation,
  useGetAllBannerQuery,
  useUpdateBannerMutation,
} from "../../../features/banner/banner";

const BannerTable = () => {
  const { data, isLoading, isError, error, refetch } = useGetAllBannerQuery();
  const [banners, setBanners] = useState([]);
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [files, setFiles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Debug API response
  console.log("API data:", banners);

  useEffect(() => {
    if (isError) {
      console.error("Error fetching banner data:", error);
    } else if (!isLoading && data) {
      setBanners(data.data || []);
    }
  }, [data, isLoading, isError, error]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const openEditModal = (banner) => {
    setUserId(banner.id);
    reset({
      title: banner.title,
      text: banner.text,
    });
    setFiles([]); // Reset files input
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUserId(null);
    setFiles([]);
    reset();
  };

  const onFormEdit = async (formData) => {
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("text", formData.text);
      for (let i = 0; i < files.length; i++) {
        payload.append("files", files[i]);
      }
      const res = await updateBanner({ id: userId, data: payload });
      if (res.data?.success) {
        toast.success(res.data.message);
        refetch();
        closeModal();
      } else {
        toast.error(res.error?.data?.message || "Update failed.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await deleteBanner(id);
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

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      {/* Loading & Error */}
      {isLoading && <p>Loading banners...</p>}
      {isError && <p className="text-red-500">Error loading banners.</p>}

      {/* Table */}
      {!isLoading && !isError && banners.length === 0 && (
        <p>No banners found.</p>
      )}
      {!isLoading && !isError && banners.length > 0 && (
        <div className="w-full overflow-x-auto">
          {/* <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Text</th>
                <th className="p-3">Images</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, idx) => {
                let imageFiles = [];
                try {
                  imageFiles = banner.files ? JSON.parse(banner.files) : [];
                } catch {
                  imageFiles = [];
                }
                return (
                  <tr
                    key={banner.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-t`}
                  >
                    <td className="p-3">{banner.title}</td>
                    <td className="p-3">{banner.text}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      {imageFiles.length > 0 ? (
                        imageFiles.map((file) => (
                          <img
                            key={file}
                            src={`https://your-server-path/${file}`} // Change to your real image URL base
                            alt={banner.title}
                            className="h-10 w-10 object-cover rounded"
                          />
                        ))
                      ) : (
                        <span className="text-gray-500">No images</span>
                      )}
                    </td>
                    <td className="p-3 flex gap-4 text-red-500">
                      <BiSolidTrashAlt
                        onClick={() => handleDeleteUser(banner.id)}
                        className="cursor-pointer"
                        title="Delete"
                      />
                      <LiaEditSolid
                        onClick={() => openEditModal(banner)}
                        className="cursor-pointer"
                        title="Edit"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table> */}

          <table className="w-full text-sm text-left text-gray-700 bg-white rounded shadow table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 w-1/6">Title</th>
                <th className="p-3 w-1/3">Text</th>
                <th className="p-3 w-1/3">Images</th>
                <th className="p-3 w-1/6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner, idx) => {
                let imageFiles = [];
                try {
                  imageFiles = JSON.parse(banner.files || "[]");
                } catch (e) {
                  imageFiles = [];
                }

                return (
                  <tr
                    key={banner.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-t`}
                  >
                    <td className="p-3">{banner.title}</td>
                    <td className="p-3">{banner.text}</td>

                    {/* ✅ Updated Images column */}
                    <td className="p-3">
                      <div className="flex gap-2 overflow-x-auto max-w-full">
                        {imageFiles.length > 0 ? (
                          imageFiles.map((file) => (
                            <img
                              key={file}
                              src={`https://zerohour-backend.onrender.com/media/${file}`}
                              alt="Banner"
                              className="h-10 w-10 rounded object-cover flex-shrink-0"
                            />
                          ))
                        ) : (
                          <span className="text-gray-400">No images</span>
                        )}
                      </div>
                    </td>

                    {/* ✅ Updated Actions column */}
                    <td className="p-3">
                      <div className="flex items-center gap-4 text-red-500">
                        <BiSolidTrashAlt
                          onClick={() => handleDelete(banner.id)}
                          className="cursor-pointer hover:text-red-700"
                          title="Delete"
                        />
                        <LiaEditSolid
                          onClick={() => openEditModal(banner)}
                          className="cursor-pointer hover:text-blue-500"
                          title="Edit"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Edit Banner</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormEdit)}>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Title
                </label>
                <Input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  className="input input-bordered w-full form-control shadow-md p-3"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">Text</label>
                <textarea
                  rows={4}
                  {...register("text", { required: "Text is required" })}
                  className="textarea textarea-bordered w-full shadow-md p-3"
                />
                {errors.text && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.text.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-1 text-gray-700">
                  Banner Images
                </label>
                <input
                  name="files"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block"
                />
              </div>

              {/* Show existing images */}
              {userId && banners.length > 0 && (
                <div className="mb-4 flex gap-2 flex-wrap">
                  {(() => {
                    const banner = banners.find((b) => b.id === userId);
                    if (!banner || !banner.files)
                      return <p>No existing images</p>;
                    let imgs = [];
                    try {
                      imgs = JSON.parse(banner.files);
                    } catch {
                      imgs = [];
                    }
                    return imgs.length > 0 ? (
                      imgs.map((file) => (
                        <img
                          key={file}
                          src={`https://zerohour-backend.onrender.com/media/${file}`} // Change to your real image URL base
                          alt="Existing banner"
                          className="h-16 w-16 object-cover rounded"
                        />
                      ))
                    ) : (
                      <p>No existing images</p>
                    );
                  })()}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="submit" className="btn bg-brandRed">
                Save
              </Button>
              <Button type="button" layout="outline" onClick={closeModal}>
                Cancel
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default BannerTable;
