import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import ErrorDialogueBox from '../MUIDialogueBox/ErrorDialogueBox';
import axios from "axios";
import Box from '@mui/material/Box';
import { UserContext } from '../../Context/UserContext'

function DoctorProfile() {

    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [userId, setUserId] = useState('');
    const [doctorId, setDoctorId] = useState('');

    const [passwordMatchDisplay, setPasswordMatchDisplay] = useState('none');
    const [passwordValidationMessage, setPasswordValidationMessage] = useState('');

    const [errorDialogueBoxOpen, setErrorDialogueBoxOpen] = useState(false);
    const [errorList, setErrorList] = useState([]);

    const handleDialogueOpen = () => {
        setErrorDialogueBoxOpen(true)
    };

    const handleDialogueClose = () => {
        setErrorList([]);
        setErrorDialogueBoxOpen(false)
    };

    // GET doctor details
    const getdoctorById = async () => {

        let doctorUserId = currentUser.userId;

        const response = await axios.get(`http://localhost:5000/profile/doctor/` + doctorUserId);

        setDoctorId(response.data._id);
        setFirstName(response.data.userId.firstName);
        setLastName(response.data.userId.lastName);
        setEmail(response.data.userId.email);
        setUsername(response.data.userId.username);
        setPhone(response.data.phone);
        setDepartment(response.data.department);
        setUserId(response.data.userId._id);
    };

    // UPDATE doctor profile
    const updatedoctoruser = async (e) => {

        e.preventDefault();

        try {

            const updateData = {
                firstName,
                lastName,
                username,
                email,
                phone,
                department,
                userId
            };

            if (password) {
                updateData.password = password;
                updateData.confirmPassword = confirmPassword;
            }

            await axios.patch(`http://localhost:5000/profile/doctor/${doctorId}`, updateData);

            navigate("/profile");

        } catch (error) {

            console.log(error);

            setErrorList(error.response.data.errors);
            handleDialogueOpen();
        }
    };


    // Password validation
    useEffect(() => {

        if (password && password?.trim()?.length > 0 && password?.trim()?.length <= 6) {

            setPasswordValidationMessage('Password Length must be greater than 6 characters');

        } else {

            setPasswordValidationMessage('');
        }

        if (password === confirmPassword) {

            setPasswordMatchDisplay('none');

        } else {

            setPasswordMatchDisplay('block');
        }

    }, [password, confirmPassword])


    useEffect(() => {

        getdoctorById();

    }, []);


    return (

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

            <div className="page-wrapper">

                <div className="content">

                    <div className="card-box">

                        <div className="row">

                            <div className="col-lg-8 offset-lg-2">

                                <h3 className="page-title">Update Profile</h3>

                            </div>

                        </div>

                        <div className="row">

                            <div className="col-lg-8 offset-lg-2">

                                <form onSubmit={updatedoctoruser}>

                                    <div className="row">

                                        <div className="col-sm-6">

                                            <div className="form-group">

                                                <label>First Name *</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    required
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                />

                                            </div>

                                        </div>

                                        <div className="col-sm-6">

                                            <div className="form-group">

                                                <label>Last Name</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    required
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                />

                                            </div>

                                        </div>

                                        <div className="col-sm-6">

                                            <div className="form-group">

                                                <label>Username *</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    required
                                                    value={username}
                                                    onChange={(e) => setUsername(e.target.value)}
                                                />

                                            </div>

                                        </div>

                                        <div className="col-sm-6">

                                            <div className="form-group">

                                                <label>Email *</label>

                                                <input
                                                    className="form-control"
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />

                                            </div>

                                        </div>

                                        <div className="col-sm-6">

                                            <div className="form-group">

                                                <label>Password</label>

                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />

                                            </div>

                                        </div>

                                        <div className="col-sm-6">

                                            <div className="form-group">

                                                <label>Confirm Password</label>

                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />

                                            </div>

                                        </div>

                                        <div className="col-sm-6">

                                            <div className="form-group">

                                                <label>Phone</label>

                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                />

                                            </div>

                                        </div>

                                        <div className="col-sm-6">

                                            <div className="form-group">

                                                <label>Department</label>

                                                <select
                                                    disabled
                                                    className="form-select"
                                                    value={department}
                                                >

                                                    <option value="Cardiology">Cardiology</option>
                                                    <option value="Gynecology">Gynecology</option>
                                                    <option value="Hematology">Hematology</option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="m-t-20 text-center">

                                        <button type="submit" className="btn btn-primary submit-btn">

                                            Update Profile

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </div>

                <ErrorDialogueBox
                    open={errorDialogueBoxOpen}
                    handleToClose={handleDialogueClose}
                    ErrorTitle="Error: Edit doctor"
                    ErrorList={errorList}
                />

            </div>

        </Box>

    )
}

export default DoctorProfile;