import React from "react";
import {
  Button,
  Popover,
  Checkbox,
  Popconfirm,
  message,
  Drawer,
  Skeleton,
  Tooltip,
} from "antd";
import JSONPretty from "react-json-pretty";
import { Polyform } from "polyform-generator";
import { TwitterPicker } from "react-color";
import {
  PlusOutlined,
  DeleteFilled,
  PullRequestOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import config from "./config";
import "polyform-generator/dist/index.css";
import "./App.css";

const formComponenets = [
  {
    type: "Short Text",
  },
  {
    type: "Long Text",
  },
  {
    type: "Email",
  },
  {
    type: "Phone",
  },
  {
    type: "Multiple Choice",
  },
];

function App() {
  const [form, setFormObject] = React.useState({
    container: { backgroundColor: "blue", title: "New Form" },
  });
  const [questions, setQuestions] = React.useState([]);
  const [selections, setSelections] = React.useState([]);
  const [visiblePopover, setPopoverVisible] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(null);
  const [drawerVisible, setDrawarVisibilty] = React.useState(false);
  const [polyform, setPolyformVisibilty] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const [tintColor, setTintColor] = React.useState("#fc0398");
  const [showtintColor, setShowTintColor] = React.useState(false);
  const [formTitle, setFormTitle] = React.useState("");
  const [formDescription, setformDescription] = React.useState("");
  const [mda, setMDA] = React.useState("");
  const [formPublished, setFormPublished] = React.useState(false);
  const [formPublishID, setPublishID] = React.useState("");

  function generateFormObject() {
    return {
      properties: {
        mda,
      },
      container: {
        backgroudColor: "white",
        title: formTitle,
        tintColor: tintColor,
        about: formDescription,
      },
      questions,
      selections,
    };
  }

  function addNewQuestion(type) {
    if (type === "Short Text") {
      const questionObject = {
        key: Math.floor(Math.random() * 90000) + 10000,
        type: "short-text",
        question: "...",
        description: null,
        options: {
          backgroundColor: "white",
        },
      };

      setQuestions([...questions, questionObject]);
      setCurrentQuestion({ item: questionObject, index: questions.length });

      setPopoverVisible(false);
    } else if (type === "Long Text") {
      const questionObject = {
        key: Math.floor(Math.random() * 90000) + 10000,
        type: "long-text",
        question: "...",
        description: null,
        options: {
          backgroundColor: "white",
        },
      };

      setQuestions([...questions, questionObject]);
      setCurrentQuestion({ item: questionObject, index: questions.length });

      setPopoverVisible(false);
    } else if (type === "Email") {
      const questionObject = {
        key: Math.floor(Math.random() * 90000) + 10000,
        type: "email",
        question: "...",
        description: null,
        options: {
          backgroundColor: "white",
        },
      };

      setQuestions([...questions, questionObject]);
      setCurrentQuestion({ item: questionObject, index: questions.length });
      console.log(currentQuestion);
      setPopoverVisible(false);
    } else if (type === "Phone") {
      const questionObject = {
        key: Math.floor(Math.random() * 90000) + 10000,
        type: "phone-number",
        question: "...",
        description: null,
        options: {
          backgroundColor: "white",
        },
      };

      setQuestions([...questions, questionObject]);
      setCurrentQuestion({ item: questionObject, index: questions.length });

      setPopoverVisible(false);
    } else if (type === "Multiple Choice") {
      const questionObject = {
        key: Math.floor(Math.random() * 90000) + 10000,
        type: "multiple-choice",
        question: "...",
        description: null,
        options: {
          backgroundColor: "white",
        },
      };

      setQuestions([...questions, questionObject]);

      const selectionObject = {
        key: Math.floor(Math.random() * 90000) + 10000,
        questionIndex: questions.length,
        selections: ["Option 1"],
      };

      selections.length === 0
        ? setSelections([
            {
              questionIndex: questions.length,
              selections: ["Option 1"],
              key: Math.floor(Math.random() * 90000) + 10000,
            },
          ])
        : setSelections([...selections, selectionObject]);

      console.log(selections);
      setCurrentQuestion({ item: questionObject, index: questions.length });

      setPopoverVisible(false);
    }
  }

  function getSelectionsFormSelector(index) {
    const mSelect = selections.findIndex(
      (element) => element.questionIndex === index
    );

    if (mSelect !== -1) {
      return selections[mSelect].selections.map((choice, n = index) => (
        <div>
          <Checkbox>{choice}</Checkbox>
        </div>
      ));
    } else return null;
  }

  async function publishForm() {
    const formObject = generateFormObject();
    setLoading(true);
    try {
      const res = await axios.post(`${config.api}/addForm`, {
        formObject: formObject,
      });
      setFormPublished(true);
      setPublishID(res.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      message.error(e.message);
    }
  }

  function getSelections(index) {
    const mSelect = selections.findIndex(
      (element) => element.questionIndex === index
    );

    return selections[mSelect].selections.map((choice, n = index) =>
      n === selections[mSelect].selections.length - 1 && n !== 0 ? (
        <Popover placement="leftBottom" content={<DeleteFilled />}>
          <div className="row" style={{ paddingLeft: "25px" }}>
            {"- "}
            <input
              style={{ paddingLeft: "5px" }}
              placeholder="enter choice"
              onChange={(e) => {
                let selectArray = selections;

                selectArray[mSelect].selections[n] = e.target.value;
                setSelections(selectArray);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // setQuestions(newArray);
                  let selectArray = selections;

                  selectArray[mSelect].selections = [
                    ...selectArray[mSelect].selections,
                    `Option ${selectArray[mSelect].selections.length + 1}`,
                  ];
                  setSelections(selectArray);
                }
              }}
              id="selection-input"
              defaultValue={choice}
            />
          </div>
        </Popover>
      ) : (
        <div className="row" style={{ paddingLeft: "25px" }}>
          {"-  "}
          <input
            placeholder="enter choice"
            onChange={(e) => {
              let selectArray = selections;

              selectArray[mSelect].selections[n] = e.target.value;
              setSelections(selectArray);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                let selectArray = selections;
                selectArray[mSelect].selections = [
                  ...selectArray[mSelect].selections,
                  `Option ${selectArray[mSelect].selections.length + 1}`,
                ];
                setSelections(selectArray);
              }
            }}
            style={{ paddingLeft: "5px" }}
            id="selection-input"
            defaultValue={choice}
          />
        </div>
      )
    );
  }

  const popOverContent = (
    <>
      {formComponenets.map((item) => (
        <div id="component-item" onClick={() => addNewQuestion(item.type)}>
          <div id="form-component-item">{item.type}</div>
        </div>
      ))}
    </>
  );

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a className="navbar-brand" href="/">
              Polyform
            </a>
            <button
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarTogglerDemo02"
              aria-controls="navbarTogglerDemo02"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                <li className="nav-item active">
                  <a className="nav-link" href="#">
                    Home <span class="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    About
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link disabled" href="#" tabindex="-1">
                    Fund this Project
                  </a>
                </li>
              </ul>
              <form class="form-inline my-2 my-lg-0">
                {questions.length > 0 ? (
                  <>
                    <Tooltip title="Preview Form">
                      <Button
                        style={{ marginRight: "10px" }}
                        onClick={() => setPolyformVisibilty(true)}
                        icon={<EyeOutlined />}
                      />
                    </Tooltip>
                    <Button onClick={() => setDrawarVisibilty(true)}>
                      Generate Form
                    </Button>
                  </>
                ) : (
                  <Button disabled></Button>
                )}
              </form>
            </div>
          </nav>
        </div>
        <div className="row">
          <div className="col-8" id="question-overview">
            {currentQuestion !== null ? (
              <div>
                <div
                  style={{
                    marginTop: "10px",
                    marginBottom: "20px",
                    height: "20px",
                    width: "30px",
                    borderRadius: 5,
                    backgroundColor: "#4287f5",
                    color: "white",
                  }}
                >
                  <center>{currentQuestion.index + 1}</center>
                </div>
                <h3>{currentQuestion.item.question}</h3>
                {currentQuestion.item.type === "multiple-choice" ? (
                  getSelectionsFormSelector(currentQuestion.index)
                ) : (
                  <input
                    disabled
                    id="answer-input"
                    inputMode={
                      currentQuestion.item.type === "email"
                        ? "email"
                        : currentQuestion.item.type === "phone-number"
                        ? "tel"
                        : "text"
                    }
                    placeholder="Enter your answer"
                    style={{ fontSize: 20 }}
                  />
                )}
              </div>
            ) : (
              <Skeleton active loading />
            )}
          </div>

          <div
            className="col-4"
            id="side-bar-menu"
            style={{
              borderLeftColor: tintColor,
              borderLeftWidth: "8px",
              borderLeftStyle: "solid",
            }}
          >
            <div id="header">
              <center>
                <input
                  style={{ textAlign: "center" }}
                  onChange={(e) => setFormTitle(e.target.value)}
                  type="text"
                  id="form-title"
                  placeholder="Form title here"
                  defaultValue={formTitle}
                />

                <input
                  style={{ textAlign: "center", fontSize: "10pt" }}
                  onChange={(e) => setformDescription(e.target.value)}
                  type="text"
                  id="form-title"
                  placeholder="Description here"
                  defaultValue={formDescription}
                />
                <input
                  style={{ textAlign: "center", fontSize: "14pt" }}
                  onChange={(e) => setMDA(e.target.value)}
                  type="text"
                  id="form-title"
                  placeholder="Enter MDA name here"
                  defaultValue={mda}
                />
              </center>

              <center style={{ margin: "20px" }}>
                <Popover
                  destroyTooltipOnHide
                  trigger="click"
                  visible={showtintColor}
                  content={
                    <TwitterPicker
                      onChange={(e) => {
                        setTintColor(e.hex);
                        setShowTintColor(false);
                      }}
                    />
                  }
                  title="Pick tint color"
                >
                  <div
                    onClick={() => setShowTintColor(true)}
                    style={{
                      height: "20px",
                      width: "20px",
                      backgroundColor: tintColor,
                      borderRadius: "10px",
                      borderColor: "rgb(249,249,249)",
                      borderWidth: "2px",
                    }}
                  />
                </Popover>
              </center>

              <center>
                <Popover
                  visible={visiblePopover}
                  onVisibleChange={setPopoverVisible}
                  trigger="click"
                  title="Select Questions type"
                  placement="bottom"
                  content={popOverContent}
                >
                  <Button size="middle" type="primary" icon={<PlusOutlined />}>
                    Add Question
                  </Button>
                </Popover>
              </center>
            </div>
            <div id="form-parent">
              {questions.map((item, index) => (
                <div
                  id="question-container"
                  style={{
                    backgroundColor: "white",
                    paddingLeft: "20px",
                    borderRadius: "5px",
                    marginTop: "5px",
                  }}
                >
                  <div
                    style={{ flexDirection: "row", padding: "5px" }}
                    onClick={() => {
                      setCurrentQuestion({ item, index });
                    }}
                  >
                    <div
                      style={{
                        marginTop: "10px",
                        height: "20px",
                        width: "30px",
                        borderRadius: 5,
                        backgroundColor:
                          item.type === "short-text"
                            ? "#4287f5"
                            : item.type === "long-text"
                            ? "#eb4034"
                            : item.type === "email"
                            ? "#18b53f"
                            : item.type === "phone-number"
                            ? "#5d1cc7"
                            : "#163973",
                        color: "white",
                      }}
                    >
                      <center>{index + 1}</center>
                    </div>

                    <input
                      onChange={(e) => {
                        setCurrentQuestion({
                          ...currentQuestion,
                          item: {
                            ...currentQuestion.item,
                            question: e.target.value,
                          },
                        });

                        const newArray = questions;
                        newArray[index] = {
                          type: newArray[index].type,
                          key: newArray[index].key,
                          question: e.target.value,
                        };

                        setQuestions(newArray);

                        // console.log(currentQuestion);
                      }}
                      id="question-input"
                      placeholder="Type Question here"
                    ></input>

                    {item.type == "multiple-choice"
                      ? getSelections(index)
                      : null}
                    <p
                      style={{
                        marginTop: "5px",
                        color: "silver",
                        fontSize: 12,
                        fontStyle: "italic",
                      }}
                    >
                      {item.type === "short-text"
                        ? "Short Text"
                        : item.type === "long-text"
                        ? "Long Text"
                        : item.type === "email"
                        ? "Email"
                        : item.type === "phone-number"
                        ? "Phone Number"
                        : item.type === "multiple-choice"
                        ? "Multiple Choice"
                        : null}
                    </p>
                    <div>
                      <Popconfirm
                        title="Are you sure delete this question?"
                        onConfirm={() => {
                          setQuestions(
                            questions.filter((i) => i.key !== item.key)
                          );
                          if (questions.length != 0)
                            setCurrentQuestion(questions[0]);

                          if (item.type === "multiple-choice") {
                            const mSelect = selections.findIndex(
                              (element) => element.questionIndex == index
                            );

                            // console.log(mSelect);

                            setCurrentQuestion({});

                            setSelections(
                              selections.filter(
                                (e) => e.key !== selections[mSelect].key
                              )
                            );
                          }

                          if (item.type !== "multiple-choice") {
                            let restContainsMultipleQuestions = false;
                            for (var i = 0; i < questions.length; i++) {
                              if (questions[i].type === "multiple-choice") {
                                restContainsMultipleQuestions = true;
                              }
                            }

                            console.log({ index, length: questions.length });
                            if (index == questions.length - 1) {
                              restContainsMultipleQuestions = false;
                            }

                            if (restContainsMultipleQuestions) {
                              let currentSelections = selections;
                              for (
                                var i = 0;
                                i < currentSelections.length;
                                i++
                              ) {
                                currentSelections[i].questionIndex =
                                  currentSelections[i].questionIndex - 1;
                              }

                              setSelections(currentSelections);
                            }
                          }

                          message.success("Question Deleted");
                        }}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteFilled
                          style={{ color: "red", paddingRight: "15px" }}
                        />
                      </Popconfirm>
                      <PullRequestOutlined />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Drawer
          width={540}
          placement="right"
          closable={true}
          onClose={() => setDrawarVisibilty(false)}
          visible={drawerVisible}
        >
          <div>
            <JSONPretty id="json-pretty" data={generateFormObject()} />
            <div>
              <h4 style={{ color: "green" }}>Go Live</h4>
              <Button
                loading={loading}
                onClick={async () => await publishForm()}
                type="primary"
              >
                Publish
              </Button>

              {formPublished ? (
                <a
                  target="_blank"
                  href={`https://polyform-inventory.netlify.app/form/${formPublishID}`}
                >
                  {" "}
                  Check form Out
                </a>
              ) : null}
            </div>
          </div>
        </Drawer>
        <Drawer
          destroyOnClose
          width={800}
          placement="left"
          closable={true}
          onClose={() => setPolyformVisibilty(false)}
          visible={polyform}
        >
          <Polyform form={generateFormObject()} />
        </Drawer>
      </header>
    </div>
  );
}

export default App;
