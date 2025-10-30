import React, { createContext, useContext, useState, useEffect } from "react";


const AppContext = createContext();

export const ContextProvider = ({ children }) => {

    const [internalActiveSection, setInternalActiveSection] = useState("Dashboard")
    const [Profile, setProfile] = useState(null)
    const [transactions, settransactions] = useState([])


     return (
        <AppContext.Provider value={{internalActiveSection,setInternalActiveSection ,Profile, setProfile ,transactions, settransactions}}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};