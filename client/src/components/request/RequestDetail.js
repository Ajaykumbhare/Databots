import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  getRequest,
  addReply,
  socketUpdate,
  sentOffer
} from "../../actions/requestActions";
import { hidePageLoading, showPageLoading } from "../../actions/authActions";
import Navbar from "../layout/NavBar";
import styled from "styled-components";
import moment from "moment";
import Spinner from "../common/spinner";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";
import io from "socket.io-client";
import * as R from "ramda";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import "react-table/react-table.css";
import Axios from "axios";
import FormData from "form-data";
registerPlugin(FilePondPluginFileValidateSize);

const Wrapper = styled.div`
  display: grid;
  background: white;
  padding: 20px;
  box-shadow: 1px 1px 10px 0 rgba(0, 0, 0, 0.2);
  letter-spacing: normal;
`;

const Division = styled.div`
  :${props => props.position} {
    display: block;
    content: "";
    height: 5px;
    background: linear-gradient(
      to var(--direction, left),
      #03a9f4,
      transparent
    );
  }

  :after {
    --direction: right;
  }
  margin-top:20px;
  margin-bottom:20px;
`;

const Uname = styled.div`
  font-size: 12px;
  background-color: #ffc600;
  border-radius: 3px;
  padding: 1px 20px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
`;

const Content = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 10fr;
  padding: 10px;
  background: white;
`;

const Timestamp = styled.p`
  text-align: right;
  color: #03a9f4;
`;

const P = styled.pre`
  font-size: 15px;
  padding: 0;
  margin: 0;
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word;
  word-break: break-all;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
`;

const Image = styled.img`
  box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.4);
  width: 75px;
  height: 75px;
  border-radius: 2px;
`;

const Cta = styled.div`
  display: grid;
  grid-gap: 10px;
`;

const Details = styled.div`
  display: grid;
  grid-template-columns: auto 10fr;
`;

const socket = io.connect("http://localhost:5000", {
  transports: ["websocket", "polling", "flashsocket"]
});

class RequestDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: {},
      error: {},
      text: "",
      loading: true,
      spinner: false,
      deliveryTime: "",
      offerAmount: "",
      fileName: "",
      fileObject: {},
      fileUploadStatus: 0,
      counter: 0
      /**
       * ? 0 not uploading
       * ? 1.uploading
       * ?.2.upload_complete
       */
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.modelSubmit = this.modelSubmit.bind(this);
    this.markAsComplete = this.markAsComplete.bind(this);
  }

  componentDidMount = () => {
    socket.on("display", data => {
      if (this.props.request.request._id === data.reply.rid) {
        this.props.socketUpdate(this.props.match.params.id);
      }
    });
    this.props.hidePageLoading();
    this.props.getRequest(this.props.match.params.id);
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.setState({ spinner: true });
    this.props.addReply(this.props.match.params.id, {
      text: this.state.text,
      fileName: this.state.fileName,
      fileObject: this.state.fileObject
    });
  }

  modelSubmit(e) {
    e.preventDefault();

    this.props.sentOffer(this.props.match.params.id, {
      offerAmount: this.state.offerAmount,
      deliveryTime: this.state.deliveryTime
    });
    this.props.addReply(this.props.match.params.id, {
      text: `Offer Amount : ${this.state.offerAmount}
Timeline : ${this.state.deliveryTime} Days`,
      fileName: "Accept Offer",
      fileObject: {
        url: "http://localhost:3000/checkOffers/" + this.props.match.params.id
      }
    });
    document.querySelector(".close").click();
  }

  componentWillReceiveProps = nextProps => {
    if (nextProps.request.request !== null) {
      this.setState({
        request: nextProps.request.request,
        text: "",
        spinner: false,
        markSpin: false,
        fileName: "",
        fileObject: ""
      });
      if (document.querySelector("button[title='Remove']")) {
        document.querySelector("button[title='Remove']").click();
      }
    }

    if (nextProps.errors) {
      this.setState({ error: nextProps.errors });
    }

    if (!nextProps.loading.request) {
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });
    }
  };

  componentWillUnmount = () => {
    this.props.showPageLoading();
  };

  markAsComplete() {
    this.setState({ markSpin: true });
    Axios.post(
      `/api/workRequest/markAsComplete/${this.props.request.request._id}`
    )
      .then(data => {
        this.props.addReply(this.props.match.params.id, {
          text: `Order Mark as Completed 
