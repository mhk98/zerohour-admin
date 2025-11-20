// import React, { useEffect, useState } from "react";
// import { FaTrash } from "react-icons/fa";
// import { LiaEditSolid } from "react-icons/lia";
// import {
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Input,
//   Button,
// } from "@windmill/react-ui";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import {
//   useCreateSubCategoryMutation,
//   useDeleteSubCategoryMutation,
//   useGetAllSubCategoryQuery,
//   useUpdateSubCategoryMutation,
// } from "../../features/subCategory/subCategory";
// import { useGetAllCategoryQuery } from "../../features/category/category";
// import { useGetAllSubCategoryHeadingsQuery } from "../../features/subCategoryHeading/subCategoryHeading";

// export default function SubCategoryTable() {
//   // Fetching sub-category items
//   const { data, isLoading, isError, error, refetch } =
//     useGetAllSubCategoryQuery();
//   const [updateSubCategory] = useUpdateSubCategoryMutation();
//   const [createSubCategory] = useCreateSubCategoryMutation();
//   const [deleteSubCategory] = useDeleteSubCategoryMutation();

//   const [features, setFeatures] = useState([]);
//   useEffect(() => {
//     if (!isLoading && data) {
//       setFeatures(data.data || []);
//     }
//   }, [data, isLoading]);

//   // Fetching categories and sub-category headings using RTK Query hooks
//   const {
//     data: categoriesData,
//     isLoading: loadingCategories,
//     isError: errorCategories,
//     error: errorCat,
//   } = useGetAllCategoryQuery();

//   const {
//     data: headingsData,
//     isLoading: loadingHeadings,
//     isError: errorHeadings,
//     error: errorHead,
//   } = useGetAllSubCategoryHeadingsQuery();

//   const categories = categoriesData?.data || [];
//   const subCategories = headingsData?.data || [];

//   // Form setup with default values
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     defaultValues: {
//       title: "",
//       category_id: "",
//       subCategory_id: "",
//     },
//   });

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);

