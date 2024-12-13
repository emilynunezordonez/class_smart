import { ProductList } from "../../components/products/ProductList"
import { useNavigate, useParams } from "react-router-dom"
import { Navigation } from '../../components/products/Navigation'

export function ProductPage() {
  const params = useParams(); // Obtén todos los parámetros como un objeto
  const { criteria, value } = params;
  console.log(params)
  return (

    <div>
      <Navigation />
      <div className='container mx-auto mt-4'><ProductList searchCriteria={criteria} searchValue={value}></ProductList></div>
    </div>
  )
}

