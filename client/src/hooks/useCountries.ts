import countries  from "world-countries";

const formattedCountries = countries.map((country) => ({
  value: country.cca2,//ma quoc gia
  label: country.name.common,//ten quoc gia tieng anh
  flag: country.flag,//co quoc gia
  latlng: country.latlng,// lay toa do
  region: country.region// lay thong tin khu vuc
}))

export const useCountries = () => {
  const getAll = () => formattedCountries

  const getByValue = (value: string) => {
    return formattedCountries.find((item) => item.value === value )
  }

  return {
    getAll, getByValue
  }
}