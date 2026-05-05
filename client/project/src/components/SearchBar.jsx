/* eslint-disable react/prop-types */
const SearchBar = ({ searchingValue, setSearchingValue, setSearched, productTable }) => {
  return (
    <form className={`${productTable === true ? 'my-3' : 'w-2/5'}`}>
      <label className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3">
          <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
        <input value={searchingValue} onChange={(e) => { setSearchingValue(e.target.value) }}
          type="search" id="search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-5"
          placeholder="Tìm kiếm" />
        <button onClick={() => setSearched(true)}
          type="button" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 ">
          Tìm kiếm</button>
      </div>
    </form>
  )
}
export default SearchBar