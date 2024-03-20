import { useState } from 'react'
import Buttons from './components/Buttons'
import './css/App.css'

function App() {

  const [number, setNumber] = useState('');
  const [answer, setAnswer] = useState('');
  const [operation, setOperation] = useState('');
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

  function decision(e: string) {
    numbers.includes(e)
      ? setNumber(prev => prev + e)
      : operaction(e)
  }

  function calculate() {
    if (operation === '' || number === '') {
      alert('Podaj liczbę')
      return setNumber(answer)
    }
    let result: number = parseFloat(answer);
    switch (operation) {
      case '+':
        result += parseFloat(number)
        break
      case '-':
        result -= parseFloat(number)
        break
      case 'x':
        result *= parseFloat(number)
        break
      case '/':
        number === '0' ? alert('nie można dzielić przez 0')
          : result /= parseFloat(number)
        break
      case '%':
        result %= parseFloat(number)
        break
    }
    setNumber(result.toString())
  }

  function operaction(e: string) {
    switch (e) {
      case '.':
        number.includes('.') ? '' :
          number === '' ? setNumber('0.') : setNumber(prev => prev + '.')
        break
      case 'C':
        setNumber('')
        setAnswer('')
        setOperation('')
        break
      case 'del':
        setNumber(prev => prev.slice(0, -1))
        break
      case '+':
        if (number !== '') {
          setAnswer(number)
          setNumber('')
          setOperation('+')
        }
        break;
      case '-':
        if (number !== '') {
          setAnswer(number)
          setNumber('')
          setOperation('-')
        }
        break
      case 'X':
        if (number !== '') {
          setAnswer(number)
          setNumber('')
          setOperation('x')
        }
        break
      case '/':
        if (number !== '') {
          setAnswer(number)
          setNumber('')
          setOperation('/')
        }
        break
      case '%':
        if (number !== '') {
          alert('Będziesz wykonywać działanie modulo (reszta z dzielenia)')
          setAnswer(number)
          setNumber('')
          setOperation('%')
        }
        break
      case '=':
        // Maprawić NaN przy naciśnięciu = bez liczb
        calculate()
        setAnswer('')
        setOperation('')
        setOperation('')
        break
    }
  }
  function show() {
    if (operation !== '') {
      return (answer + operation + number)
    } else {
      return ''
    }
  }

  return (
    <div className="main-container">
      <div className="card h-100 ">
        <div className="card-body">
          <h1 className='text-center'>Hello</h1>
          <span className='result'>
            <div className="answer">{show()}</div>
            <div className="answer">{number}</div>
          </span>
          <div className="container buttons">
            <Buttons buttons={buttons} handleClick={(el: string) => decision(el)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
