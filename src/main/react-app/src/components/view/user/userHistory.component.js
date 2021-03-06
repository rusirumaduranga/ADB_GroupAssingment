import React, {Component} from "react";
import axios from "axios";
import {MDBDataTable, MDBNavLink} from "mdbreact";
import {Link} from "react-router-dom";
import HashLoader from "react-spinners/HashLoader";

class UserHistory extends Component {
    state = {userDetails: [], loading: false};

    async componentDidMount() {
        await axios
            .get("http://localhost:8080/api/auth/userLog")
            .then((res) => {
                //console.log(res);
                this.setState({
                    userDetails: res.data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        this.setState({
            loading: true,
        });
    }

    render() {
        const data = {
            columns: [
                {
                    label: "User Name",
                    field: "userName",
                    sort: "asc",
                },
                {
                    label: "Date / Time",
                    field: "date",
                    sort: "asc",
                },
            ],
            rows: [
                ...this.state.userDetails.map((data, i) => ({
                    userName: data.username,
                    date: data.date,
                })),
            ],
        };
        return (
            <div>
                <div className="container">
                    <div classname="row g-3">
                        <div classname="col">
                            <h2 className="text-center my-5 text-weight-3 text-dark">
                                User Login History
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="container p-3">
                    {this.state.loading ? (
                        <div>
                            <MDBDataTable responsive striped bordered hover data={data}/>
                        </div>
                    ) : (
                        <div className="text-center" style={{marginTop: "20%"}}>
                            <HashLoader color={"#292b2c"} loading={true} size={150}/>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default UserHistory;
