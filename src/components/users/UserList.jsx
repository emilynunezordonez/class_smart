import { useEffect, useState } from "react"
import { getAllUsers,searchUsers } from "../../api/users.api"
import { UserCard } from "./UserCard"
export function UserList({ searchCriteria, searchValue }) {

  const [users, setUsers] = useState([])
  
  useEffect(() => {
    async function loadUsers() {
      try {

        


        if (searchCriteria!=undefined && searchValue!=undefined) {
          
          const res = await searchUsers(searchCriteria,searchValue)
          
          setUsers(res.data['users'])

        } else {
          
          const res = await getAllUsers()
          
          
          setUsers(res.data)
        }
      } catch {
        console.log("Error al cargar los datos")
      }

    }
    loadUsers()
  }, [searchCriteria,searchValue])

  return (
    <div className="grid grid-cols-3 gap-3">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}

    </div>
  )
}
