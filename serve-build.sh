if ! command -v http-server &> /dev/null
then
    echo "No http-server executable found. Please install it: https://www.npmjs.com/package/http-server"
    exit 1
fi

INLINE_RUNTIME_CHUNK=false yarn build prod

cd build ; pwd;  http-server -p 8061