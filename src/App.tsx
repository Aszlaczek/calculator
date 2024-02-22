import { useState } from 'react'
import Buttons from './components/Buttons'
import './css/App.css'
function App() {

  const [result, setResult] = useState([])
  const [value, setValue] = useState('0')
  const buttons = [
    'C', '%', 'del', '/',
    '1', '2', '3', 'X',
    '4', '5', '6', '-',
    '7', '8', '9', '+',
    '00', '0', '.', '='
  ]
  const numbers: string[] = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '00'
  ]
  const action: string[] = [
    'C', '%', 'del', '/', 'X', '-', '+', '=', '.'
  ]
  function Add(e: string) {
    value === '0' ? setValue(e)
      : numbers.find(item => {
        item === e ? setValue(value + e) : '';
      });
  }
  function AddToList(e: string) {
    const list: string[] = [...result];
    list.length == 0 ? list.push(value) : alert('dziala')
    console.log(list)
    setResult(list)
  }
  function chose(e: string) {
    let pom: boolean = false;
    numbers.filter(el => {
      el === e ? pom = true : ''
    })
    return pom ? Add(e) : AddToList(e)
  }
  return (
    <div className="main-container">
      <div className="card h-100 ">
        <div className="card-body">
          <h1 className='text-center'>Hello</h1>
          <span className='result'>
            <div className="answer">{result}</div>
            <div className="answer">{value}</div>
          </span>
          <div className="container buttons">
            <Buttons buttons={buttons} handleClick={(el: string) => chose(el)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
