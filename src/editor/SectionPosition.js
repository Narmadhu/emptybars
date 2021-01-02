import React from 'react';
import { secsToString } from "emptybars-common/utils";

import './SectionPosition.scss';

function SectionPosition({ section, sectionIdx, videoPlayerPosSecs, onSectionChanged: onSectionChanged, getPrevSectionEndSec: getPrevSectionEndSec, onDeleteSection}) {
    const hanleSetCurrentTimeAsSectionStart = () => {
        const newSection = JSON.parse(JSON.stringify(section));
        newSection.startSec = parseFloat(videoPlayerPosSecs.toFixed(1));
        onSectionChanged(newSection, undefined, "update section start time");
    }

    const handleSetSectionStartToLastSectionEnd = () => {
        const newSection = JSON.parse(JSON.stringify(section));
        newSection.startSec = getPrevSectionEndSec();
        onSectionChanged(newSection, undefined, "update section start time");
    }

    const hanleSetCurrentTimeAsSectionEnd = () => {
        const newSection = JSON.parse(JSON.stringify(section));
        newSection.endSec = parseFloat(videoPlayerPosSecs.toFixed(1));
        onSectionChanged(newSection, undefined, 'update section end time');
    }

    const renderSectionPos = () => {
        const deltaStart = (videoPlayerPosSecs - section.startSec);
        const deltaEnd = (videoPlayerPosSecs - section.endSec);

        var className;
        if (deltaStart >= 0 && deltaEnd <= 0) {
            className = 'inside';
        } else if (deltaStart < 0) {
            className = 'before';
        } else if (deltaEnd > 0) {
            className =  'after';
        }

        return <span className={className}>Start delta={deltaStart.toFixed(1)}; end delta={deltaEnd.toFixed(1)}</span>;
    }

    const handleSplitSection = () => {
        const newSection = JSON.parse(JSON.stringify(section));
        const oldVal = section.endSec;
        newSection.endSec = parseFloat(videoPlayerPosSecs.toFixed(1));
        onSectionChanged(newSection, JSON.parse(JSON.stringify({
            startSec: newSection.endSec,
            endSec: oldVal,
            pages: newSection.pages
        })), 'split section');
    }

    return (
        <div className='sectionPosition'>
            <div className='title'>Selected Section #{sectionIdx + 1} ({secsToString(section.startSec)} - {secsToString(section.endSec)})</div>
            <div className='playerPosition'>{renderSectionPos()}</div>
            <div className='controls'>
                <div className='group'>
                    <div>
                        <div className='button'  onClick={hanleSetCurrentTimeAsSectionStart}>
                            Set as section's start time
                        </div>
                        <div className='button'  onClick={handleSetSectionStartToLastSectionEnd}>
                            Set section start at prev. section's end
                        </div>
                    </div>
                    <div className='button'  onClick={hanleSetCurrentTimeAsSectionEnd}>
                        Set as section's end time
                    </div>
                </div>
                {(section.startSec < videoPlayerPosSecs && section.endSec > videoPlayerPosSecs)
                    ?
                    <div className='button' onClick={handleSplitSection}>
                        Split section at {secsToString(videoPlayerPosSecs)}
                    </div>
                    :'' }

                <div className='button'  onClick={onDeleteSection}>
                    Delete section
                </div>

            </div>
        </div>
    );
}

export default SectionPosition;