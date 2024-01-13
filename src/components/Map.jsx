import React, { Component } from "react";
import Config from "../scripts/config";

class Map extends Component {
    state = {
        ros: null,
    };

    constructor() {
        super();
        this.view_map = this.view_map.bind(this);
        this.state.ros = new window.ROSLIB.Ros();
    }

    init_connection() {
        console.log("Map:" + this.state.ros);
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
        this.init_connection();
        console.log("Map: coponentDidMount" + this.state.ros);
        this.view_map();
    }

    view_map() {
        var viewer = new window.ROS2D.Viewer({
            divID: "nav_div",
            width: 800,
            height: 800,
        });
        var navClient = new window.NAV2D.OccupancyGridClientNav({
            ros: this.state.ros,
            rootObject: viewer.scene,
            viewer: viewer,
            serverName: "/move_base",
            withOrientation: true,
        });
    }
    render() {
        return (
            <div>
                <div id="nav_div">ROBOT VIEWER</div>
            </div>
        );
    }
}

export default Map;