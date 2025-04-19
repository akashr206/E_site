import React from 'react'
import { useNavigate } from 'react-router-dom';
import InputDisable from '../../components/ui/InputDisable';
import { useAuth } from '../../Contexts/AuthContext';
const Info = (props) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate('/')
        // setMobileMenuOpen(false)
      }

    return (
        <div className={`${props.isMobile ? "p-5" : "shadow-md p-6"} `}>
            <h2 className="text-xl font-semibold mb-4">
                Personal Information{" "}
            </h2>
            <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label >First Name </label>
                        <InputDisable
                            type="text"
                            value={props.user.name.split(" ")[0]}
                            placeholder="First Name"
                        />
                    </div>
                    <div>
                        <label >Second Name </label>
                        <InputDisable
                            type="text"
                            placeholder="Last Name"
                            value={props.user.name.split(" ")[1]}
                            className="p-3 border border-gray-300 bg-transparent outline-pink-500 active:border-pink-600 rounded-md w-full"
                        />
                    </div>


                </div>

                <div>
                    <label className="block text-gray-600 mb-2">
                        Email Address{" "}
                    </label>
                    <InputDisable
                        type="email"
                        value={props.user && props.user.email}
                        placeholder="Email Address"
                        disabled
                        className="p-3 border border-gray-300 rounded-md bg-transparent w-full"
                    />
                </div>

            </form>
            <p className="text-lg cursor-pointer text-red-500 my-3 font-semibold flex justify-center" onClick={handleLogout}>
                Logout
              </p>
        </div>
    )
}

export default Info
