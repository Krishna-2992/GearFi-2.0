import { useEffect, useState } from 'react'
import data from '../assets/data.json'
import { useNavigate } from 'react-router-dom'

const UserData = ({ users }) => {
  const navigate = useNavigate()

  const handleRedirect = (address) => {
    navigate(`/collection/${address}`)
  }

  return (
    <>
      {users.map((curUser) => {
        const {
          COLLECTION,
          FLOOR_PRICE,
          oneD_CHANGE,
          sevenD_CHANGE,
          oneD_VOLUME,
          sevenD_VOLUME,
          OWNERS,
          SUPPLY,
        } = curUser
        const red = oneD_CHANGE < 0
        return (
          <tr
            key={curUser.address}
            className='hover:bg-gray-600 text-center mt-4'
            onClick={() => handleRedirect(curUser.address)}
            style={{ cursor: 'pointer' }}
          >
            <td className='p-2 text-start'>
              <div className='flex items-center'>
                <img src={curUser.img} className='w-16 rounded-full m-4' />
                <p className=''>{COLLECTION}</p>
              </div>
            </td>
            <td className=''>{FLOOR_PRICE}</td>
            <td className={` ${red ? 'text-orange-700' : 'text-white'}`}>
              {oneD_CHANGE}
            </td>
            <td className='p-4'>{sevenD_CHANGE}</td>
            <td className='p-4'>{oneD_VOLUME}</td>
            <td className='p-4'>{sevenD_VOLUME}</td>
            <td className='p-4'>{OWNERS}</td>
            <td className='p-4'>{SUPPLY}</td>
          </tr>
        )
      })}
    </>
  )
}

const Chart = () => {
  const [users, setUsers] = useState([])

  const fetchUser = async () => {
    try {
      if (data.length > 0) {
        setUsers(data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <>
      <h1
        className='p-4 text-2xl text-center'
        style={{
          fontFamily: 'Inter, Arial',
          fontWeight: '500',
          letterSpacing: '0.2rem',
          fontSize: '2rem',
        }}
      >
        Top Collections
      </h1>

      <div className=' flex justify-center mt-10'>
        <table className='text-sm w-[80%]'>
          <thead className=' border-b border-white'>
            <tr>
              <th className='text-start pl-4'>COLLECTION</th>
              <th className=''>FLOOR PRICE</th>
              <th className=''>1D CHANGE</th>
              <th className=''>7D CHANGE</th>
              <th className=''>1D VOLUME</th>
              <th className=''>7D VOLUME</th>
              <th className=''>OWNERS</th>
              <th className=''>SUPPLY</th>
            </tr>
          </thead>
          <tbody>
            <UserData users={users} />
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Chart
