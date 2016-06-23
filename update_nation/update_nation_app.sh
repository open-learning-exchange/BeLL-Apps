npm install
node push_nation_design_docs_posix.js $1
curl -X PUT $1/_config/httpd/allow_jsonp -d \"true\"
