/* eslint-disable react/prop-types */
const InfoUser = ({ user }) => {
  //Thông tin người dùng
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className='p-3 text-left'>
      <h2 className='text-2xl font-semibold pb-3'>Thông tin tài khoản</h2>
      <div className='space-y-3 text-lg'>
        <div className='flex'>
          <p className='font-semibold pr-2'>Họ tên: </p>
          <p> {user.userName}</p>
        </div>
        <div className='flex'>
          <p className='font-semibold pr-2'>Mail: </p>
          <p> {user.email}</p>
        </div>
        <div className='flex'>
          <p className='font-semibold pr-2'>Số điện thoại: </p>
          <p> {user.telephone}</p>
        </div>
      </div>
    </div>
  )
}
export default InfoUser