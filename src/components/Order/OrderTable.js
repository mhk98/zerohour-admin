import React, { useEffect, useState } from "react";
import { Input, Label, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { BiSolidTrashAlt } from "react-icons/bi";
import { LiaEditSolid } from "react-icons/lia";
import { useForm } from "react-hook-form";
import {
  useDeleteOrderMutation,
  useGetAllOrderQuery,
  useUpdateOrderMutation,
} from "../../features/order/order"; // Adjust this import as needed
import Invoice from "./Invoice";

const OrderTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pagesPerSet, setPagesPerSet] = useState(10);
  const [itemsPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [searchFilter, setSearchFilter] = useState({ firstName: "" });

  const userId = localStorage.getItem("userId");

  const { data, isLoading, isError, error, refetch } = useGetAllOrderQuery(
    {
      ...(searchActive ? searchFilter : {}),
      page: currentPage,
      limit: itemsPerPage,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [orders, setOrders] = useState([]);
  const [deleteOrder] = useDeleteOrderMutation();
  const [updateOrder] = useUpdateOrderMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [orderId, setOrderId] = useState("");

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
      console.error("Error fetching orders:", error);
    } else if (!isLoading && data) {
      setOrders(data.data);
      setTotalPages(Math.ceil(data.meta.total / itemsPerPage));
    }
  }, [data, isLoading, isError, error, itemsPerPage]);

  const handleDeleteOrder = async (id) => {
    try {
      const res = await deleteOrder(id);
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
    setSearchFilter({ firstName: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchFilter({ firstName: "" });
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

  const handlePreviousSet = () =>
    setStartPage(Math.max(startPage - pagesPerSet, 1));

  const handleNextSet = () =>
    setStartPage(
      Math.min(startPage + pagesPerSet, totalPages - pagesPerSet + 1)
    );

  const handleEdit = async (formData) => {
    const payload = {
      orderStatus: formData.orderStatus,
      user_id: userId,
    };

    try {
      const response = await updateOrder({ id: orderId, data: payload });

      if (response.data?.success === true) {
        toast.success("✅ Order Updated Successfully!");
        refetch();
        document.getElementById("my_modal_5").close();
        reset();
      } else {
        toast.error(response.error?.data?.message || "Update failed.");
      }
    } catch (error) {
      toast.error("Failed to update order.");
    }
  };

  const generateInvoiceNo = () => {
    const now = new Date();
    return `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now
      .getDate()
      .toString()
      .padStart(2, "0")}-${now.getTime()}`;
  };

  const [invoiceNo, setInvoiceNo] = useState("");

  useEffect(() => {
    const newInvoiceNo = generateInvoiceNo();
    setInvoiceNo(newInvoiceNo);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      {/* Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Label>
          <span>Customer Name</span>
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="mt-1"
            placeholder="Search by First Name"
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700 bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Customer Name</th>
              <th className="p-3">Email/Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3">City</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Order Status</th>
              <th className="p-3">Total</th>
              <th className="p-3">Products</th>
              <th className="p-3">Invoice</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.id}>
                <td className="p-3">
                  {order?.firstName} {order?.lastName}
                </td>
                <td className="p-3">{order?.emailOrPhone}</td>
                <td className="p-3">{order?.address}</td>
                <td className="p-3">{order?.city}</td>
                <td className="p-3">{order?.paymentMethod}</td>
                {/* <td className="p-3">{order.orderStatus}</td> */}
                <td className="p-3 font-semibold text-sm">
                  <span
                    className={`px-2 py-1 rounded 
      ${
        order.orderStatus === "Processing"
          ? "bg-yellow-500 text-white"
          : order.orderStatus === "Shipped"
          ? "bg-blue-500 text-white"
          : order.orderStatus === "Completed"
          ? "bg-green-600 text-white"
          : order.orderStatus === "Cancelled"
          ? "bg-red-500 text-white"
          : "bg-gray-400 text-white"
      }`}
                  >
                    {order?.orderStatus}
                  </span>
                </td>

                <td className="p-3">${order?.total}</td>
                <td className="p-3">
                  {JSON.parse(order.cartProducts).map((p) => (
                    <div key={p.id} className="flex items-center gap-2 mb-1">
                      {p.thumbnailImage && (
                        <img
                          src={`https://zerohour-backend.onrender.com${p.thumbnailImage}`}
                          alt={p.title}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span>
                        {p.title} x {p.quantity} (${p.subTotal})
                      </span>
                    </div>
                  ))}
                </td>
                <td className="p-3 whitespace-nowrap cursor-pointer">
                  <Invoice
                    invoiceData={{
                      invoiceNo: invoiceNo, // ✅ FIXED
                      OrderId: order.id, // ✅ FIXED
                      date: new Date(order.createdAt).toLocaleDateString(),
                      dueDate: new Date(order.createdAt).toLocaleDateString(),
                      name: `${order.firstName} ${order.lastName}`,
                      address: order.address,
                      city: order.city,
                      phone: order.emailOrPhone,
                      paymentMethod: order.paymentMethod,
                      orderStatus: order.orderStatus,
                      items: order.cartProducts
                        ? JSON.parse(order.cartProducts).map((item) => ({
                            description: item.title,
                            qty: item.quantity,
                            subTotal: item.subTotal,
                            total: item.price * item.quantity,
                          }))
                        : [],
                      subTotal: order.cartProducts
                        ? JSON.parse(order.cartProducts).reduce(
                            (sum, item) => sum + item.subTotal,
                            0
                          )
                        : 0,
                      delivery: 0,
                      total: order.total,
                    }}
                  />
                </td>

                <td className="p-3">
                  <div className="flex gap-2 text-red-500">
                    <BiSolidTrashAlt
                      onClick={() => handleDeleteOrder(order.id)}
                      className="cursor-pointer"
                    />
                    <LiaEditSolid
                      onClick={() => {
                        document.getElementById("my_modal_5").showModal();
                        setOrderId(order.id);
                        setValue("orderStatus", order.orderStatus);
                      }}
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
          className="px-3 py-2 text-white bg-brandRed rounded disabled:bg-gray-300"
        >
          Prev
        </button>
        {[...Array(endPage - startPage + 1)].map((_, idx) => {
          const pageNum = startPage + idx;
          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`px-3 py-2 rounded ${
                pageNum === currentPage
                  ? "bg-brandRed text-white"
                  : "bg-gray-200 hover:bg-brandRed hover:text-white"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        <button
          onClick={handleNextSet}
          disabled={endPage === totalPages}
          className="px-3 py-2 text-white bg-brandRed rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      <dialog id="my_modal_5" className="modal">
        <form
          method="dialog"
          onSubmit={handleSubmit(handleEdit)}
          className="modal-box max-w-xl space-y-4"
        >
          <h3 className="text-lg font-semibold">Update Order Status</h3>
          <Label>
            <span>Order Status</span>
            <select
              {...register("orderStatus", { required: "Status is required" })}
              className="input input-bordered w-full p-2 border border-gray-300"
            >
              <option value="">Select Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              {/* <option value="Cancelled">Cancelled</option> */}
            </select>
          </Label>
          {errors.orderStatus && (
            <p className="text-red-500 text-sm">{errors.orderStatus.message}</p>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => document.getElementById("my_modal_5").close()}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-brandRed text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default OrderTable;
