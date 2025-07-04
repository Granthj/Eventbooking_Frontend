
import react, { useRef, useState, useContext, useEffect } from 'react';
import Modal from './Modals';
import { AuthContext } from '../utils/authContext';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminEventList from './AdminEventList';

const Dashboard = () => {
    const [state, setState] = useState(false);
    const [title, setTitle] = useState();
    const [price, setPrice] = useState();
    const [desc, setDesc] = useState();
    const [date, setDate] = useState();
    const [city, setCity] = useState();
    const [State, set_State] = useState();
    const [address, setAddress] = useState();
    const [image,setImage] = useState();
    const [imageUrl,setImageUrl] = useState(null);
    const [value, setValue] = useState();
    const [bool, setBool] = useState(false);
    const [is, isSet] = useState(false);
    function setModalHandler() {
        setState(true);
    }
    function closeHandler() {
        setState(false);
    }
    const Upload = async ()=>{
        const formData = new FormData();
        formData.append('file',image)
        const res = await fetch( `${process.env.REACT_APP_API_URL}/upload-img`,{
            method:'POST',
            body:formData
        })
  

    const data = await res.json();
        setImageUrl(data.imageUrl);
    }
    const valueConfirmHandler = (e) => {
        e.preventDefault();
        if(imageUrl === null){
            return;
        }
        let event = { title, price, date, desc };
        setState(false);
        const requestBody = {
            query: `
            mutation{
                createEvent(eventInput:{title:"${title}",price:${price},desc:"${desc}",date:"${date}",city:"${city}",state:"${State}",address:"${address}",image:"${imageUrl}"}){
                    title
                    price
                    desc
                    date
                }
            }
            `
        }
        fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
        })
    }
    const eventReqBody = {
        query: `
        query{
            event{
                _id
                title
                price
                desc
                date
                city
                state
                address
                bookedBy{
                    email
                }
            }    
        }
        `
    }
    return (
        <>
            <h1>DASHBOARD</h1>
            {state && <Modal close closeModal={closeHandler} confirm={valueConfirmHandler} >
                <form encType="multipart/form-data">
                    <label htmlFor='title'>Title</label>
                    <input className="form-control" type="text" onChange={(e) => { setTitle(e.target.value) }}></input>
                    <br></br>
                    <label htmlFor='price'>Price</label>
                    <input className="form-control" type="number" onChange={(e) => setPrice(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='date'>Date</label>
                    <input className="form-control" type="datetime-local" onChange={(e) => setDate(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='city'>City</label>
                    <input className="form-control" type="text" onChange={(e) => setCity(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='state'>State</label>
                    <input className="form-control" type="text" onChange={(e) => set_State(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='address'>Address</label>
                    <input className="form-control" type="text" onChange={(e) => setAddress(e.target.value)}></input>
                    <br></br>
                    <label htmlFor='description'>Description</label>
                    <textarea className="form-control" type="text" onChange={(e) => setDesc(e.target.value)}></textarea>
                    <br></br>
                    <label htmlFor='image'>Image</label>
                    <input className="form-control" type="file" onChange={(e) => setImage(e.target.files[0])} />
                    <button type="button" onClick={Upload}>upload</button>

                </form>
            </Modal>}
            {<button className='btn btn-primary' onClick={setModalHandler}>Create Event</button>}
            <br></br>

        </>
    )
}
export default Dashboard;