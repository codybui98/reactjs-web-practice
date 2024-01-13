import React, {Component} from "react";
import { Joystick } from "react-joystick-component";
import Config from "../scripts/config";

class Teleoperation extends Component {
    state = {
        ros: null,
    };
    constructor(){
        super();
        this.init_connection();

        this.handleMove = this.handleMove.bind(this);
        this.handleStop = this.handleStop.bind(this);
        this.state.ros = new window.ROSLIB.Ros();
    }
    init_connection() {
        console.log("RobotState:" + this.state.ros);
        try {
            this.state.ros.connect(
                "ws://" + 
                Config.ROSBRIDGE_SERVER_IP + 
                ":" +
                Config.ROSBRIDGE_SERVER_PORT+
                ""
            );
        } catch (error) {
            console.log(
                "ws://" + 
                Config.ROSBRIDGE_SERVER_IP + 
                ":" +
                Config.ROSBRIDGE_SERVER_PORT+
                ""
            );
            console.log("cant connect to the robot WS. Try again in 1 second");
        }
    }
    handleMove(event) {
        console.log("handle move");
        var cmd_vel = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.CMD_VEL_TOPIC,
            messageType: Config.CMD_VEL_MSGS_TYPE,
        });
        var twist = new window.ROSLIB.Message({
            linear: {
                x: event.y / 50,
                y: 0,
                z: 0,
            },
            angular: {
                x: 0,
                y: 0,
                z: event.x === 0 ? 0 : - event.x / 50,
            }
        });
        cmd_vel.publish(twist);
    }
    handleStop(event) {
        console.log("handle stop");
        var cmd_vel = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.CMD_VEL_TOPIC,
            messageType: Config.CMD_VEL_MSGS_TYPE,
        });
        var twist = new window.ROSLIB.Message({
            linear: {
                x: 0,
                y: 0,
                z: 0,
            },
            angular: {
                x: 0,
                y: 0,
                z: 0,
            }
        });
        cmd_vel.publish(twist);
    }
    render() {
        return (
          <div>
            <Joystick
              size={100}
              baseColor="#EEEEEE"
              stickColor="#BBBBBB"
              move={this.handleMove}
              stop={this.handleStop}
            ></Joystick>
          </div>
        );
    }
}
export default Teleoperation;

