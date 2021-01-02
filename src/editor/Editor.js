import React, { useState, useRef } from 'react';
import PlayerWithNavButtons from './PlayerWithNavButtons';
import SectionPosition from './SectionPosition';
import SectionsTimeline from './SectionsTimeline';

import Pages from "./Pages";
import SectionPages from "./SectionPages";

import './Editor.css';

function Editor({ sections, pages, videoUrl, onDataUpdated }) {
    var [currentSectionIdx, setCurrentSectionIdx] = useState(-1);
    const [videoPlayerPosSecs, setVideoPlayerPosSecs] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);

    const $player = useRef(null);

    if (currentSectionIdx >= sections.length) {
        currentSectionIdx = -1;
        setCurrentSectionIdx(-1);
    }

    const handleSectionSelected = (sectionIdx, section) => {
        setCurrentSectionIdx(sectionIdx);
        $player.current.seekToAndStop(section.startSec)
    };

    const handleOnPagesUpdated = (pages, message) => {
        onDataUpdated({ sections, pages, videoUrl }, message);
    }

    const onProgressUpdate = (playedSeconds, duration) => {
        setVideoPlayerPosSecs(parseFloat(playedSeconds.toFixed(1)));
        setVideoDuration(duration);
    };

    const onSectionChanged = (updatedSection, newSection, message) => {
        const newSections = JSON.parse(JSON.stringify(sections));
        newSections[currentSectionIdx] = updatedSection;
        if (newSection) {
            newSections.splice(currentSectionIdx + 1, 0, newSection);
        }
        onDataUpdated({ sections: newSections, pages, videoUrl }, message);
    };

    const onSectionsChanged = (newSections, message) => {
        onDataUpdated({ sections: newSections, pages, videoUrl }, message);
    }

    const onSectionPagesChanged = (currentSectionSelectedPages, message) => {
        const newSections = JSON.parse(JSON.stringify(sections));
        newSections[currentSectionIdx].pages = currentSectionSelectedPages;
        onDataUpdated({ sections: newSections, pages, videoUrl }, message);
    };

    const onSectionPageAreasChanged = (currentSectionPageAreas, message) => {
        const newSections = JSON.parse(JSON.stringify(sections));
        newSections[currentSectionIdx].pageAreas = currentSectionPageAreas;
        onDataUpdated({ sections: newSections, pages, videoUrl }, message);
    };

    const onDeleteSection = () => {
        setCurrentSectionIdx(-1);
        const newSections = JSON.parse(JSON.stringify(sections));
        newSections.splice(currentSectionIdx, 1);
        onDataUpdated({ sections: newSections, pages, videoUrl }, 'section deleted');
    }

    const getPrevSectionEndSec = () => {
        if (currentSectionIdx == 0) {
            return 0;
        }
        return sections[currentSectionIdx-1].endSec;
    }

    // TODO: refactor
    const pagesWithRectangles = () => {
        if (!pages) {
            return;
        }
        const newPages = JSON.parse(JSON.stringify(pages));
        newPages.forEach(p => {
            p.rectangles = [];
            sections.forEach(section => {
                if (section.pageAreas) {
                    (section.pageAreas[p.id] || []).forEach(area => {
                        p.rectangles.push(area);
                    })
                }
            });
        });
        return newPages;
    }

    return (
                <div>
                    <PlayerWithNavButtons

                        videoUrl={videoUrl}
                        onProgressUpdate={onProgressUpdate}
                        ref={$player}
                        currentSectionIdx={currentSectionIdx}
                        sections={sections}
                        onSectionSelected={handleSectionSelected}
                        onSectionsChanged={onSectionsChanged}
                    />


                    {currentSectionIdx >= 0
                        ?
                        <div>
                            <SectionPosition
                                $player={$player.current}
                                section={sections[currentSectionIdx]}
                                sectionIdx={currentSectionIdx}
                                onSectionChanged={onSectionChanged}
                                videoPlayerPosSecs={videoPlayerPosSecs}
                                getPrevSectionEndSec={getPrevSectionEndSec}
                                onDeleteSection={onDeleteSection}
                            />
                            <SectionPages
                                pages={pagesWithRectangles()}
                                sectionPages={sections[currentSectionIdx].pages || []}
                                sectionPageAreas={sections[currentSectionIdx].pageAreas || {}}
                                onSectionPagesChanges={onSectionPagesChanged}
                                onSectionPageAreasChanged={onSectionPageAreasChanged}
                            />
                        </div>
                        : ''
                    }


                {/*<Pages pages={pages || []} onPagesUpdated={handleOnPagesUpdated} />*/}

            </div>
    );
}

export default Editor;
