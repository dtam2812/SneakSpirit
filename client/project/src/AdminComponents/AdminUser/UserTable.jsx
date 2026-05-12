/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "../Common";
import { useNavigate } from "react-router-dom";
import removeAccents from "remove-accents";

const UserTable = ({ listUser, searchingValue, searched }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //Xóa người dùng
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`auth/admin/user/delete/${userId}`);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const totalPages = Math.ceil(listUser.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = listUser.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Họ tên</th>
                  <th className="px-6 py-4">Địa chỉ email</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  searched === true ? (
                    currentUsers
                      .filter((element) => {
                        const user = removeAccents(
                          `${element.userName} ${element.email}`.toLowerCase(),
                        );
                        const searchValue = removeAccents(
                          searchingValue.toLowerCase(),
                        );

                        return searchValue === ""
                          ? element
                          : user.includes(searchValue);
                      })
                      .map((element, index) => {
                        return (
                          <tr
                            key={element._id}
                            className="border-b dark:border-neutral-500"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {startIndex + index + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.userName}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.email}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.role}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              {element.telephone}
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 flex">
                              <button
                                onClick={() => handleDelete(element._id)}
                                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        );
                      })
                  ) : (
                    currentUsers.map((element, index) => {
                      return (
                        <tr
                          key={element._id}
                          className="border-b dark:border-neutral-500"
                        >
                          <td className="whitespace-nowrap px-6 py-4 font-medium">
                            {startIndex + index + 1}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.userName}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.email}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.role}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4">
                            {element.telephone}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 flex">
                            <button
                              onClick={() => handleDelete(element._id)}
                              className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Không có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="mx-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="mx-2 px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
