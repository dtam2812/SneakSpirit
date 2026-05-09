import axios from "axios";
import { createContext, useEffect, useState } from "react";

const CitiesContext = createContext();
const BASE_URL = "https://provinces.open-api.vn/api/v1";

const Cities = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState({ code: "", name: "" });
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState({
    code: "",
    name: "",
  });
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState({ code: "", name: "" });

  useEffect(() => {
    axios
      .get(`${BASE_URL}/?depth=1`)
      .then((res) => setCities(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedCity.code) return;
    setDistricts([]);
    setSelectedDistrict({ code: "", name: "" });
    setWards([]);
    setSelectedWard({ code: "", name: "" });

    axios
      .get(`${BASE_URL}/p/${selectedCity.code}?depth=2`)
      .then((res) => setDistricts(res.data.districts || []))
      .catch(console.error);
  }, [selectedCity.code]);

  useEffect(() => {
    if (!selectedDistrict.code) return;
    setWards([]);
    setSelectedWard({ code: "", name: "" });

    axios
      .get(`${BASE_URL}/d/${selectedDistrict.code}?depth=2`)
      .then((res) => setWards(res.data.wards || []))
      .catch(console.error);
  }, [selectedDistrict.code]);

  const handleCityChange = (e) => {
    const code = Number(e.target.value);
    const city = cities.find((c) => c.code === code);
    if (city) setSelectedCity({ code: city.code, name: city.name });
  };

  const handleDistrictChange = (e) => {
    const code = Number(e.target.value);
    const district = districts.find((d) => d.code === code);
    if (district)
      setSelectedDistrict({ code: district.code, name: district.name });
  };

  const handleWardChange = (e) => {
    const code = Number(e.target.value);
    const ward = wards.find((w) => w.code === code);
    if (ward) setSelectedWard({ code: ward.code, name: ward.name });
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        selectedCity,
        setSelectedCity,
        districts,
        selectedDistrict,
        setSelectedDistrict,
        wards,
        selectedWard,
        setSelectedWard,
        handleCityChange,
        handleDistrictChange,
        handleWardChange,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

export { CitiesContext, Cities };
