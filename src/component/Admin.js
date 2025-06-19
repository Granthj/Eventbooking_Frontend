import react, { useRef, useState , useContext} from 'react';
import {AuthContext} from '../utils/authContext';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { AdminAuthContext } from '../utils/adminAuth';

const Admin = ()=>{
    const [emailState,setemailState] = useState()
    const [passState,setpassState] = useState();
    const navigate = useNavigate();
    const {admintokenData, setAdminTokenData} = useContext(AdminAuthContext);   
    
    const submit = (e)=>{
        e.preventDefault();
        let query;
        query={
            query:`
                query{
                    adminLogin(email:"${emailState}"password:"${passState}"){
                        UserId
                        token
                        tokenExpiration
                    }
                }
            `
        }
        fetch('http://localhost:7000/graphql',{
            method:'POST',
            body:JSON.stringify(query),
            headers:{
                'Content-Type':'application/json'
            }
        }).then(response=>{
            return response.json();
        }).then(data=>{
            if(data){
                setAdminTokenData(data.data.adminLogin.token);
                if(admintokenData){
                   
                    navigate('dashboard');
                    return;
                }
            }
        })
      
       
    }
    return(
        <div>
            <form onSubmit={submit}>
                <input type="email" placeholder='Type Here' name="email" onChange={(e)=>{setemailState(e.target.value)}}></input>
                <input type="password" placeholder='Type Here' name="pass" onChange={(e)=>{setpassState(e.target.value)}}></input>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}
export default Admin;