import '../css/Keys.css'
type Props = {
    makeCacl: Function,
    addNumber: Function,
    actions: string[],
    numbers: string[]
}
function Keys(props: Props) {

    return (
        <div className="container keys-bord mt-5">
            <div className="row row-cols-4 d-flex justify-content-center">
                {props.actions.map((el, i) => {
                    return (
                        <button type='button' className="item fs-1 " key={i} onClick={() => props.makeCacl(el)}>{el}</button>
                    )
                })}
                {props.numbers.map((el, i) => {
                    return (
                        <button type='button' className="item fs-1 " key={i} onClick={() => props.addNumber(el)}>{el}</button>
                    )
                })}
                <button type='button' className="item fs-1 g-3 w-100 " onClick={() => props.makeCacl('=')}>=</button>
            </div>
        </div>
    )
}

export default Keys
