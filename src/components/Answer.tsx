
type Props = {
    item: number,
    list: number[]
}
function Answer(props: Props) {
    return (
        <div className="fs-1 bg-danger ">
            {props.item ? props.item : '0'}
        </div>

    )
}

export default Answer
