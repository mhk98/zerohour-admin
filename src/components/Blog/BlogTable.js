import React, { useEffect, useState } from "react";
import { Input, Label, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { BiSolidTrashAlt } from "react-icons/bi";
import { LiaEditSolid } from "react-icons/lia";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import {
  useDeleteBlogMutation,
  useGetAllBlogQuery,
  useUpdateBlogMutation,
} from "../../features/blog/blog";

const BlogTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagesPerSet, setPagesPerSet] = useState(10);
  const [itemsPerPage] = useState(10);

  // Search input states
  const [titleInput, setTitleInput] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchFilter, setSearchFilter] = useState({ title: "" });

  const { data, isLoading, isError, error, refetch } = useGetAllBlogQuery(
    {
      ...(searchActive ? searchFilter : {}),
      page: currentPage,
      limit: itemsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [blogs, setBlogs] = useState([]);
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [blogId, setBlogId] = useState("");
  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);

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
      console.error("Error fetching blog data", error);
    } else if (!isLoading && data) {
      setBlogs(data.data);
      setTotalPages(Math.ceil(data.meta.total / itemsPerPage));
    }
  }, [data, isLoading, isError, error, itemsPerPage]);

  // Open modal with data
  const handleOpenModal = (blog) => {
    setBlogId(blog.id);
    setValue("title", blog.title);
    setValue("type", blog.type);
    setValue("description", blog.description);
    setImage(null);
    document.getElementById("my_modal_5").showModal();
  };

  const handleChangeImage = (e) => {
    setImage(e.target.files[0]);
  };
  const handleChangeImage1 = (e) => {
    setImage1(e.target.files[0]);
  };

  // Submit update
  const handleEdit = async (formData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("type", formData.type);
      formDataToSend.append("description", formData.description);

      if (image) {
        formDataToSend.append("image", image);
      }
      if (image1) {
        formDataToSend.append("image1", image1);
      }

      const response = await updateBlog({ id: blogId, data: formDataToSend });

      if (response.data?.success === true) {
        toast.success("✅ Blog Updated Successfully!");
        refetch();
        document.getElementById("my_modal_5").close();
      } else {
        toast.error(response.error?.data?.message || "Update failed.");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error("Failed to update blog!");
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      const res = await deleteBlog(id);
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
    setSearchFilter({ title: titleInput });
  };

  const handleClearSearch = () => {
    setTitleInput("");
    setSearchFilter({ title: "" });
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

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Label>
          <span>Title</span>
          <Input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="mt-1"
            placeholder="Title"
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
              <th className="p-3">Title</th>
              <th className="p-3">Blog Type</th>
              <th className="p-3">Description</th>
              <th className="p-3">Image</th>
              <th className="p-3">Background Image</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {blogs?.map((blog) => (
              <tr key={blog.id} className="align-middle">
                <td className="p-3">{blog.title}</td>
                <td className="p-3">{blog.type}</td>
                <td className="p-3">
                  <div dangerouslySetInnerHTML={{ __html: blog.description }} />
                </td>
                <td className="p-3">
                  <img
                    src={`https://zerohour-backend.onrender.com${blog.image}`}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3">
                  <img
                    src={`https://zerohour-backend.onrender.com${blog.image1}`}
                    alt={blog.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3">
                  <div className="flex gap-2 text-red-500">
                    <BiSolidTrashAlt
                      onClick={() => handleDeleteBlog(blog.id)}
                      className="cursor-pointer"
                    />
                    <LiaEditSolid
                      onClick={() => handleOpenModal(blog)}
                      className="cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
      <dialog id="my_modal_5" className="modal">
        <form
          className="space-y-4 w-full max-w-2xl"
          onSubmit={handleSubmit(handleEdit)}
        >
          <div>
            <label className="block text-gray-700 text-left">Title</label>
            <Input
              type="text"
              className="w-full border rounded p-2"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-left">Description</label>
            <Editor
              apiKey="fmljm0xvo4qvhqyeozgqyvl07anhguhupqc6hp8mc78v1rbz"
              value={watch("description")}
              onEditorChange={(content) => setValue("description", content)}
              init={{
                height: 300,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help",
              }}
            />
          </div>

          {/* Blog Type */}
          <div>
            <label className="block text-gray-700 text-left">Blog Type</label>
            <select
              {...register("type", { required: "Blog type is required" })}
              className="input input-bordered w-full shadow-md p-3"
            >
              <option value="">Select Blog Type</option>
              <option value="Review Product">Review Product</option>
              <option value="News">News</option>
              <option value="Promotions">Promotions</option>
              <option value="Tips & Tricks">Tips & Tricks</option>
              <option value="Others">Others</option>
            </select>
            {errors.type && (
              <p className="text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-left">Image</label>
            <Input type="file" accept="image/*" onChange={handleChangeImage} />
            {image && (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700 text-left">
              Background Image
            </label>
            <Input type="file" accept="image/*" onChange={handleChangeImage1} />
            {image1 && (
              <img
                src={URL.createObjectURL(image1)}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => document.getElementById("my_modal_5").close()}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brandRed text-white rounded hover:bg-brandRed"
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default BlogTable;
