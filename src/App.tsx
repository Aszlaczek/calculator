import { useState } from 'react'
import Buttons from './components/Buttons'
import './css/App.css'
function App() {

  // wartości przechowywane w liście
  // pokazanie odpowiedniego działania
  const [result, setResult] = useState<string[]>([])
  // przechowywanie odpowiedniej wartości w stanie
  const [value, setValue] = useState('0')
  const buttons: string[] = [
    'C', '%', 'del', '/',
    '1', '2', '3', 'X',
    '4', '5', '6', '-',
    '7', '8', '9', '+',
    '0', '.', '='
  ]
  const numbers: string[] = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
  ]

  //  Funkcja zmiany stanu liczby 
  function Add(e: string) {
    value === '0' ? setValue(e)
      : numbers.find(item => {
        if (item === e) {
          setValue(value + e)
        }
      });
  }

  // Funcja do wybrania i wykonania 
  // odpowiedniego dzialania
  function Calculate() {
    const list = [...result]
    const val = parseFloat(value)
    let num: number = parseFloat(list[0])
    isNaN(num) ? num = val : ''
    switch (list[1]) {
      case '+':
        num += val
        break
      case '-':
        num -= val
        break
      case 'X':
        num *= val
        break
      case '/':
        val === 0 ? alert('nie możesz dzielić przez zero!')
          : num /= val
        break
      case '%':
        num %= val
        break
    }
    return num
  }
  // Dodawanie do listy, pokazanie odpowiedniego działania
  function AddToList(e: string) {
    let list = [...result];
    let val = value
    // usuwanie ostatniego elementu
    if (e === 'del') {
      return (val.length != 1
        ? val = val.substring(0, val.length - 1)
        : val = '0',
        setValue(val)
      )
    }
    // zmiana na liczbę zmiennoprzecinkową
    // z uwzględnieniem tylko jedno przecinka
    if (e === '.') {
      if (list.length == 0 && !val.includes(e)) {
        val += e
      }
      !val.includes(e) ? val += e : ''
      return setValue(val)
    }
    // zmiana pierwszej wartości
    if (list.length == 0) {
      val != '0' ? list.push(val) && list.push(e) : ''
      val = '0'
    }
    // dostosowanie odpowiedniej funcji
    if (list[1] != null) {
      // zabezpieczenie przed dodaniem liczby z kropką na końcu
      list[0].includes('.', list[0].length - 1)
        ? list[0] = list[0].substring(0, list[0].length - 1) : '';
      switch (e) {
        case 'C':
          list = []
          val = '0'
          break;
        case '=':
          // wywołanie funkcji liczącej
          val = Calculate().toString()
          list = []
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
  // Funckja do wyboru odpowiedniego przypadku
  // Czy to jest cyfra czy to ma być działanie
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
