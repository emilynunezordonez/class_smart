import { UserList } from "../../components/users/UserList"
import { useParams } from "react-router-dom"
import { Navigation } from '../../components/users/Navigation'

export function UserPage() {
  const params = useParams(); // Obtén todos los parámetros como un objeto
  const { criteria, value } = params;
  
  return (

    <div>
      <Navigation />
      <div className='container mx-auto mt-4'><UserList searchCriteria={criteria} searchValue={value}></UserList></div>

    </div>

  )
}

