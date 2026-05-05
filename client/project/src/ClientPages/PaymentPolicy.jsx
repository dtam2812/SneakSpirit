import Breadcrumb from "../components/Breadcrumb"

const PaymentPolicy = () => {
  return (
    <div>
      <Breadcrumb first='Chính sách thanh toán' />
      <div className='container'>
        <div className='text-left pb-20 px-3 sm:pl-0'>
          <h1 className='text-3xl sm:text-5xl py-9'>CHÍNH SÁCH THANH TOÁN</h1>
          <h5 className='text-lg py-3'>CHÍNH SÁCH THANH TOÁN</h5>
          <div>
            <div className='space-y-3'>
              <p>Hình thức thanh toán Hình thức mua hàng và thanh toán tại hệ thống hybid.shop được thực hiện như sau </p>
              <h1 className='text-2xl'>1. Hình thức thanh toán khi mua hàng tại hybid.shop . Phương thức Giao hàng –  Trả tiền mặt chỉ áp dụng đối với những khu vực chúng tôi hỗ trợ giao nhận miễn phí hoặc trả tiền mua hàng trực tiếp tại: 169/1E đường An Thạnh 68, An Thạnh, Thuận An, Bình Dương</h1>
            </div>
            <div className='space-y-3 pt-16'>
              <h1 className='text-2xl'>2. Hình thức thanh toán trước: Chuyển tiền, chuyển khoản, thanh toán trực tiếp bằng tiền mặt tại văn phòng của chúng tôi. Hình thức chuyển tiền/chuyển khoản qua ngân hàng  3. Hình thức chuyển tiền/chuyển khoản qua ngân hàng Áp dụng cho khách hàng ngoài khu vực hỗ trợ giao nhận miễn phí. Hoặc khách hàng có nhu cầu sử dụng phương thức thanh toán này</h1>
              <ul className="list-none">
                <div className='pl-8 space-y-3'>
                  <li>* TK Công ty:  CÔNG TY TNHH MTV LÂM MEDIA</li>
                  <li>* Thông tin chuyển khoản tại: Số TK : 85857688. Ngân hàng TMCP Á CHÂU (ACB)</li>
                  <li>* Tên chủ tk:  CÔNG TY TNHH MTV LÂM MEDIA</li>
                </div>
              </ul>
              <p>CHÚNG TÔI SẼ TỪ CHỐI THANH TOÁN NẾU THÔNG TIN KHÔNG NẰM TRONG CÁC TÀI KHOẢN Ở DANH MỤC TRÊN. VÀ KHÔNG CHỊU BẤT CỨ TRÁCH NHIỆM GÌ VỀ VIỆC QUÝ KHÁCH GIAO DỊCH CHUYỂN TIỀN CHO ĐƠN VỊ CÁ NHÂN KHÁC THÔNG TIN TRÊN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default PaymentPolicy