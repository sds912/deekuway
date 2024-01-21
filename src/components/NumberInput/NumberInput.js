import { useState } from "react"

export const NumberInput  = ({onValueChange}) => {

    const [value, setValue] = useState(0);

    const increment = () => {
        setValue(value+1);
    }

    const decrement = () => {
        value > 0 ? setValue(value-1): setValue(0);
    }
    return (
    <div className="d-flex justify-content-between align-items-center px-3" 
     style={{
        border: 'none',
        height: '46px',
        borderRadius: '23px',
        backgroundColor: '#F4F4F4'
     }}
    >
      <button 
      className="text-center fw-bold" 
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none'
      }}
      onClick={() => decrement()}>-</button>  
      <div className="mx-3" style={{
        width: '40px !important'
      }}>
        <input 
            style={{
                backgroundColor: 'white',
                border: 'none',
                outline: 'none',
                width: '100%',
                height: '46px',
                borderRadius: '23px'

            }}
        className="text-center fw-bold" value={value} readOnly onChange={onValueChange} />
      </div>
    
      <button 
        className="text-center fw-bold" 
        style={{
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none'
          }}
      onClick={() => increment()}>+</button>
    </div>
    )
}