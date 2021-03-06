import React, {Component} from "react";
import axios from "axios";
import {MDBDataTable} from "mdbreact";
import jsPDF from "jspdf";
import "jspdf-autotable";
import HashLoader from "react-spinners/HashLoader";
import CsvDownload from "react-json-to-csv";


function  jsonBlob(obj) {
  return new Blob([JSON.stringify(obj)], {
    type: "application/json",
  });
}


class View extends Component {
    state = {
        ipData: [], loading: false,
    };
async componentDidMount() {
        await axios
            .get(
                `http://localhost:8080/api/auth/log?fileId=${this.props.match.params.id}`
            )
            .then((res) => {
                console.log("data:" + res);
                this.setState({
                    ipData: res.data,
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        this.setState({
            loading: true,
        });
    }

    //download as pdf
    exportPDF = (props) => {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape
        const marginLeft = 30;
        const doc = new jsPDF(orientation, unit, size);


        doc.setFontSize(14);

        const title = `${this.props.history.location.state.fName}`;
        const headers = [["Time", "Source", "Destination", "Protocol", "Length"]];
        const data = this.state.ipData.map(elt => [elt.time, elt.source, elt.destination, elt.protocol, elt.length]);

        let content = {
            startY: 50,
            head: headers,
            body: data,
        }
        console.log("about",this.props.history.location.state);
        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save(`${this.props.history.location.state.fName}`+".pdf");
    }

    //export to FTP
  exportFTP = () => {

    const formData = new FormData();
    formData.append("file", jsonBlob(this.state.ipData))
    alert("Logs export to FTP server")

    axios({
      method: "post",
      url: "http://localhost:8080/api/auth/uploadfiles",
      data: formData,
      headers: {
        Accept: "application/json ,text/plain, */*",
        "Content-Type": "multipart/form-data",
      },
    });
  };

    render() {
        const data = {
            columns: [
                {
                    label: "Time",
                    field: "time",
                    sort: "asc",
                },
                {
                    label: "Source",
                    field: "source",
                    sort: "asc",
                },
                {
                    label: "Destination",
                    field: "destination",
                    sort: "asc",
                },
                {
                    label: "Protocol",
                    field: "protocol",
                    sort: "asc",
                },
                {
                    label: "Length",
                    field: "length",
                    sort: "asc",
                },
            ],
            rows: [
                ...this.state.ipData.map((data, i) => ({
                    time: data.time,
                    source: data.source,
                    destination: data.destination,
                    protocol: data.protocol,
                    length: data.length,
                })),
            ],
        };
        console.log("sx: " + this.props.match.params.id);

        return (
            <div>
                <div className="container">
                    <div className="row g-3">
                        <div className="col">
                            <h2 className="text-center my-5 text-weight-3 text-dark">
                                {this.props.history.location.state.fName}
                            </h2>
                        </div>
                    </div>

                    <div className="container p-3">
                        {this.state.loading ? (
                            <div style={{marginBottom: "5%"}}>
                                <MDBDataTable responsive striped bordered hover data={data}/>
                                <CsvDownload
                                    filename={`${this.props.history.location.state.fName}`+".csv"}
                                    style={{
                                        display: "inline-block",
                                        cursor: "pointer",
                                        color: "#ffffff",
                                        fontSize: "15px",
                                        fontWeight: "bold",
                                        padding: "3px 6px",
                                    }}
                                    data={this.state.ipData}
                                >
                                    <button type="button" className="btn btn-outline-danger">Export as csv</button>
                                </CsvDownload>
                                <button style={{marginRight: "2%", marginTop: "0.25%"}} type="button"
                                        className="btn btn-outline-info" onClick={() => this.exportPDF()}> Export as pdf
                                </button>
                                <button style={{marginRight: "2%", marginTop: "0.25%"}} type="button"
                                        className="btn btn-outline-success" onClick={() => this.exportFTP()}> Export to FTP
                                </button>
                            </div>
                        ) : (
                            <div className="text-center" style={{marginTop: "20%", marginBottom: "30%"}}>
                                <HashLoader color={"#292b2c"} loading={true} size={150}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default View;
