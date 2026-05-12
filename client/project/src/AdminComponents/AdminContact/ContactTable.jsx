import axios from "../Common";
import { useEffect, useState } from "react";
import removeAccents from "remove-accents";
import SearchBar from "../../components/SearchBar";

const ContactTable = () => {
  const [listContact, setListContact] = useState([]);
  const [searchingValue, setSearchingValue] = useState("");
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //Lấy danh sách liên hệ được gửi
  useEffect(() => {
    const getListContact = async () => {
      try {
        const response = await axios.get(`/api/auth/contact`);
        setListContact(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getListContact();
  }, [listContact]);

  //Xóa liên hệ
  const handleDeleteContact = async (contactId) => {
    try {
      await axios.delete(`api/auth/contact/delete/${contactId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(listContact.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentContacts = listContact.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  return (
    <div className="flex flex-col">
      {/*Thanh tìm kiếm*/}
      <SearchBar
        searchingValue={searchingValue}
        setSearchingValue={setSearchingValue}
        setSearched={setSearched}
      />
      {/*Table các liên hệ*/}
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Họ tên</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Số điện thoại</th>
                  <th className="px-6 py-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentContacts.length > 0 ? (
                  searched === true ? (
                    currentContacts
                      .filter((element) => {
                        const contactName = removeAccents(
                          `${element.name} ${element.email} ${element.telephone}`.toLowerCase(),
                        );
                        const searchValue = removeAccents(
                          searchingValue.toLowerCase(),
                        );

                        return searchValue === ""
                          ? element
                          : contactName.includes(searchValue);
                      })
                      .map((element, index) => {
                        return (
                          <>
                            <tr
                              key={element._id}
                              className=" dark:border-neutral-500"
                            >
                              <td className="whitespace-nowrap px-6 py-4 font-medium">
                                {startIndex + index + 1}
                              </td>
                              <td className="whitespace-nowrap px-6 pt-4 pb-2 ">
                                {element.name}
                              </td>
                              <td className="whitespace-nowrap px-6 pt-4 pb-2 ">
                                {element.email}
                              </td>
                              <td className="whitespace-nowrap px-6 pt-4 pb-2 ">
                                {element.telephone}
                              </td>
                              <td className="whitespace-nowrap px-6 pt-4 pb-2 ">
                                <button
                                  onClick={() => {
                                    handleDeleteContact(element._id);
                                  }}
                                  className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                                >
                                  Xóa
                                </button>
                              </td>
                            </tr>
                            <tr className="border-b dark:border-neutral-500">
                              <td colSpan="5" className="px-6 pt-2 pb-4 ">
                                <div className="flex items-baseline ">
                                  <h2 className="text-md font-semibold px-2">
                                    Liên hệ:{" "}
                                  </h2>
                                  <p className="break-words max-w-[1000px]">
                                    {element.contactContent}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </>
                        );
                      })
                  ) : (
                    currentContacts.map((element, index) => {
                      return (
                        <>
                          <tr
                            key={element._id}
                            className=" dark:border-neutral-500"
                          >
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                              {startIndex + index + 1}
                            </td>
                            <td className="whitespace-nowrap px-6 pt-4 pb-2 ">
                              {element.name}
                            </td>
                            <td className="whitespace-nowrap px-6 pt-4 pb-2 ">
                              {element.email}
                            </td>
                            <td className="whitespace-nowrap px-6 pt-4 pb-2 ">
                              {element.telephone}
                            </td>
                            <td className="whitespace-nowrap px-6 pt-4 pb-2 ">
                              <button
                                onClick={() => {
                                  handleDeleteContact(element._id);
                                }}
                                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                          <tr className="border-b dark:border-neutral-500">
                            <td colSpan="5" className="px-6 pt-2 pb-4 ">
                              <div className="flex items-baseline ">
                                <h2 className="text-md font-semibold px-2">
                                  Liên hệ:{" "}
                                </h2>
                                <p className="break-words max-w-[1000px]">
                                  {element.contactContent}
                                </p>
                              </div>
                            </td>
                          </tr>
                        </>
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

export default ContactTable;
