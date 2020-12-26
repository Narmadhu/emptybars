import React, {useState, useRef, useEffect} from 'react';
import {secsToString} from "emptybars-common/utils";
import ReactTooltip from 'react-tooltip';

import './Sections.scss';

function SectionsTimeline({sections, videoDuration, videoPlayerPosSecs, currentSectionIdx, onSectionSelected, onSectionsChanged}) {
    const lastCreatedSectionRef = useRef(null);

    const handleClickSection = (sectionIdx, section) => {
        onSectionSelected(sectionIdx, section);
    };

    const handleAddSectionClick = () => {
        const newSections = JSON.parse(JSON.stringify(sections));
        if (newSections.length > 0) {
            newSections.push({
                startSec: sections[sections.length - 1].endSec,
                endSec: sections[sections.length - 1].endSec + 10
            });
        } else {
            newSections.push({
                startSec: 0,
                endSec: 10
            });
        }
        onSectionsChanged(newSections, "add section");
        handleClickSection(newSections.length - 1, newSections[newSections.length - 1]);
    }

    const handleTimelineClick = (e) => {
        console.log(e);
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
                             onClick={handleClickSection.bind(null, idx, sections[idx])}
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
