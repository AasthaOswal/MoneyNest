import { createContext,useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { getSocketToken } from "../socket/socketToken";
import { initSocket } from "../socket/socket";
import { setupNotificationListener } from "../socket/socketNotification";
import api from "../axios/axios"

export const AuthContext = createContext()


export const AuthProvider = ({ children }) => { 

    const navigate = useNavigate();

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);

    // Runs ONCE when app loads — checks if cookie is still valid
    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const res = await api.get("/user/me");
                const currentUser = res.data.user;

                setUser(currentUser);


            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        getAndSetUser();
    }, []);


    useEffect(()=>{

        if (!user) return;

            const setup = async ()=>{

                const ENV=import.meta.env.VITE_ENV;

                const API_URL = ENV == "production" ? "/api" :  import.meta.env.VITE_API_URL;

                const socketRes = await getSocketToken();

                let token = localStorage.getItem("socketToken");
                console.log("Socket token:",token)

                console.log(socketRes);


                // initialize authenticated socket
                initSocket();

                setupNotificationListener((data) => {
                console.log("inside notification listener")
                console.log(data)
                toast.success(`${data.notification.title} - ${data.notification.body}`);
                });
            };

            setup();

    }, [user]);


    
    const login = async (userData)=>{

        setLoading(true);

        try {
            const data = await AuthService.login(userData);
            console.log(data);
            setUser(data.user);
            return data.user;
        

        } catch (error) {
            console.log(error);
        }finally{
            setLoading(false);
        }

    };


    const signup = async (userData)=>{

        setLoading(true);

        try {
            const data = await AuthService.signup(userData);
            console.log(data);
            setUser(data.user);
            return data.user;
            
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            setLoading(false);
        }

    };

      const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };




    


    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading, login, signup, logout}} >
            {children}
        </AuthContext.Provider>
    )

    
}