const Banner = ({ bannerSrc }) => {
  return (
    <div >
      <a>
        <img className='w-full' src={bannerSrc} alt="" />
      </a>
    </div>
  )
}
export default Banner