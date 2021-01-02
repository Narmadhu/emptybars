import React from 'react';
import ReactDOM from 'react-dom';

import EditorLoader from './EditorLoader';

import {initSectionsPlayer} from "emptybars-common/initialiser";

initSectionsPlayer(($element, data) => {

    const {sections, pages, videoUrl, videoTitle} = data;

    ReactDOM.render(
        <React.StrictMode>
          <EditorLoader sections={sections || []} pages={pages || []} videoUrl={videoUrl} />
        </React.StrictMode>,
        $element
    );
});

