import React from "react";
import { connect } from "react-redux";
import { updateExercise } from "Lib/exercise";
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';


const DURATION = 60000;
const MINIMUM_POSE_SCORE = 0.1;
const COLOR = `aqua`;

class Test extends React.Component {

    state = {
        timerId: undefined,
        isLoaded: false,
        currentProgress: 0,
        isFinished: false,
        resolution: {
            width: 500,
            height: 600
        },
        showVideo: false
    };

    async componentDidMount() {
        let currentExercise = this.props.currentExercise;

        //Initialize camera
        let video = await this.setupCamera(this.state.resolution.width, this.state.resolution.height);
        let timerId = setInterval(this.process.bind(this), 1000);

        //Initialize Canvas context for drawing
        const canvas = document.getElementById('output');
        const ctx = canvas.getContext('2d');

        //Initialize posenet
        const net = await posenet.load({
            architecture: "MobileNetV1",
            outputStride: 16,
            inputResolution: 500,
            multiplier: 0.75,
            quantBytes: 2
        });

        this.setState({
            timerId: timerId,
            video: video,
            net: net,
            showVideo: true,
            canvas: canvas,
            ctx: ctx
        })

    }

    async setupCamera(videoWidth, videoHeight) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error(
                'Browser API navigator.mediaDevices.getUserMedia not available');
        }

        const video = document.getElementById('video');
        video.width = videoWidth;
        video.height = videoHeight;

        const stream = await navigator.mediaDevices.getUserMedia({
            'audio': false,
            'video': {
                facingMode: 'user',
                width: videoWidth,
                height: videoHeight,
            },
        });
        video.srcObject = stream;

        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play();
                resolve(video);
            };
        });
    }

    async process() {
        // console.log(this.state.video, this.state.net);

        //Draw latest captured image
        this.state.ctx.clearRect(0, 0, this.state.resolution.width, this.state.resolution.height);
        this.state.ctx.save();
        this.state.ctx.scale(-1, 1);
        this.state.ctx.translate(-this.state.resolution.width, 0);
        this.state.ctx.drawImage(this.state.video, 0, 0, this.state.resolution.width, this.state.resolution.height);
        this.state.ctx.restore();

        //If posenet is available, perform pose estimation
        if (this.state.net) {
            const poses = await this.state.net.estimatePoses(this.state.video, {
                flipHorizontal: true,
                decodingMethod: 'single-person'
            });

            if (poses && poses.length > 0) {
                let keypoints = poses[0].keypoints;
                let score = poses[0].score;
                console.log("Overall Score = ", score);
                if (score >= MINIMUM_POSE_SCORE) {
                    this.drawKeypoints(keypoints, MINIMUM_POSE_SCORE, this.state.ctx, 1, "nose");
                    // drawSkeleton(keypoints, minPartConfidence, ctx);
                    // drawBoundingBox(keypoints, ctx);

                }
            }



            //   poses = poses.concat(pose);
        }

    }

    drawKeypoints(keypoints, minConfidence, ctx, scale = 1, keypointToShow) {
        for (let i = 0; i < keypoints.length; i++) {
            const keypoint = keypoints[i];

            if(keypointToShow){
                if (keypoint.part !== keypointToShow){
                    continue;
                }
            }
            if (keypoint.score < minConfidence) {
                continue;
            }
            console.log("Nose Score=", keypoint.score)
            const { y, x } = keypoint.position;
            this.drawPoint(ctx, y * scale, x * scale, 3, COLOR);
        }
    }

    drawPoint(ctx, y, x, r, color) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }

    // async updateProgress() {
    //     let currentExercise = this.props.currentExercise;
    //     let cp = this.state.currentProgress;
    //     let isFinished = this.state.isFinished;
    //     if (cp < 90) {
    //         let newProg = cp + 10;
    //         let updateRetCode = await this.props.updateProgress(newProg);
    //         if (updateRetCode === 0) {
    //             this.setState({
    //                 currentProgress: newProg
    //             })
    //         } else {
    //             console.log("Progress update not successful");
    //         }
    //     } else {
    //         if (!isFinished) {

    //             // Exercise completed

    //             //Persist any variables used by the exercise
    //             currentExercise.variables.setsCompleted = 1;
    //             updateExercise(currentExercise);

    //             //Call the parent component and let it know all is done
    //             let updateRetCode = await this.props.updateProgress(100);
    //             if (updateRetCode === 0) {
    //                 this.setState({
    //                     currentProgress: 100,
    //                     isFinished: true
    //                 })
    //             } else {
    //                 console.log("Progress update not successful");
    //             }

    //         } else {
    //             // Nothing to do now, exercise is completed
    //         }
    //     }
    // }

    render() {


        return (
            <div>
                <div>Test exercise</div>
                <video id="video" playsInline style={{ "display": "none" }} >
                </video>
                <canvas width={this.state.resolution.width} height={this.state.resolution.height} id="output" />
            </div>

        )



    }

    componentWillUnmount() {
        if (this.state.timerId) {
            clearInterval(this.state.timerId);
        }
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
    };
};

export default connect(mapStateToProps)(Test);
