import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import AccSV from '../Service/AccountService';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Swal from 'sweetalert2';
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ChangeInfo() {

    const serverUrl = "https://dvhl-forum-be.herokuapp.com";

    let navigate = useNavigate();

    const [newAvatar, setNewAvatar] = useState();

    const [avatar, setAvatar] = useState();

    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");

    const [phone, setPhone] = useState("");

    const [dateOfBirth, setDateOfBirth] = useState("");

    const [email, setEmail] = useState("");

    const [pass, setPass] = useState("");

    const [repass, setRepass] = useState("");

    const [update, setUpdate] = useState(false);

    const reload = () => { setUpdate(!update) }

    useEffect(() => {
        setLoading(true);
        const ourRequest = axios.CancelToken.source();
        setTimeout(async () => {
            await AccSV.getAccInfo(ourRequest).then(res => {
                if (res.data.status === 401) {
                    Swal.fire({
                        icon: 'danger',
                        title: 'Session expired !!!!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    navigate("/")
                }
                setName(res.data.data.name);
                setPhone(res.data.data.phone);
                setEmail(res.data.data.email);
                setDateOfBirth(res.data.data.birthdate);
                setAvatar(res.data.data.avatarUrl);
                localStorage.setItem("avatar", res.data.data.avatarUrl);
            })
            setLoading(false);
            return () => {
                ourRequest.cancel('Request is canceled by user');
            }
        }, 800);
    }, [update]);

    const changeAvatar = (e) => {
        setNewAvatar(e.target.files[0]);
    }

    const uploadAvatar = () => {
        const formData = new FormData();
        if (newAvatar === undefined) {
            toast.error('Please choose avatar !!!', {
                position: "top-right",
                autoClose: 5000,
            });
        } else {
            formData.append("avatar", newAvatar, newAvatar.name);
            AccSV.uploadAvatar(formData).then(res => {
                if (res.data.status === "OK") {
                    toast.success('Upload avatar successful !!!', {
                        position: "top-right",
                        autoClose: 5000,
                    });
                    reload();
                } else {
                    toast.error('Upload avatar fail !!!', {
                        position: "top-right",
                        autoClose: 5000,
                    });
                }
            })
            setNewAvatar();
        }
    }

    const changeName = (e) => {
        setName(e.target.value)
    }

    const changePhone = (e) => {
        setPhone(e.target.value)
    }

    const changeDateOfBirth = (e) => {
        setDateOfBirth(e.target.value)
    }

    const changePass = (e) => {
        setPass(e.target.value)
    }

    const changeRepass = (e) => {
        setRepass(e.target.value)
    }

    const changeInfo = () => {
        let info = {
            name: name,
            phone: phone,
            email: email,
            birthdate: dateOfBirth
        }
        console.log(JSON.stringify(info));
        AccSV.changeAccInfo(info).then(res => {
            if (res.data.status === 401) {
                Swal.fire({
                    icon: 'danger',
                    title: 'Session expired !!!!',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate("/")
            }
            reload();
        })
        toast.success('Info changed !!!', {
            position: "top-right",
            autoClose: 5000,
        });
    }

    const changeNewPass = () => {
        if (pass === "")
            toast.error('Please enter new pass !!!', {
                position: "top-right",
                autoClose: 5000,
            });
        else if (repass === "")
            toast.error('Please re-enter new pass !!!', {
                position: "top-right",
                autoClose: 5000,
            });
        else if (pass !== repass) {
            toast.error('Password does not match !!!', {
                position: "top-right",
                autoClose: 5000,
            });
            setPass("");
            setRepass("");
        } else {
            let updatedPass = {
                password: pass
            }
            AccSV.changePass(updatedPass).then(res => {
                if (res.data.status === 401) {
                    Swal.fire({
                        icon: 'danger',
                        title: 'Session expired !!!!',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    navigate("/")
                }
            });
            toast.success('Pass changed !!!', {
                position: "top-right",
                autoClose: 5000,
            });
            setPass("");
            setRepass("");
        }
    }

    return (
        <div>
            <ToastContainer theme="dark" />
            {
                (loading === true)
                    ? <TailSpin wrapperStyle={{ display: "block", position: "fixed", bottom: "5px" }} color="red" height={200} width={200} />
                    : <></>
            }
            <motion.div className='Container' style={{ margin: "auto", width: "60%" }}
                animate={{
                    opacity: [0, 1],
                    translateY: [80, 0],
                }}
            >
                <Card style={{ marginTop: "20px" }}>
                    <Card.Header>
                        <div style={{ color: "red", fontSize: "30px" }}>PERSONAL INFO</div>
                    </Card.Header>
                    <Card.Body>
                        <table style={{ width: "100%" }}>
                            <tr style={{ textAlign: "center" }}>
                                <td>
                                    <img style={{ width: "200px", height: "200px", borderRadius: "50%" }} src={avatar} key={avatar} alt=''></img>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className='upload-avatar'>
                                        <Form.Control type="file" onChange={changeAvatar} />
                                        <Button variant='secondary' onClick={uploadAvatar}>Upload</Button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name :</Form.Label>
                                            <Form.Control type="text" value={name} onChange={changeName} maxLength={255} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" >
                                            <Form.Label>Phone :</Form.Label>
                                            <Form.Control type="text" value={phone} onChange={changePhone} maxLength={255} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" >
                                            <Form.Label>Date of birth :</Form.Label>
                                            <Form.Control type="date" value={dateOfBirth} onChange={changeDateOfBirth} />
                                        </Form.Group>
                                        <fieldset disabled>
                                            <Form.Group className="mb-3" >
                                                <Form.Label>Email :</Form.Label>
                                                <Form.Control type="text" value={email} />
                                            </Form.Group>
                                        </fieldset>
                                        <Button variant="primary" onClick={changeInfo}>
                                            Update
                                        </Button>
                                    </Form>
                                </td>
                            </tr>
                        </table>
                    </Card.Body>
                </Card>
                <Card style={{ marginTop: "20px" }}>
                    <Card.Header>
                        <div style={{ color: "red", fontSize: "30px" }}>CHANGE PASSWORD</div>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>New Password :</Form.Label>
                                <Form.Control type="password" value={pass} onChange={changePass} />
                            </Form.Group>
                            <Form.Group className="mb-3" >
                                <Form.Label>Confirm new password :</Form.Label>
                                <Form.Control type="password" value={repass} onChange={changeRepass} />
                            </Form.Group>
                            <Button variant="primary" onClick={changeNewPass}>
                                Change
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </motion.div>
        </div>
    )
}
export default ChangeInfo;