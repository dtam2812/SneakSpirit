import { faEnvelope, faLocation, faMobileScreenButton } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import Breadcrumb from "../components/Breadcrumb";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    content: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  //Thêm liên hệ
  const handleAddingContact = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        navigate('/login');
        return;
      }

      const email = document.getElementById('email').value;
      const name = document.getElementById('name').value;
      const telephone = document.getElementById('telephone').value;
      const content = document.getElementById('content').value;

      if (email !== '' && name !== '' && telephone !== '' && content !== '') {
        const response = await axios.post('api/auth/contact/create', {
          name: name,
          email: email,
          telephone: telephone,
          contactContent: content
        })
        alert('Gửi liên hệ thành công');
        setFormData({
          name: "",
          email: "",
          telephone: "",
          content: "",
        })
      } else alert('Xin hãy điền đầy đủ thông tin');
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Breadcrumb first='Liên hệ' />
      {/*Thêm liên hệ*/}
      <div className="container">
        <div className="xl:flex p-5 gap-x-4">
          <div className="xl:w-1/2 text-left">
            <div className='border-b-2 pb-3'>
              <h2 className='text-4xl py-4'>Lâm Vlog</h2>
              <div className='flex gap-x-3 items-center pb-2'>
                <p><FontAwesomeIcon icon={faLocation} /></p>
                <p>Địa chỉ: Thuận An, Bình Dương</p>
              </div>
              <div className='flex gap-x-3 items-center pb-2'>
                <p><FontAwesomeIcon icon={faMobileScreenButton} /></p>
                <p>Số điện thoại: 0383300680</p>
              </div>
              <div className='flex gap-x-3 items-center pb-2'>
                <p><FontAwesomeIcon icon={faEnvelope} /></p>
                <p>Email: hybid@lamvlog.com</p>
              </div>
            </div>
            <div>
              <h3 className='text-xl py-3'>Liên hệ với chúng tôi</h3>
              <div className='py-3 space-y-5'>
                <form>
                  <input
                    id="name"
                    type="text"
                    placeholder="Họ tên"
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                  />
                </form>
                <form>
                  <input
                    id="email"
                    type="text"
                    placeholder="Email "
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                  />
                </form>
                <form>
                  <input
                    id="telephone"
                    type="text"
                    placeholder="Số điện thoại"
                    value={formData.telephone}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-black"
                  />
                </form>
                <form>
                  <textarea
                    id="content"
                    type="text"
                    placeholder="Nhập nội dung"
                    value={formData.content}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 p-2 h-32 rounded-md outline-none focus:ring-2 focus:ring-black"
                  />
                </form>
                <button onClick={handleAddingContact}
                  className='p-3 border border-[#919191] bg-[#919191] text-white text-xl font-semibold rounded-lg w-full hover:opacity-75 duration-300'>Gửi liên hệ của bạn</button>
              </div>
            </div>
          </div>
          {/*Nhúng bản đồ từ Google maps*/}
          <div className="xl:w-1/2 h-96 xl:h-auto shadow-md">
            <iframe className='w-full h-full' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.186259227845!2d106.69221687583972!3d10.949298655979646!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d7d2575efa21%3A0x78cf5feb1b532d83!2sLAM%20Studio!5e0!3m2!1svi!2s!4v1738950322594!5m2!1svi!2s" style={{ border: '0' }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Contact