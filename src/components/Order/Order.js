import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, Button } from "@windmill/react-ui";
import { Editor } from "@tinymce/tinymce-react";
import toast from "react-hot-toast";
import OrderTable from "./OrderTable";
import { useCreateOrderMutation } from "../../features/order/order";

const Order = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    short_description: "", // Corrected state key
    price: "",
  });

  const [text, setText] = useState("");
  const [defaultImage, setDefaultImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle default image upload
  const handleDefaultImage = (e) => {
    setDefaultImage(e.target.files[0]);
  };

  // Handle gallery images upload
  const handleGalleryImages = (e) => {
    setGalleryImages([...e.target.files]);
  };

  const handleEditorChange = (content) => {
    setText(content);
  };

  const [createOrder] = useCreateOrderMutation();

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("short_description", formData.short_description);
      data.append("price", formData.price);
      data.append("description", text); // Append the content from the editor

      if (defaultImage) {
        data.append("default_image", defaultImage);
      }

      const response = await createOrder(data);

      if (response.data?.success) {
        toast.success("✅ Order Created Successfully!");

        // Reset form on success
        setFormData({ title: "", short_description: "", price: "" });
        setText("");
        setDefaultImage(null);
        setGalleryImages([]);
        setIsModalOpen(false); // Close modal on success
      } else {
        toast.error(
          response.error?.data?.message || "Failed to create product!"
        );
      }
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error("Failed to create product!");
    }
  };

  return (
    <>
      <div className="w-full mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Header Section */}
          <div>
            <h4 className="text-2xl md:text-md font-semibold text-gray-900">
              Product
            </h4>
          </div>

          {/* Right Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="px-4 py-2 bg-brandRed text-white rounded-md text-sm md:text-base hover:bg-brandRed-700 transition"
              // onClick={() => setIsModalOpen(true)}
              onClick={() => {
                document.getElementById("my_modal_4").showModal();
                // eslint-disable-next-line no-undef
              }}
            >
              + Add Product
            </Button>
          </div>
        </div>

        {/* Modal for Adding Product Information */}
        {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalHeader className="mb-4">Add Product Information</ModalHeader>
          <ModalBody> */}
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

            {/* Short Description */}
            <div>
              <label className="block text-gray-700 text-left">
                Short Description
              </label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Description (TinyMCE Editor) */}
            <div style={{ width: "100%" }}>
              <label className="block text-gray-700 text-left">
                Description
              </label>
              <Editor
                apiKey="fmljm0xvo4qvhqyeozgqyvl07anhguhupqc6hp8mc78v1rbz"
                initialValue={text}
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

            {/* Price */}
            <div>
              <label className="block text-gray-700 text-left">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>

            {/* Default Image */}
            <div>
              <label className="block text-gray-700 text-left">
                Default Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleDefaultImage}
                className="w-full border p-2 rounded"
              />
              {defaultImage && (
                <img
                  src={URL.createObjectURL(defaultImage)}
                  alt="Preview"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>

            {/* Gallery Images */}
            <div>
              <label className="block text-gray-700 text-left">
                Gallery Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryImages}
                className="w-full border p-2 rounded"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {galleryImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(img)}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
            </div>

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
                onClick={() => document.getElementById("my_modal_4").close()}
              >
                Save
              </button>
            </div>
          </form>
        </dialog>
        {/* </ModalBody>
        </Modal> */}

        <OrderTable />
      </div>
    </>
  );
};

export default Order;
