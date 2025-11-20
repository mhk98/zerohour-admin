import React, { useEffect, useState } from "react";
import { Input, Label, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { BiCloudLightRain, BiSolidTrashAlt } from "react-icons/bi";
import { LiaEditSolid } from "react-icons/lia";
import { useForm } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
import { 
  useDeleteNewsMutation, 
  useGetAllNewsQuery, 
  useUpdateNewsMutation 
} from "../../features/news/news";

const NewsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagesPerSet, setPagesPerSet] = useState(10);
  const [itemsPerPage] = useState(10);

  const [titleInput, setTitleInput] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchFilter, setSearchFilter] = useState({ title: "" });

  const { data, isLoading, isError, error, refetch } = useGetAllNewsQuery(
    {
      ...(searchActive ? searchFilter : {}),
      page: currentPage,
      limit: itemsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );

  console.log("NewsTable render - data:", data);
  const [news, setNews] = useState([]);
  const [updateNews, { isLoading: isUpdating }] = useUpdateNewsMutation();
  const [deleteNews] = useDeleteNewsMutation();
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  const [newsId, setNewsId] = useState("");

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
    if (isError) console.error(error);
    else if (!isLoading && data) {
      setNews(data.data);
      setTotalPages(Math.ceil(data.meta.total / itemsPerPage));
    }
  }, [data, isLoading, isError, error, itemsPerPage]);

  const handleOpenModal = (item) => {
    setNewsId(item.id);

    setValue("title", item.title);
    setValue("author", item.author);
    setValue("excerpt", item.excerpt);
    setValue("description", item.content);
    setValue("category", item.category); // IMPORTANT

    document.getElementById("news_modal").showModal();
  };

  const handleEditorChange = (content) => {
    setValue("description", content);
  };

  const handleUpdateNews = async (formData) => {
    try {
      const response = await updateNews({ id: newsId, data: formData });

      if (response.data?.success) {
        toast.success("News Updated Successfully!");
        refetch();
        document.getElementById("news_modal").close();
      } else {
        toast.error(response.error?.data?.message || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update news!");
    }
  };

  const handleDeleteNews = async (id) => {
    try {
      const res = await deleteNews(id);
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

  const endPage = Math.min(startPage + pagesPerSet - 1, totalPages);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (pageNumber < startPage) setStartPage(pageNumber);
    else if (pageNumber > endPage) setStartPage(pageNumber - pagesPerSet + 1);
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">

      {/* Search Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Label>
          <span>News Title</span>
          <Input
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            className="mt-1"
            placeholder="Search by title..."
          />
        </Label>
        <div className="flex items-end gap-2">
          <Button onClick={handleSearch} className="w-full bg-brandRed text-white">Search</Button>
          <Button onClick={handleClearSearch} className="w-full bg-brandRed text-white">Clear</Button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">#</th>
              <th className="p-3">Title</th>
              <th className="p-3">Author</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Category</th>
              <th className="p-3">Content</th>
              <th className="p-3">Thumbnail</th>
              <th className="p-3">Excerpt</th>
              <th className="p-3">isBreaking</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {news?.map((item, index) => (
              <tr key={item?.id}>
                <td className="px-4 py-2 border-b">{index + 1}</td>
                <td className="px-4 py-2 border-b">{item?.title}</td>
                <td className="px-4 py-2 border-b">{item?.author}</td>
                <td className="px-4 py-2 border-b">{item?.slug}</td>
                <td className="px-4 py-2 border-b">{item?.category}</td>

                <td className="p-3">
                  <div dangerouslySetInnerHTML={{ __html: item?.content }} />
                </td>

                <td className="px-4 py-2 border-b">
                  <img src={`http://localhost:5000/${item?.image}`} width={70} height={50} />
                </td>

                <td className="px-4 py-2 border-b">{item?.excerpt}</td>
                <td className="px-4 py-2 border-b">{item?.isBreaking ? "Yes" : "No"}</td>

                <td className="px-4 py-2 flex gap-3">
                  <BiSolidTrashAlt onClick={() => handleDeleteNews(item.id)} className="cursor-pointer text-red-500" />
                  <LiaEditSolid onClick={() => handleOpenModal(item)} className="cursor-pointer text-blue-500" />
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 mt-6">
        <button 
          onClick={() => setStartPage(startPage - pagesPerSet)}
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
                pageNum === currentPage ? "bg-brandRed" : "bg-brandDisable hover:bg-brandRed"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button 
          onClick={() => setStartPage(startPage + pagesPerSet)}
          disabled={endPage === totalPages}
          className="px-3 py-2 text-white bg-brandRed rounded-md disabled:bg-brandDisable"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      <dialog id="news_modal" className="modal">
        <form className="space-y-4 w-full max-w-2xl" onSubmit={handleSubmit(handleUpdateNews)}>
          <h2 className="text-xl font-semibold mb-4">Edit News</h2>

          <div>
            <label className="block text-gray-700">Title</label>
            <Input type="text" {...register("title")} />
          </div>

          <div>
            <label className="block text-gray-700">Author</label>
            <Input type="text" {...register("author")} />
          </div>

          <div>
            <label className="block text-gray-700">Excerpt</label>
            <textarea className="w-full border rounded p-2" {...register("excerpt")} />
          </div>

          <div>
            <label className="block text-gray-700">Content</label>
            <Editor
              apiKey="fmljm0xvo4qvhqyeozgqyvl07anhguhupqc6hp8mc78v1rbz"
              onEditorChange={handleEditorChange}
              init={{
                height: 300,
                menubar: false,
                plugins: ["lists", "link", "image", "preview", "table"],
                toolbar: "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist"
              }}
            />
          </div>

          {/* Static Category */}
          <div>
            <Label>
              <span>Category</span>
              <select {...register("category")} className="w-full p-2 border rounded">
                <option value="">Select Category</option>
                <option value="Politics">Politics</option>
                <option value="Sports">Sports</option>
                <option value="Technology">Technology</option>
                <option value="Entertainment">Entertainment</option>
                <option value="World News">World News</option>
                <option value="Business">Business</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </Label>
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => document.getElementById("news_modal").close()}
            >
              Close
            </button>

            <button 
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-brandRed text-white rounded"
            >
              {isUpdating ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </dialog>

    </div>
  );
};

export default NewsTable;
