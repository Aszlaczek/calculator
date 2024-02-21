import './css/App.css'
import Keys from './components/Keys';
import Answer from './components/Answer';
import { useState } from 'react';
function App() {
  const [value, setValue] = useState<string[]>([]);
  const [number1, setNumber1] = useState<string>('');
  let list: number[] = []
  const numbers: string[] = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
  ]
  const actions: string[] = [
    'del', 'C', '+', '-', 'X', '/'
  ]
  function Calc(el: string) {
    let list = [...value]
    switch (el) {
      case 'C':
        list = []
        setNumber1('')
        break;
      case 'del':
        setNumber1(number1.replace(number1.slice(-1), ''))
        break;
      case '+':
        list.push(parseFloat(number1))
        setNumber1('')
        break;
      case '=':
        console.log(el)
        break;
      default:
        console.log('Nic sie nie dzieje')
        break;
    }
    console.log(list.map(el => { return el }))
  }

  return (
    <div className="main-container">
      <header className='text-center'><h1>Hello try my calculator</h1></header>
      <div className="container bg-light mt-4">
        <section className='w-100 fs-1 d-flex justify-content-end result'>
          <Answer list={list} item={parseFloat(number1)} />
        </section>
      </div>
      <div className="keys">
        <Keys addNumber={(item: string) => setNumber1(number1 + item)} makeCacl={(item: string) => Calc(item)} numbers={numbers} actions={actions} />
      </div>
    </div>

  )
}

export default App
