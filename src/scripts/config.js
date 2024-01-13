const Config = {
    ROSBRIDGE_SERVER_IP: "192.168.2.101",
    ROSBRIDGE_SERVER_PORT: "9090",
    RECONNECTION_TIMER: 3000,
    CMD_VEL_TOPIC: "/cmd_vel",
    ODOM_TOPIC: "/odom",
    POSE_TOPIC: "/amcl_pose",
    POSE_MSGS_TYPE: "geometry_msgs/PoseWithCovarianceStamped",
    ODOM_MSGS_TYPE: "nav_msgs/Odometry",
    CMD_VEL_MSGS_TYPE: "geometry_msgs/Twist",
    GOAL_TOPIC: "/move_base/goal",
};

export default Config;