import { useEffect, useState } from 'react'
import axios from 'axios'

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([])
  const [values, setValues] = useState({})
  const [index, setIndex] = useState('')

  const getSeenIndexes = async () => {
    const { data } = await axios.get('/api/values/current')
    setSeenIndexes(data)
  }

  const getValues = async () => {
    const { data } = await axios.get('/api/values/all')
    setValues(data)
  }

  // const getIndex = async () => {
  //   const {data} = await axios.get('/app/values/')
  //   setIndex(data)
  // }

  useEffect(() => {
    getSeenIndexes()
  }, [])

  useEffect(() => {
    getValues()
  }, [])

  return (
    <div>
      <form>
        <label> Enter your index: </label>
        <input />
        <button> Submit </button>
      </form>
    </div>
  )
}

export default Fib
