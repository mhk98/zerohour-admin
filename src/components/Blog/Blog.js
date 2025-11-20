import React, { useState } from "react";
import { Button } from "@windmill/react-ui";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";
import BlogTable from "./BlogTable";
import { useCreateBlogMutation } from "../../features/blog/blog";

const Blog = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
  });

  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const [createBlog] = useCreateBlogMutation();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleChangeImage = (e) => {
    setImage(e.target.files[0]);
  };
  const [image1, setImage1] = useState(null);
  const handleChangeImage1 = (e) => {
    setImage1(e.target.files[0]);
  };

  // Handle TinyMCE editor
  const handleEditorChange = (content) => {
    setText(content);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("type", formData.type);
      data.append("description", text);

      if (image) {
        data.append("image", image);
      }
      if (image1) {
        data.append("image1", image1);
      }

      const response = await createBlog(data);

      if (response.data?.success) {
        toast.success("✅ Blog Created Successfully!");

        // Reset form
        setFormData({ title: "", description: "", type: "" });
        setText("");
        setImage(null);

        document.getElementById("my_modal_4").close(); // close modal on success
      } else {
        toast.error(response.error?.data?.message || "Failed to create blog!");
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Failed to create blog!");
    }
  };

  return (
    <div className="w-full mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Header Section */}
        <div>
          <h4 className="text-2xl md:text-md font-semibold text-gray-900">
            Blog
          </h4>
        </div>

        {/* Right Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition"
            onClick={() => {
              document.getElementById("my_modal_4").showModal();
            }}
          >
            + Add Blog
          </Button>
        </div>
      </div>

      {/* Modal */}
      <dialog id="my_modal_4" className="modal">
        <form className="space-y-4 w-full max-w-2xl" onSubmit={handleSubmit}>
          {/* Title */}
          <div>
            <label className="block text-gray-700 text-left">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>

          {/* Description (TinyMCE Editor) */}
          <div style={{ width: "100%" }}>
            <label className="block text-gray-700 text-left">Description</label>
            <Editor
              apiKey="fmljm0xvo4qvhqyeozgqyvl07anhguhupqc6hp8mc78v1rbz"
              value={text}
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
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
              onEditorChange={handleEditorChange}
            />
          </div>

          {/* Blog Type */}
          <div>
            <label className="block text-gray-700 text-left">Blog Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input input-bordered w-full shadow-md p-3"
              required
            >
              <option value="">Select Blog Type</option>
              <option value="Review Product">Review Product</option>
              <option value="News">News</option>
              <option value="Promotions">Promotions</option>
              <option value="Tips & Tricks">Tips & Tricks</option>
              <option value="Others">Others</option>
            </select>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 text-left">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage}
              className="w-full border p-2 rounded"
            />
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
            <input
              type="file"
              accept="image/*"
              onChange={handleChangeImage1}
              className="w-full border p-2 rounded"
            />
            {image1 && (
              <img
                src={URL.createObjectURL(image1)}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              onClick={() => document.getElementById("my_modal_4").close()}
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

      {/* Blog Table */}
      <BlogTable />
    </div>
  );
};

export default Blog;
