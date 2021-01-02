import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';

import { secsToString } from 'emptybars-common/utils'

import './PlayerWithNavButtons.scss';
import SectionsTimeline from "./SectionsTimeline";

class PlayerWithNavButtons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: -1,
            duration: -1,
            gotoAfterStopSec: -1,
            endSec: -1,
            playing: true,
        };
        this.$player = React.createRef();
    }

    handleDuration(duration) {
        this.setState({duration: duration});
    }

    handleGotoSec(sec) {
        this.setState({
            playing: false
        });
        this.$player.current.seekTo(sec, 'seconds');
    }

    stopAndReturn() {
        const gotoAfterStopSec = this.state.gotoAfterStopSec;
        this.handleStop();
        this.$player.current.seekTo(gotoAfterStopSec, 'seconds');
    }

    handleProgress({ playedSeconds }) {
        if (this.state.endSec > 0 && playedSeconds > this.state.endSec) {
            this.stopAndReturn();
        }
        this.setState({progress: playedSeconds});
        this.props.onProgressUpdate(playedSeconds, this.state.duration);
    };

    handleOnPlay() {
        this.setState({playing: true});
    }

    handleOnReady() {
        console.log('ready!');
    }

    handleStop() {
        this.setState({
            endSec: -1,
            gotoAfterStopSec: -1,
            playing: false
        });
    }

    handlePlayCurrentSection() {
        this.playSection(
            this.props.sections[this.props.currentSectionIdx].startSec,
            this.props.sections[this.props.currentSectionIdx].endSec,
            'STAY_AT_START'
        );
    }

    handleJumpSectionStart() {
        this.seekToAndStop(this.props.sections[this.props.currentSectionIdx].startSec);
    }

    handleJumpSectionEnd() {
        this.seekToAndStop(this.props.sections[this.props.currentSectionIdx].endSec);
    }

    playSection(startSec, endSec, mode) {
        this.$player.current.seekTo(startSec, 'seconds');
        this.setState({
            // TODO: remove magic strings
            gotoAfterStopSec: Math.max(mode === 'STAY_AT_END' ? endSec : startSec, 0),
            endSec: Math.max(endSec, 0.01),
            playing: true
        });
    }

    seekTo(pos) {
        this.$player.current.seekTo(pos, 'seconds');
    }

    seekToAndStop(pos) {
        this.setState({
            playing: false
        });
        this.$player.current.seekTo(pos, 'seconds');
    }

    maybeStop1SecPlaying(callback) {
        if (this.state.playing && this.state.gotoAfterStopSec > 0) {
            this.stopAndReturn();
            // We need timeout to give player time to stop and update progress
            setTimeout(callback.bind(this), 100);
        } else {
            callback();
        }
    }

    onMoveToClick(shift) {
        this.maybeStop1SecPlaying(() => {
            this.$player.current.seekTo(Math.max(this.state.progress + shift, 0), 'seconds');
        });
    };


    handlePlayOneSecBefore() {
        this.maybeStop1SecPlaying(() => {
            this.playSection(this.state.progress - 1, this.state.progress, 'STAY_AT_END');
        });
    }

    handlePlayOneSecAfter() {
        this.maybeStop1SecPlaying(() => {
            this.playSection(this.state.progress, this.state.progress + 1, 'STAY_AT_START');
        });
    }

    render() {
            const moveTo = [-30, -5, -1, -0.5, -0.1, 0.1, 0.5, 1, 5, 30];

            return (
                <div className='playWithNavButtons'>
                    <ReactPlayer
                        ref={this.$player}
                        url={this.props.videoUrl}
                        width='100%'
                        height='100%'
                        onDuration={this.handleDuration.bind(this)}
                        onProgress={this.handleProgress.bind(this)}
                        onPlay={this.handleOnPlay.bind(this)}
                        onReady={this.handleOnReady.bind(this)}
                        progressInterval={100}
                        onPause={this.handleStop.bind(this)}
                        onEnded={this.handleStop.bind(this)}
                        playing={this.state.playing}
                        controls={true}
                    />


                    <table className='positionAndControls'>
                        <tbody>
                        <tr>
                            <td className='controls'>
                                {
                                    moveTo
                                        .filter(item => item < 0)
                                        .map(item => <div
                                            className='gotoButton'
                                            onClick={(() => this.onMoveToClick(item)).bind(this)}
                                            key={'move-to-' + item}
                                        >{item > 0 ? '+' + item : item}</div>)
                                }
                                <div className='gotoButton' onClick={this.handlePlayOneSecBefore.bind(this)} >Play 1 sec before</div>
                            </td>
                            <td valign='top'>
                                <SectionsTimeline
                                    sections={this.props.sections}
                                    currentSectionIdx={this.props.currentSectionIdx}
                                    videoDuration={this.state.duration}
                                    videoPlayerPosSecs={this.state.progress}
                                    onSectionSelected={this.props.onSectionSelected}
                                    onSectionsChanged={this.props.onSectionsChanged}
                                    onGotoSec={this.handleGotoSec.bind(this)}
                                />

                                {this.props.currentSectionIdx >= 0 ?
                                    <div className='controlsCentral'>
                                        <div className='gotoButton'  onClick={this.handleJumpSectionStart.bind(this)}>
                                            Jump to section start
                                        </div>

                                        <div className='gotoButton' onClick={this.handlePlayCurrentSection.bind(this)}>
                                            Play section
                                        </div>

                                        <div className='gotoButton'  onClick={this.handleJumpSectionEnd.bind(this)}>
                                            Jump to section end
                                        </div>
                                    </div>
                                    : '' }
                            </td>
                            <td className='controls'>
                                {
                                    moveTo
                                        .filter(item => item > 0)
                                        .reverse()
                                        .map(item => <div
                                            className='gotoButton'
                                            onClick={(() => this.onMoveToClick(item)).bind(this)}
                                            key={'move-to-' + item}
                                        >{item > 0 ? '+' + item : item}</div>)
                                }
                                <div className='gotoButton' onClick={this.handlePlayOneSecAfter.bind(this)} >Play 1 sec after</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    {/*<div className='positionAndControls'>*/}

                    {/*    <div className='controls'>*/}

                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            );
    }
}

export default PlayerWithNavButtons;