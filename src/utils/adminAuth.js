import {createContext, useState} from 'react';

export const AdminAuthContext = createContext(()=>{
})
export const AdminAuthProvider = (props)=>{
    const [admintokenData,setAdminTokenData] = useState(null);
    return (
        <>    
        <AdminAuthContext.Provider value={{admintokenData,setAdminTokenData}}>
            {props.children}
        </AdminAuthContext.Provider>
    </>
    )
}