/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react"

const CitiesContext = createContext();

const Cities = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState({ id: "", code: 0, name: "" });
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState({ id: "", code: 0, name: "" });
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState({ id: "", code: 0, name: "" });

  useEffect(() => {
    //Lấy danh sách tỉnh/thành
    const getCities = async () => {
      try {
        const response = await axios.get('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
        setCities(response.data.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    //Lấy danh sách quận/huyện
    const getDistricts = async (code) => {
      try {
        const response = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${code}&limit=-1`)
        setDistricts(response.data.data.data || []);
      } catch (error) {
        console.log(error)
      }
    }

    //Lấy danh sách phường xã
    const getWards = async (code) => {
      try {
        const response = await axios.get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${code}&limit=-1`)
        setWards(response.data.data.data || []);
      } catch (error) {
        console.log(error)
      }
    }

    getCities();
    getDistricts(selectedCity.code);
    getWards(selectedDistrict.code)
  }, [selectedCity.code, selectedDistrict.code])

  //Thay đổi tỉnh/thành
  const handleCityChange = (e) => {
    const cityCode = e.target.value;
    const cityId = cities.find((element) => (element.code === cityCode))._id;
    const cityName = cities.find((element) => (element._id === cityId)).name;

    setSelectedCity({ id: cityId, code: cityCode, name: cityName })
  }

  //Thay đổi quận/huyện
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const districtId = districts.find((element) => (element.code === districtCode))._id;
    const districtName = districts.find((element) => (element._id === districtId)).name;

    setSelectedDistrict({ id: districtId, code: districtCode, name: districtName })
  }

  //Thay đổi phường xã
  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const wardId = wards.find((element) => (element.code === wardCode))._id;
    const wardName = wards.find((element) => (element._id === wardId)).name;

    setSelectedWard({ id: wardId, code: wardCode, name: wardName })
  }
  return (
    <CitiesContext.Provider value={{
      cities, setCities, selectedCity, setSelectedCity, districts, setDistricts, selectedDistrict, setSelectedDistrict,
      wards, setWards, selectedWard, setSelectedWard, handleCityChange, handleDistrictChange, handleWardChange
    }}>
      {children}
    </CitiesContext.Provider>
  )
}
export { CitiesContext, Cities };