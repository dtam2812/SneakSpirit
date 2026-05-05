/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"

const Breadcrumb = ({ first, second, secondLink }) => {
  return (
    <div className='w-full h-10 bg-[#F6F6F6] flex items-center'>
      <div className="container">
        <div className='flex items-center gap-x-1 sm:pl-0 pl-5'>
          <Link to='/'>
            <p className='cursor-pointer text-[#a9a9a9] hover:text-blue-300'>Trang chủ /</p>
          </Link>
          {
            (second !== undefined && secondLink !== undefined) ? (
              <>
                <Link to={secondLink}>
                  <p className='cursor-pointer text-[#a9a9a9] hover:text-blue-300'>{first} /</p>
                </Link>
                <p>{second} </p>
              </>
            ) : (<p>{first}</p>)
          }
        </div>
      </div>
    </div >
  )
}
export default Breadcrumb