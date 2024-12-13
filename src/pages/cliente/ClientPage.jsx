
import { ClientList } from "../../components/cliente/ClientList"
import { useParams } from "react-router-dom"
import { Navigation } from '../../components/cliente/Navigation'

export function ClientPage() {
  const params = useParams(); // Obtén todos los parámetros como un objeto
  const { criteria, value } = params;
  
  return (
    <div>
      <Navigation />
      <div className='container mx-auto mt-4'><ClientList searchCriteria={criteria} searchValue={value}></ClientList></div>

    </div>

  )
}