//   const openModal = (item = null) => {
//     if (item) {
//       reset({
//         title: item.title || "",
//         category_id: item.category_id || "",
//         subCategory_id: item.subCategory_id || "",
//       });
//       setSelectedId(item.subCategoryItemId);
//     } else {
//       reset({
//         title: "",
//         category_id: "",
//         subCategory_id: "",
//       });
//       setSelectedId(null);
//     }
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     reset({
//       title: "",
//       category_id: "",
//       subCategory_id: "",
//     });
//     setSelectedId(null);
//   };

//   const onFormSubmit = async (formData) => {
//     const data = {
//       subCategoryItemTitle: formData.title,
//       category_id: formData.category_id,
//       subCategory_id: formData.subCategory_id,
//     };
//     console.log("payload", data);

//     try {
//       const res = await updateSubCategory({ id: selectedId, data: data });

//       if (res.data?.success) {
//         toast.success(res.data.message);
//         refetch();
//         closeModal();
//       } else {
//         toast.error(res.error?.data?.message || "Operation failed");
//       }
//     } catch {
//       toast.error("Unexpected error occurred");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this sub category?"))
//       return;

//     try {
//       const res = await deleteSubCategory(id);
//       if (res.data?.success) {
//         toast.success(res.data.message);
//         refetch();
//       } else {
//         toast.error(res.error?.data?.message || "Delete failed");
//       }
//     } catch {
//       toast.error("Unexpected error occurred");
//     }
//   };

//   const handleEnter = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const form = e.target.form;
//       const index = Array.prototype.indexOf.call(form, e.target);
//       form.elements[index + 1]?.focus();
//     }
//   };

//   return (
//     <div className="w-full px-4 py-6 bg-gray-50">
//       <div>
//         {/* <h4 className="text-2xl md:text-md font-semibold text-gray-900">
//           Features
//         </h4> */}
//       </div>

//       <div className="overflow-x-auto p-4">
//         {isLoading ? (
//           <p className="text-center text-gray-500">Loading sub-categories …</p>
//         ) : (
//           <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
//             <thead className="bg-gray-100 text-sm text-gray-700">
//               <tr className="text-left">
//                 <th className="p-3">Title</th>
//                 <th className="p-3">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {features.length > 0 ? (
//                 features.map((item, idx) => (
//                   <tr
//                     key={item._id}
//                     className={`text-sm border-t border-gray-200 ${
//                       idx % 2 === 0 ? "bg-gray-50" : "bg-white"
//                     }`}
//                   >
//                     <td className="p-3 whitespace-nowrap">
//                       {item.subCategoryItemTitle}
//                     </td>
//                     <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
//                       <LiaEditSolid
//                         className="cursor-pointer"
//                         onClick={() => openModal(item)}
//                       />
//                       <FaTrash
//                         className="cursor-pointer text-red-500"
//                         onClick={() => handleDelete(item.subCategoryItemId)}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="2" className="p-4 text-center text-gray-500">
//                     No sub category found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>

//       <div className="flex justify-end mb-4">
//         <Button onClick={() => openModal()} className="bg-brandRed text-white">
//           Add Feature
//         </Button>
//       </div>

//       <Modal isOpen={isModalOpen} onClose={closeModal}>
//         <ModalHeader>{selectedId ? "Edit Feature" : "Add Feature"}</ModalHeader>
//         <ModalBody>
//           <form onSubmit={handleSubmit(onFormSubmit)}>
//             <div className="grid grid-cols-1 gap-4">
//               <div>
//                 <label className="block text-sm mb-1 text-gray-700">
//                   Title
//                 </label>
//                 <Input
//                   type="text"
//                   {...register("title", { required: "Title is required" })}
//                   onKeyDown={handleEnter}
//                   className="shadow-md p-3"
//                   disabled={isSubmitting}
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.title.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm mb-1 text-gray-700">
//                   Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   {...register("category_id", {
//                     required: "Category is required",
//                   })}
//                   className="input input-bordered w-full p-2 border border-gray-300"
//                   disabled={loadingCategories || isSubmitting}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((category) => (
//                     <option
//                       key={category.categoryId}
//                       value={category.categoryId}
//                     >
//                       {category.text}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.category_id && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.category_id.message}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm mb-1 text-gray-700">
//                   Sub Category <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   {...register("subCategory_id", {
//                     required: "Sub Category is required",
//                   })}
//                   className="input input-bordered w-full p-2 border border-gray-300"
//                   disabled={loadingHeadings || isSubmitting}
//                 >
//                   <option value="">Select Sub Category</option>
//                   {subCategories.map((subCategory) => (
//                     <option
//                       key={subCategory.subCategoryItemId}
//                       value={subCategory.subCategoryItemId}
//                     >
//                       {subCategory.subCategoryHeading}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.subCategory_id && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.subCategory_id.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex justify-end gap-2 mt-6">
//               <Button
//                 type="submit"
//                 className="bg-brandRed text-white"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting
//                   ? selectedId
//                     ? "Updating…"
//                     : "Creating…"
//                   : "Submit"}
//               </Button>
//             </div>
//           </form>
//         </ModalBody>
//       </Modal>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { LiaEditSolid } from "react-icons/lia";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Input,
  Button,
} from "@windmill/react-ui";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  useCreateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetAllSubCategoryQuery,
  useUpdateSubCategoryMutation,
} from "../../features/subCategory/subCategory";

import { useGetAllCategoryQuery } from "../../features/category/category";
import { useGetAllSubCategoryHeadingsQuery } from "../../features/subCategoryHeading/subCategoryHeading";