Delivered On : ${moment(data.data.work).format("LLL")} `,
          fileName: "Order Completed",
          fileObject: {
            url:
              "http://localhost:3000/checkOffers/" + this.props.match.params.id
          }
        });
        this.setState({ markSpin: false });
      })
      .catch(e => {
        this.setState({ markSpin: false });
        console.log(e);
      });
  }

  render() {
    const { error, request, fileUploadStatus } = this.state;
    let requestThread;
    const options = [];

    R.range(1, 31).map(x =>
      options.push({ label: `${x} Days`, value: `${x}` })
    );

    let fileUploadLabel = "";
    if (fileUploadStatus === 1) {
      fileUploadLabel = <label className="text-info">File Uploading</label>;
    } else if (fileUploadStatus === 2) {
      fileUploadLabel = (
        <label className="text-info">File Successfully uploaded</label>
      );
    }

    if (request.user && this.state.loading === false) {
      let chats = [];
      request.chats.map((x, i) =>
        chats.push(
          <div key={i}>
            <Division position={i % 2 === 0 ? "before" : "after"} />
            <Content>
              <div className="image">
                <Image
                  src={
                    x.roleId === 1
                      ? "https://img.icons8.com/dusk/64/000000/online-support.png"
                      : "https://img.icons8.com/dusk/64/000000/administrator-male.png"
                  }
                />
              </div>
              <Cta>
                <Details>
                  <Uname>{x.name}</Uname>

                  <Timestamp>{moment(x.date).format("LLL")}</Timestamp>
                </Details>
                <div className="thread">
                  <P>{x.text}</P>
                </div>
                {x.docs ? (
                  <div className="text text-primary">
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={x.docs.fileObject.url}
                    >
                      {x.docs.fileName}
                    </a>
                  </div>
                ) : (
                  ""
                )}
              </Cta>
            </Content>
            {i + 1 === request.chats.length ? (
              <Division position={(i + 1) % 2 === 0 ? "before" : "after"} />
            ) : (
              ""
            )}
          </div>
        )
      );

      let statusValue = "";
      let statusIcon = "";
      if (request.status === 0) {
        statusValue = "Pending";
        statusIcon = "https://img.icons8.com/office/32/000000/hourglass.png";
      } else if (request.status === 1) {
        statusValue = "Approve";
        statusIcon = "https://img.icons8.com/office/32/000000/hourglass.png";
      } else if (request.status === 2) {
        statusValue = "Complete";
        statusIcon =
          "https://img.icons8.com/flat_round/32/000000/checkmark.png";
      } else if (request.status === 3) {
        statusValue = "Reject";
        statusIcon =
          "https://img.icons8.com/flat_round/32/000000/delete-sign.png";
      }
      requestThread = (
        <Wrapper className="Details">
          <h3>{request.title}</h3>
          <Division position="after" />

          <div>
            <img src={statusIcon} className="mr-2" alt="statusIcon" />
            <label
              style={{
                fontSize: "17px",
                color: "#04a9f4",
                fontFamily: "sans-serif"
              }}
            >
              Order {statusValue}
            </label>
          </div>
          <Division position="before" />

          <Content>
            <div className="image">
              <Image src="https://img.icons8.com/dusk/64/000000/administrator-male.png" />
            </div>
            <Cta>
              <Details>
                <Uname>{request.user.name}</Uname>
                <Timestamp>
                  {moment(request.created_on).format("LLL")}
                </Timestamp>
              </Details>
              <div className="thread">
                <P>{request.description}</P>
              </div>
            </Cta>
          </Content>
          {chats}

          <form onSubmit={this.onSubmit} className="mt-5">
            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <TextAreaFieldGroup
                  style={{ height: "100px" }}
                  placeholder="Type Message here"
                  name="text"
                  value={this.state.text}
                  onChange={this.onChange}
                  error={error.text}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <FilePond
                  allowFileSizeValidation={true}
                  allowMultiple={false}
                  maxFiles={1}
                  maxFileSize="100MB"
                  onupdatefiles={fileItems => {
                    if (fileItems.length > 0) {
                      let flag_counter = this.state.counter + 1;
                      this.setState({
                        fileUploadStatus: 1,
                        counter: flag_counter
                      });
                      if (this.state.counter === 1) {
                        let data = new FormData();
                        data.append(
                          "myfile",
                          fileItems[0].file,
                          fileItems[0].file.name
                        );
                        data.append("visitorid", request._id);
                        Axios.post(
                          `https://guarded-stream-22145.herokuapp.com/http://drop.usestak.com/home/upload`,
                          data,
                          {
                            headers: {
                              accept: "application/json",
                              "Accept-Language": "en-US,en;q=0.8",
                              "Content-Type": `multipart/form-data; boundary=${
                                data._boundary
                              }`
                            }
                          }
                        )
                          .then(data => {
                            this.setState({
                              fileName: fileItems[0].file.name,
                              fileObject: data.data,
                              fileUploadStatus: 2,
                              counter: 0
                            });
                          })
                          .catch(e => console.log(e));
                      }
                    } else {
                      this.setState({
                        fileName: "",
                        fileObject: {},
                        fileUploadStatus: 0
                      });
                    }
                  }}
                />
                {fileUploadLabel}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group row">
                  <div className="col-sm-6">
                    <button className="btn btn-primary submit-btn btn-block">
                      {this.state.spinner ? (
                        <Spinner> </Spinner>
                      ) : (
                        "Send Message"
                      )}
                    </button>
                  </div>

                  {this.props.auth.admin && request.status === 0 ? (
                    <div className="col-sm-6">
                      <button
                        type="button"
                        className="btn btn-primary submit-btn btn-block"
                        data-toggle="modal"
                        data-target="#exampleModal"
                      >
                        Sent Offer
                      </button>
                    </div>
                  ) : (
                    ""
                  )}

                  {!this.props.auth.admin && request.status === 1 ? (
                    <div className="col-sm-6">
                      <button
                        onClick={() => this.markAsComplete()}
                        type="button"
                        className="btn btn-primary submit-btn btn-block"
                      >
                        {this.state.markSpin ? (
                          <Spinner />
                        ) : (
                          "Mark as Order Completed"
                        )}
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </form>

          <form onSubmit={this.modelSubmit}>
            <div
              className="modal fade"
              id="exampleModal"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                      Create Offer
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div>
                      <Wrapper>
                        <div className="row">
                          <div className="col-md-12 col-lg-12 col-sm-12 col-xm-12">
                            <label>Delivery Time</label>
                            <SelectListGroup
                              placeholder="Delivery Time"
                              name="deliveryTime"
                              value={this.state.deliveryTime}
                              onChange={this.onChange}
                              options={options}
                              error={error.deliveryTime}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12 col-lg-12 col-sm-12 col-xm-12">
                            <label>Total Offer Amount</label>
                            <TextFieldGroup
                              type="number"
                              placeholder="Total Offer Amount in $"
                              name="offerAmount"
                              value={this.state.offerAmount}
                              onChange={this.onChange}
                              error={error.offerAmount}
                            />
                          </div>
                        </div>
                      </Wrapper>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Wrapper>
      );
    } else {
      requestThread = (
        <div className="Loading">
          <Spinner
            type="primary"
            style={{ width: "20px", height: "20px", fontSize: "10px" }}
          />
        </div>
      );
    }

    return <Navbar layout={requestThread} />;
  }
}

RequestDetail.propTypes = {
  auth: PropTypes.object.isRequired,
  getRequest: PropTypes.func.isRequired,
  socketUpdate: PropTypes.func.isRequired,
  hidePageLoading: PropTypes.func.isRequired,
  showPageLoading: PropTypes.func.isRequired,
  addReply: PropTypes.func.isRequired,
  sentOffer: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  request: state.request,
  loading: state.loading
});

export default connect(
  mapStateToProps,
  {
    getRequest,
    hidePageLoading,
    showPageLoading,
    addReply,
    socketUpdate,
    sentOffer
  }
)(withRouter(RequestDetail));
