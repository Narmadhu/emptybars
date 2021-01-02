This is the "editor" component of the website that gives facilities to section any YouTube video 
and binds the sections to the sheet music.

# Prerequisite

1. Go to `../common` dir and run `./install.sh`

1. Run `yarn` to install all required npm packages.

# Start development server (singleton mode)

This mode starts the editor in singleton mode.

1. `./serve-develop.sh`

2. open `http://localhost:3000` in your browser
 
3. copy to clipboard the content of any "sections.json" file from composers dir (e.g. `composers/ravel/pavane/thiollier/sections.json`),

and click `Submit` button

NOTE: this mode supports hot-reloading; each change will be visible in the browser.

# Run with gatsby (website mode)

This mode starts the editor in website's environment. 

1. `./serve-build.sh`

2. in another terminal `cd ../gatsby; ./serve-develop.sh`

NOTE: no hot-reload; each change requires rebuilding and restarting of both the editor 
      and the website!