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

  useEffect(() => {
    getSeenIndexes()
  }, [])

  useEffect(() => {
    getValues()
  }, [])

  const renderSeenIndexes = () => {
    seenIndexes.map((seenIndex) => seenIndex.index).join(', ')
  }

  const renderValues = () => {
    values.map((value) => value).join(', ')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    await axios.post('/api/values', {
      index,
    })
    setIndex(index)
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label> Enter your index to find Fibinacy numbers: </label>
        <input value={index} onChange={(event) => event.target.value} />
        <button> Submit </button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes}
      <h3>Calculated values:</h3>
      {renderValues}
    </div>
  )
}

export default Fib
