import './css/App.css'
import Keys from './components/Keys';
import Answer from './components/Answer';
import { useState } from 'react';
function App() {
  const [value, setValue] = useState(['0']);
  const [result, setResult] = useState(0);
  const numbers: number[] = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 0
  ]
  const actions: string[] = [
    'del', 'C', '+', '-', 'X', '/'
  ]

  function getAction(action: string | number) {
    let listOfAll = [...value]
    let listOnlyNumber = [...value]
    switch (action) {
      case '=':
        alert(result)
        break;


      default:
        listOfAll.push(action)
        break;
    }


  }

  return (
    <div className="main-container">
      <header className='text-center'><h1>Hello try my calculator</h1></header>
      <div className="container bg-light mt-4">
        <section className='w-100 fs-1 d-flex justify-content-end result'>
          <Answer item={value} />
        </section>
      </div>
      <div className="keys">
        <Keys handleClick={(item: string) => getAction(item)} numbers={numbers} actions={actions} />
      </div>
    </div>

  )
}

export default App
