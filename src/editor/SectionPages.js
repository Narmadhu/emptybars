import React from 'react';
import ImageAreas from "./ImageAreas";

import './SectionPages.scss';

function SectionPages({ pages, sectionPages, sectionPageAreas, onSectionPagesChanges, onSectionPageAreasChanged }) {
    const handleOnChange = (e, pageIdx) => {
        var newSectionPages = JSON.parse(JSON.stringify(sectionPages));
        const page = pages[pageIdx];
        if (e.target.checked) {
            newSectionPages.push(page.id);
        } else {
            newSectionPages = newSectionPages.filter(it => it != page.id);
        }
        onSectionPagesChanges(newSectionPages, 'list of section pages updated');
    }

    const handleOnNewAreaAdded = (pageId, newArea) => {
        const newSectionPageAreas = JSON.parse(JSON.stringify(sectionPageAreas));
        if (!newSectionPageAreas[pageId]) {
            newSectionPageAreas[pageId] = [newArea];
        } else {
            newSectionPageAreas[pageId].push(newArea);
        }
        onSectionPageAreasChanged(newSectionPageAreas, 'page area added');
    }

    const handleOnDeleteArea = (pageId, areaIdx) => {
        const newSectionPageAreas = JSON.parse(JSON.stringify(sectionPageAreas));
        newSectionPageAreas[pageId].splice(areaIdx, 1);
        onSectionPageAreasChanged(newSectionPageAreas, 'page area deleted');
    }

    return <div className='sectionPages'>

        <div className='pageCheckboxWrapper'>
            {pages.map((p, idx) => {
                return <div key={'input' + idx}>
                    <input
                        type="checkbox"
                        checked={(sectionPages.indexOf(p.id) >= 0) ? true : false}
                        onChange={((e) => handleOnChange(e, idx)).bind(this)}
                    /> <span onClick={((e) =>
                            handleOnChange({
                                target: {
                                    checked: (sectionPages.indexOf(p.id) < 0)
                                }
                            }, idx)).bind(this)
                    }>Page #{idx + 1}</span>
                </div>
            })}
        </div>

        {pages.map((p, idx) => {
            return (sectionPages.indexOf(p.id) >= 0) ?
                    <div className='page' key={'page' + idx}>
                        <ImageAreas
                            title={`Page #${idx+1}`}
                            imgUrl={p.url}
                            width = {500}
                            areas={sectionPageAreas[p.id] || [] }
                            rectangles={p.rectangles}
                            onNewAreaAdded={((area) => handleOnNewAreaAdded(p.id, area)).bind(this)}
                            onDeleteArea={((areaIdx) => handleOnDeleteArea(p.id, areaIdx)).bind(this)}
                        />
                    </div>
                    : '';
        })}
    </div>;
};

export default SectionPages;
