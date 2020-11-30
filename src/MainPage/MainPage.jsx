import React from "react";
import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    ListGroup,
    Spinner,
  } from "react-bootstrap";
import "./MainPage.css";
import Select from "react-select";
import queen from "../queen.jpg";
import x from "../x.jpg";
import Carousel from 'react-bootstrap/Carousel';

var options = [{ label: "1 queen", value: 1 }];
const colors = {
    1: "#23AF23",
    2: "#98C90B",
  };
  
  const colors2 = {
    2: "#23AF23",
    1: "#98C90B",
  };

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: [],
            board2: [],
            solution: [],
            queens: 8,
            show: false,
            showselected: false,
            curSelectSolution: null,
            loading: "none",
            picking:[],
            presetboard:[],
            resultboards: [],
            hassolution: false,
        };
    }

    componentDidMount() {
        for (var j = 2; j <= 32; j++) {
          options.push({ label: `${j} queens`, value: j });
        }
        var curBoard = [];
        for (var i = 0; i < this.state.queens; i++) {
          curBoard.push(new Array(this.state.queens).fill(0));
        }
        this.setState({
          board: curBoard,
          board2: JSON.parse(JSON.stringify(curBoard)),
          presetboard: curBoard,
        });
      }

    Queennumber = (e) => {
        const val = e.value;
        var curBoard = [];
        for (var i = 0; i < val; i++) {
          curBoard.push(new Array(val).fill(0));
        }
        this.setState({
          board: curBoard,
          board2: JSON.parse(JSON.stringify(curBoard)),
          queens: val,
          solution: [],
          presetboard: curBoard,
        });
        this.forceUpdate();
    };

    isSave = (board, row, col) => {
    var i, j;
    for (i = 0; i < board.length; i++) if (board[row][i] === 1) return false;

    for (i = row, j = col; i >= 0 && j >= 0; i--, j--)
        if (board[i][j] === 1) return false;

    for (i = row, j = col; j >= 0 && i < board.length; i++, j--)
        if (board[i][j] === 1) return false;
    for (i = row, j = col; i < board.length && j < board.length; i++, j++)
        if (board[i][j] === 1) return false;
    for (i = row, j = col; i >= 0 && j < board.length; i--, j++)
        if (board[i][j] === 1) return false;
    for (i = board.length; i >= 0; i--) if (board[row][i] === 1) return false;
    return true;
    };

    setrow = (e, rows, column) => {
        var mypicking = this.state.picking;
        var tempreset = this.state.presetboard;
        for (var i=0; i<mypicking.length; i++){
            if (mypicking[i][0] === rows) {
                tempreset[mypicking[i][0]][mypicking[i][1]] = 0;
                mypicking.splice(i,1);
            }
        }
        mypicking.push([rows,column]);
        tempreset[rows][column] = 1
        this.setState({picking: mypicking, presetboard: tempreset});
        this.forceUpdate();
    }

    solveThePuzzle = (board, col, mysolution) => {
        if (col === board.length) {
          mysolution.push(JSON.parse(JSON.stringify(board)));
          return true;
        }
        var res = false;
        for (var i = 0; i < board.length; i++) {
          if (this.isSave(board, i, col)) {
            board[i][col] = 1;
            res = this.solveThePuzzle(board, col + 1, mysolution) || res;
            board[i][col] = 0;
          }
        }
        return res;
    };

    solve = (e, i) => {
        var mysolution = [];
        this.solveThePuzzle(this.state.board2, 0, mysolution);

        const after_filter = [];
        const preset = this.state.picking;
        console.log(this.state.picking);
        mysolution.forEach((vall) => {
          var contains = true;
          for (var i=0; i<preset.length; i++) {
              if (vall[preset[i][0]][preset[i][1]] === 0) {
                  console.log("reach");
                  contains = false;
              }
          }
          if (contains === true) after_filter.push(vall);
        });
        if (after_filter.length === 0) {
            alert("there is no solutions")
        }
        this.setState({ solution: after_filter, loading: "none"});
        this.forceUpdate();
    };

    show = (e, i) => {
        // console.log(this.state.solution.length);

        if (this.state.solution.length === 0) {
          alert("there is solution for this puzzle yet");
          return;
        }
        var results =[];
        const board = this.state.solution[0];
        for (var j = 0; j < board.length; j++) {
            results.push(this.paint(board,j));
        }
        this.setState({ resultboards: results, hassolution: true });
    };

    paint = (board, i) => {
        var tem = [];
        this.state.board.forEach((val) => {
          tem.push(new Array(val.length).fill(0));
        });
        for (var r = 0; r<=i; r++) {
            var c = board[r].indexOf(1);
            for (var x = 0; x < board.length; x++) {
                tem[r][x] = 0;
                if (r+x < board.length) {
                    tem[r+x][c] = -1;
                }
                if ((r+x) < board.length && (c+x) < board.length) {
                    tem[r+x][c+x] = -1;
                }
                if ((r+x) < board.length && (c-x) >=0) {
                    tem[r+x][c-x] = -1;
                }
            }
            tem[r][c] = 1;
        }
        
        return tem;
    }

    clear = () => {
        var newBoard = [];
        this.state.board.forEach((val) => {
          newBoard.push(new Array(val.length).fill(0));
        });
        this.setState({
          board: newBoard,
          board2: JSON.parse(JSON.stringify(newBoard)),
          presetboard: newBoard,
          picking: [],
          solution: [],
          hassolution: false,
        });
        this.forceUpdate();
      };

    render() {
        return (
            <div className='web-container'>
                <div className='mainpart'>
                    <Spinner 
                    animation="border" 
                    role="status"
                    style={{display: 'none'}}>
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    <div className='sizeDecide'>
                        <div id='selection'>
                            <Select
                                style={{position: 'absolute', top: '50%'}}
                                onChange={(e) => {
                                console.log(e);
                                this.Queennumber(e);
                                }}
                                label="Select Queens"
                                options={options}
                            />
                        </div>
                        <div id='texts'>
                            <p>Backtracking Search for n-queeen problem</p>
                        </div>
                    </div>
                    <div style={{backgroundColor:'rgba(0, 0, 0, 0.7)', width: '94%', height: '40%', marginTop: '30px', marginLeft: '3%', border: 'solid #33BCC1 2px'}}>
                        <p style={{marginTop: '10px', marginLeft: '3%' ,height: '20px', color: 'white', fontWeight: 'bold', fontSize: '15px'}}>Specify Any Required location</p>
                        <div className='controller'>
                            {this.state.presetboard.map((val, index) => (
                                <div className='cheese'>
                                    <p style={{backgroundColor: '#33BCC1', width: '30px', height: '100%', color: 'white', fontSize: '15px', textAlign: 'center', borderRadius: '6px', display: 'inline-block'}}>
                                        Q{index+1}:
                                    </p>
                                    {val.map((vall, i) => {
                                        var back = '#9C9E9E';
                                        switch(vall) {
                                        default:
                                            back = '#9C9E9E';
                                            break;
                                        case 1:
                                            back = '#454848';
                                        }
                                        return (
                                            <Button
                                            className = 'pickrow'
                                            style={{
                                                width: "30px",
                                                height: "100%",
                                                backgroundColor: back,
                                                display: 'inline-block',
                                                borderRadius: '6px',
                                                textAlign: 'center',
                                                color: 'white',
                                                marginLeft: '1px',
                                                border: 'none',
                                                transform: 'translateY(10%)',
                                            }}
                                            onClick={(e) => {
                                                this.setrow(e, index,i)}}>
                                                {i+1}
                                            </Button>
                                        )
                                        }
                                    )}
                                </div>
                            ))}
                        </div>
                        <div id='button'>
                            <Button className='buttons' onClick={this.solve}>
                                Slove
                            </Button>
                            <Button className='buttons' onClick={this.show}>
                                show
                            </Button>
                            <Button className='buttons' onClick={this.clear}>
                                clear
                            </Button>
                        </div>
                    </div>
                    {this.state.hassolution ? 
                        <div id='mainboard2'>
                            {this.state.resultboards.map((valll) => (
                                <div id='mainboard'>
                                {valll.map((val, index) => {
                                    return (
                                        <div
                                        key={"row" + index}
                                        style={{
                                            height: 640 / this.state.board.length + "px",
                                            alignContent: "center",
                                            justifyContent: "center",
                                            textAlignVertical: "center",
                                            textAlign: "center",
                                            margin: "0.1vh"
                                        }}
                                        >
                                        {val.map((vall, a) => {
                                            const cur = index % 2 === 0 ? colors2 : colors;
                                            var img = "";
                                            switch (vall) {
                                            default:
                                                img = "";
                                                break;
                                            case 1:
                                                img = queen;
                                                break;
                                            case -1:
                                                img = x;
                                                break;
                                            }
                                            return (
                                            <div
                                                style={{
                                                width: 640/val.length +'px',
                                                display: "inline-block",
                                                alignContent: "center",
                                                justifyContent: "center",
                                                textAlignVertical: "center",
                                                textAlign: "center",
                                                backgroundColor: cur[(a % 2) + 1],
                                                margin: "0.1vh",
                                                height: "100%"
                                                }}
                                            >
                                                <Button
                                                style={{
                                                    backgroundColor: "transparent",
                                                    outlineColor: "transparent",
                                                    borderColor: "transparent",
                                                    marginTop: "10%",
                                                    backgroundImage: `url(${img})`,
                                                    backgroundSize: "100% 100%",
                                                    height: "80%",
                                                    width: "80%"
                                                }}
                                                ></Button>
                                            </div>
                                            );
                                        })}
                                        </div>
                                    );
                                    })}
                                </div>
                            ))}
                        </div>
                    :
                        <div id='mainboard'>
                        {this.state.board.map((val, index) => {
                            return (
                                <div
                                key={"row" + index}
                                style={{
                                    height: 640 / this.state.board.length + "px",
                                    alignContent: "center",
                                    justifyContent: "center",
                                    textAlignVertical: "center",
                                    textAlign: "center",
                                    margin: "0.1vh"
                                }}
                                >
                                {val.map((vall, a) => {
                                    const cur = index % 2 === 0 ? colors2 : colors;
                                    var img = "";
                                    switch (vall) {
                                    default:
                                        img = "";
                                        break;
                                    case 1:
                                        img = queen;
                                        break;
                                    case -1:
                                        img = x;
                                        break;
                                    }
                                    return (
                                    <div
                                        style={{
                                        width: 640/val.length +'px',
                                        display: "inline-block",
                                        alignContent: "center",
                                        justifyContent: "center",
                                        textAlignVertical: "center",
                                        textAlign: "center",
                                        backgroundColor: cur[(a % 2) + 1],
                                        margin: "0.1vh",
                                        height: "100%"
                                        }}
                                    >
                                        <Button
                                        style={{
                                            backgroundColor: "transparent",
                                            outlineColor: "transparent",
                                            borderColor: "transparent",
                                            marginTop: "10%",
                                            backgroundImage: `url(${img})`,
                                            backgroundSize: "100% 100%",
                                            height: "80%",
                                            width: "80%"
                                        }}
                                        ></Button>
                                    </div>
                                    );
                                })}
                                </div>
                            );
                            })}
                        </div>}
                </div>
            </div>
        );
    }
}