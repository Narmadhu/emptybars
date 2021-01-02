import React, {useState, useRef, useEffect} from 'react';
import {secsToString} from "emptybars-common/utils";
import ReactTooltip from 'react-tooltip';

import './SectionsTimeline.scss';

function SectionsTimeline({sections, videoDuration, videoPlayerPosSecs, currentSectionIdx, onSectionSelected, onSectionsChanged, onGotoSec}) {
    const handleClickSection = (e, sectionIdx, section) => {
        if (e) {
            e.stopPropagation();
        }
        onSectionSelected(sectionIdx, section);
    };

    const handleAddSectionClick = () => {
        const newSections = JSON.parse(JSON.stringify(sections));
        var pages =[];
        if (currentSectionIdx >= 0) {
            pages = JSON.parse(JSON.stringify(sections[currentSectionIdx].pages || []));
        }
        if (newSections.length > 0) {
            newSections.push({
                startSec: sections[sections.length - 1].endSec,
                endSec: sections[sections.length - 1].endSec + 10,
                pages: pages
            });
        } else {
            newSections.push({
                startSec: 0,
                endSec: 10
            });
        }
        onSectionsChanged(newSections, "add section");
        handleClickSection(false, newSections.length - 1, newSections[newSections.length - 1]);
    }

    const handleTimelineClick = (e) => {
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left; //x position within the element.
        var y = e.clientY - rect.top;  //y position within the element.
        onGotoSec(x/10);
    }

    return (
        <div className='sections'>
                <div className="addButtonWrapper">
                    <div className='addButton' onClick={handleAddSectionClick.bind(null)}>
                        Add section
                    </div>
                </div>

            <div style={{height: '100px', overflow: 'hidden', margin: '10px', width:'500px'}}>
                <div style={{
                    height: '100px',
                    width: (videoDuration * 10) + 'px',
                    marginLeft: '-' + Math.max(0, (parseInt(videoPlayerPosSecs * 10) - 100  ))  + 'px',
                    position: 'relative',
                    backgroundColor: '#eee'
                }}
                    onClick={handleTimelineClick}
                >
                    {sections.map((section, idx) =>
                        <div style={{
                            border: '1px solid #aaa',
                            height: '25px',
                            position:'absolute',
                            backgroundColor: (idx == currentSectionIdx) ? '#ccffcc' : '#fff',
                            width: parseInt((section.endSec - section.startSec) * 10) + 'px',
                            cursor: 'pointer',
                            textAlign:"center",
                            overflow: 'hidden',
                            lineHeight: '25px',
                            left: (parseInt(section.startSec*10) + 'px'),
                            top: '38px'
                        }}
                             onClick={((e) => handleClickSection(e, idx, sections[idx])).bind(this)}
                             data-tip
                             data-for={'section-' + idx}
                             key={'section-' + idx}
                        >
                            {idx+1}
                        </div>
                    )}
                    <div style={{
                        height: '100px',
                        position:'absolute',
                        backgroundColor: '#0000ff',
                        width: 2,
                        overflow: 'hidden',
                        left: parseInt(videoPlayerPosSecs * 10) + 'px',
                        top: '0px'
                    }}
                    />
                    <div style={{
                        position:'absolute',
                        overflow: 'hidden',
                        color: '#0000ff',
                        left: parseInt(videoPlayerPosSecs * 10 + 10) + 'px',
                        top: '0px'
                    }}
                         onClick={(e) => e.stopPropagation()}
                    >{secsToString(videoPlayerPosSecs)}</div>
                </div>
            </div>
            {sections.map((item, idx) =>
                <ReactTooltip id={'section-' + idx}
                              key={'section-' + idx}
                >
                    <div>
                        <strong>Section #{idx + 1}</strong>
                    </div>
                    <div>
                        {secsToString(sections[idx].startSec)} - {secsToString(sections[idx].endSec)}
                    </div>
                </ReactTooltip>
            )}

            {sections.length && videoPlayerPosSecs > sections[sections.length - 1].endSec
                ?
                    <div>
                        ← sections are there
                    </div>
                : '' }
            {sections.length &&  videoPlayerPosSecs < sections[0].startSec
                ?
                <div style={{textAlign: 'right'}}>
                    sections are there →
                </div>
                : ''
            }
        </div>);
}

export default SectionsTimeline;
