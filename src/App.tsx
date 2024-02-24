import { useState } from 'react'
import Buttons from './components/Buttons'
import './css/App.css'
function App() {

  const [result, setResult] = useState<string[]>([])
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
  function Add(e: string) {
    value === '0' ? setValue(e)
      : numbers.find(item => {
        if (item === e && e !== '00') {
          setValue(value + e)
        }
      });

  }
  function AddToList(e: string) {
    let list = [...result];
    let val = value
    if (e === 'del') {
      return (val.length != 1
        ? val = val.substring(0, val.length - 1)
        : val = '0',
        setValue(val)
      )
    }
    if (e === '.') {
      if (list.length == 0 && !val.includes(e)) {
        val += e
      }
      !val.includes(e) ? val += e : ''
      return setValue(val)
    }
    if (list.length == 0 && e != '=') {
      list.push(val)
      list.push(e)
      val = '0'
    }
    if (list[1] != null) {
      switch (e) {
        case 'C':
          list = []
          val = '0'
          break;
        case '=':
          console.log(list);
          console.log(val)
          break;
        case '+':
          list[1] = e
          break;
        case '-':
          list[1] = e
          break;
        case 'X':
          list[1] = e
          break;
        case '/':
          list[1] = e
          break;
        case '.':
          list.pop()
          break;

        default:
          break;
      }
    }
    else {
      alert('Najpierw napisz działanie')
    }
    setResult(list)
    setValue(val)
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
