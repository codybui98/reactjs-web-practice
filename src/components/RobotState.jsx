import React, {Component} from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import Config from "../scripts/config";
import * as Three from "three";

class RobotState extends Component {
    state = {
        ros: null,
        x: 0,
        y: 0,
        linear_velocity: 0,
        angular_velocity: 0,
        orientation: 0,
    };

    constructor() {
        super();
        this.init_connection();
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

    componentDidMount() {
        this.getRobotState();
    }

    getRobotState() {
        console.log("getting robot state");
        var pose_subscriber = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.POSE_TOPIC,
            messageType: Config.POSE_MSGS_TYPE,
        });
        pose_subscriber.subscribe((msg) => {
            this.setState({
                x: msg.pose.pose.position.x.toFixed(2),
                y: msg.pose.pose.position.y.toFixed(2),
                z: msg.pose.pose.position.z.toFixed(2),
                orientation: this.getOrientationFromQuaternion(msg.pose.pose.orientation).toFixed(2),
            });
        });
        var odom_subscriber = new window.ROSLIB.Topic({
            ros: this.state.ros,
            name: Config.ODOM_TOPIC,
            messageType: Config.ODOM_MSGS_TYPE,
        });
        odom_subscriber.subscribe((msg)=>{
            this.setState({
                linear_velocity: msg.twist.twist.linear.x.toFixed(2),
                angular_velocity: msg.twist.twist.angular.z.toFixed(2),
            })
        });
    }

    getOrientationFromQuaternion(orientation_in_q) {
        var q = new Three.Quaternion(
            orientation_in_q.x,
            orientation_in_q.y,
            orientation_in_q.z,
            orientation_in_q.w,
        );
        // roll pitch yaw
        var rpy = new Three.Euler.setFromQuaternion(q);
        return rpy["_z"] *(180/Math.PI);
    }

    render() {
        return (
            <div>
              <Row>
                <Col>
                  <h4 className="mt-4">Position</h4>
                  <p className="mt-0">x: {this.state.x}</p>
                  <p className="mt-0">y: {this.state.y}</p>
                  <p className="mt-0">Orientation: {this.state.orientation}</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h4 className="mt-4">Velocities</h4>
                  <p className="mt-0">
                    Linear Velocity: {this.state.linear_velocity}
                  </p>
                  <p className="mt-0">
                    Angular Velocity: {this.state.angular_velocity}
                  </p>
                </Col>
              </Row>
            </div>
          );
    }
}
export default RobotState;