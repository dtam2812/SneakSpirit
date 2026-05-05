const Banner = ({ bannerSrc }) => {
  return (
    <div>
      <a>
        <img className="w-full h-fit" src={bannerSrc} alt="" />
      </a>
    </div>
  );
};
export default Banner;
