import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(() => {});

export const AuthProvider = (props) => {
    const [authData, setAuthData] = useState({
        Email: null,
        CustomerId: null,
        loading: true
    });

    useEffect(() => {

        fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    query {
                        checkLoggedIn {
                            CustomerId
                            Email
                        }
                    }
                `
            })
        })
        .then(res => res.json())
        .then(data => {

            // ✅ Only call setAuth if data is valid
            if (data.data && data.data.checkLoggedIn) {
                const { CustomerId, Email } = data.data.checkLoggedIn;
                setAuth(CustomerId, Email);
            } else {
                setAuth(null, null);
            }
        })
        .catch(err => {
            setAuth(null, null);
        });
    }, []);

    const setAuth = (CustomerId, Email) => {
        setAuthData({
            CustomerId,
            Email,
            loading: false
        });
    };

    const logOut = () => {
        setAuthData({
            CustomerId: null,
            Email: null,
            loading: false
        });
        fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                query: `
                    mutation {
                        logOut{
                            message
                        }
                    }
                `
            })
        }).then(res => res.json());
    };

    return (
        <AuthContext.Provider value={{ ...authData, setAuth, logOut }}>
            {props.children}
        </AuthContext.Provider>
    );
};
