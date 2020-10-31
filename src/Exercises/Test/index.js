import React from "react";
import { connect } from "react-redux";
import { updateExercise } from "Lib/exercise";
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';


const DURATION = 60000;

class Test extends React.Component {

    state = {
        timerId: undefined,
        isLoaded: false,
        currentProgress: 0,
        isFinished: false,
        resolution: {
            width: 500,
            height: 600
        }
    };

    async componentDidMount() {
        let currentExercise = this.props.currentExercise;

        //Initialize camera
        let video = await this.setupCamera(this.state.resolution.width, this.state.resolution.height);
        let timerId = setInterval(process, 1000);


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
            net: net
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
        console.log(this.state.video, this.state.net);
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
                <video id="video" playsInline style={{"display" : "none"}}>
                </video>
                <canvas id="output" />
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
