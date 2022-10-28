

function TermDisplay(props) {

    const {
        type,
        greek,
        english,
        takesCase
    } = props.term

    return (
        <div>
            <strong style={{fontFamily: 'tahoma', fontSize: '20px'}}>{greek.replaceAll(',', ', ')}</strong>
            <p style={{color: 'gray'}}>
                {english}
                {takesCase != 'NA' ? <em style={{marginLeft: '4px', color: 'blue'}}>takes the {takesCase}</em> : null}
            </p>
        </div>
    )
}

export default TermDisplay