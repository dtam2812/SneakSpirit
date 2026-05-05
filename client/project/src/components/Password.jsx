/* eslint-disable react/prop-types */
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

const Password = ({ isSeen, setIsSeen }) => {
  return (

    <form >
      <label>Mật khẩu <span className='text-red-500'>*</span></label>
      <div className='relative z-10'>
        <input
          id="password"
          type={isSeen === true ? 'text' : 'password'}
          placeholder="Mật khẩu"
          className='block border border-[#e1e1e1] p-2 w-full my-2 rounded-md outline-none'
        />
        {
          isSeen === true ? (
            <FontAwesomeIcon onClick={() => setIsSeen(false)} className='absolute top-3 right-2 cursor-pointer' icon={faEye} />
          ) : (<FontAwesomeIcon onClick={() => setIsSeen(true)} className='absolute top-3 right-2 cursor-pointer' icon={faEyeSlash} />)
        }
      </div>
    </form>
  )
}
export default Password