export default function SubCategoryTable() {
  const { data, isLoading, refetch } = useGetAllSubCategoryQuery();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const [features, setFeatures] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const {
    data: categoriesData,
    isLoading: loadingCategories,
    isError: errorCategories,
  } = useGetAllCategoryQuery();

  const {
    data: headingsData,
    isLoading: loadingHeadings,
    isError: errorHeadings,
  } = useGetAllSubCategoryHeadingsQuery();

  const categories = categoriesData?.data || [];
  const subCategories = headingsData?.data || [];

  useEffect(() => {
    if (!isLoading && data) {
      setFeatures(data.data || []);
    }
  }, [data, isLoading]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: "",
      category_id: "",
      subCategory_id: "",
    },
  });

  const openModal = (item = null) => {
    if (item) {
      reset({
        title: item.subCategoryItemTitle || "",
        category_id: item.category_id || "",
        subCategory_id: item.subCategory_id || "",
      });
      setSelectedId(item.subCategoryItemId);
    } else {
      reset();
      setSelectedId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedId(null);
  };

  const onFormSubmit = async (formData) => {
    const payload = {
      subCategoryItemTitle: formData.title,
      category_id: formData.category_id,
      subCategory_id: formData.subCategory_id,
    };

    try {
      const res = selectedId
        ? await updateSubCategory({ id: selectedId, data: payload })
        : await createSubCategory(payload);

      if (res.data?.success) {
        toast.success(res.data.message);
        refetch();
        closeModal();
      } else {
        toast.error(res.error?.data?.message || "Operation failed");
      }
    } catch {
      toast.error("Unexpected error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sub category?"))
      return;

    try {
      const res = await deleteSubCategory(id);
      if (res.data?.success) {
        toast.success(res.data.message);
        refetch();
      } else {
        toast.error(res.error?.data?.message || "Delete failed");
      }
    } catch {
      toast.error("Unexpected error occurred");
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
    <div className="w-full px-4 py-6 bg-gray-50">
      <div className="overflow-x-auto p-4">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading sub-categories …</p>
        ) : (
          <table className="min-w-full w-full border border-gray-200 bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr className="text-left">
                <th className="p-3">Title</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {features.length > 0 ? (
                features.map((item, idx) => (
                  <tr
                    key={item.subCategoryItemId}
                    className={`text-sm border-t border-gray-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="p-3 whitespace-nowrap">
                      {item.subCategoryItemTitle}
                    </td>
                    <td className="p-3 whitespace-nowrap flex gap-3 text-brandRed">
                      <LiaEditSolid
                        className="cursor-pointer"
                        onClick={() => openModal(item)}
                      />
                      <FaTrash
                        className="cursor-pointer text-red-500"
                        onClick={() => handleDelete(item.subCategoryItemId)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="p-4 text-center text-gray-500">
                    No sub category found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* <div className="flex justify-end mb-4">
        <Button onClick={() => openModal()} className="bg-brandRed text-white">
          Add Feature
        </Button>
      </div> */}

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>{selectedId ? "Edit Feature" : "Add Feature"}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onFormSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Title
                </label>
                <Input
                  type="text"
                  {...register("title", { required: "Title is required" })}
                  onKeyDown={handleEnter}
                  className="shadow-md p-3"
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category_id", {
                    required: "Category is required",
                  })}
                  className="input input-bordered w-full p-2 border border-gray-300"
                  disabled={loadingCategories || isSubmitting}
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.text}
                    </option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category_id.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-700">
                  Sub Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("subCategory_id", {
                    required: "Sub Category is required",
                  })}
                  className="input input-bordered w-full p-2 border border-gray-300"
                  disabled={loadingHeadings || isSubmitting}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((subCategory) => (
                    <option
                      key={subCategory.subCategoryId}
                      value={subCategory.subCategoryId}
                    >
                      {subCategory.subCategoryHeading}
                    </option>
                  ))}
                </select>
                {errors.subCategory_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.subCategory_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="submit"
                className="bg-brandRed text-white"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? selectedId
                    ? "Updating…"
                    : "Creating…"
                  : "Submit"}
              </Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}
