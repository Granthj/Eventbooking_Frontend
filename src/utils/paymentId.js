import {createContext, useState} from 'react';

export const PaymentContext = createContext(()=>{
})
export const PaymentProvider = (props)=>{
    const [paymentId,setpaymentId] = useState();
    return (
        <>    
        <PaymentContext.Provider value={{paymentId,setpaymentId}}>
            {props.children}
        </PaymentContext.Provider>
    </>
    )
}