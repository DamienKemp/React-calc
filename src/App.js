import { useReducer } from "react";
import DigitButton from "./digitButton";
import OperationButton from "./operationButton";
import "./styles.css"

export const actions = {
  add_digit : 'add-digit',
  clear:'clear',
  delete_digit:'deletet-digit',
  choose_operation:'choose-operation',
  evaluate:'evaluate'
}

function reducer(state,{type,payload}){

  switch(type){
    case actions.add_digit:
      if(state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false,
        }
      }
      if(payload.digit === '0' && state.currentOperand ==='0')
      {
        return state
      }
      if(payload.digit === '.' && state.currentOperand.includes('.')) 
      {
        return state
      }

      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    case actions.clear:
      return {}

    case actions.choose_operation:
      if(state.currentOperand == null && state.previousOperand == null)
      {
        return state
      }

      if(state.currentOperand == null){
        return{
          ...state,
          operation:payload.operation
        }
      }

      if(state.previousOperand == null)
      {
        return{
          ...state,
          operation:payload.operation,
          previousOperand: state.currentOperand,
          currentOperand:null
        }
      }

      return{
        ...state,
        previousOperand: evaluate(state),
        operation:payload.operation,
        currentOperand: null
      }

    case actions.evaluate:
      if(state.operation == null || state.currentOperand == null || state.previousOperand == null){
        return state
      }

      return{
        ...state,
        previousOperand:null,
        currentOperand:evaluate(state),
        operation:null,
        overwrite:true
      }

    case actions.delete_digit:
      if(state.overwrite){
        return{
          ...state,
          currentOperand:null,
          overwrite:false
        }
      }

      if(state.currentOperand ==null){
        return state
      }

      if(state.currentOperand.length ===1){
        return{
          ...state,
          currentOperand:null
        }
      }

      return{
        ...state,
        currentOperand: state.currentOperand.slice(0,-1)
      }
  }

}

function evaluate({currentOperand,previousOperand,operation}){
  const previous = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)

  if(isNaN(previous) || isNaN(current)){
    return ""
  }

  let computation = ""
  switch(operation){
    case "+":
      computation = previous + current;
      break
    case "*":
      computation = previous * current;
      break
    case "-":
      computation = previous - current;
      break
    case "÷":
      computation = previous / current;
      break
  }

  return computation.toString()
}

const Integer_formater =new Intl.NumberFormat('en-us',{ maximumFractionDigits: 0,})

function formatOperand(operand){
  if(operand == null){
    return
  }
  const[integer,decimal] = operand.split('.')
  if(decimal == null){
    return Integer_formater.format(integer)
  }

  return `${Integer_formater.format(integer)}.${decimal}`
}
function App() {

  const [{currentOperand,previousOperand,operation},dispatch] = useReducer(
    reducer,
    {}
  )

 

  return (
    <div className="clac-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{ formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch ({type: actions.clear})}>AC</button>
      <button onClick={() => dispatch ({type: actions.delete_digit})}>DEL</button>
      <OperationButton  operation="÷" dispatch = {dispatch} />
      <DigitButton  digit="1" dispatch = {dispatch} />
      <DigitButton  digit="2" dispatch = {dispatch} />
      <DigitButton  digit="3" dispatch = {dispatch} />
      <OperationButton  operation="*" dispatch = {dispatch} />
      <DigitButton  digit="4" dispatch = {dispatch} />
      <DigitButton  digit="5" dispatch = {dispatch} />
      <DigitButton  digit="6" dispatch = {dispatch} />
      <OperationButton  operation="+" dispatch = {dispatch} />
      <DigitButton  digit="7" dispatch = {dispatch} />
      <DigitButton  digit="8" dispatch = {dispatch} />
      <DigitButton  digit="9" dispatch = {dispatch} />
      <OperationButton  operation="-" dispatch = {dispatch} />
      <DigitButton  digit="." dispatch = {dispatch} />
      <DigitButton  digit="0" dispatch = {dispatch} />
      <button className="span-two" onClick={() => dispatch ({type: actions.evaluate})}>=</button>
    </div>
  )
}

export default App;
