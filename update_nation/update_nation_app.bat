call install_node_modules.bat
node push_nation_design_docs.js %1
curl -X PUT %1/_config/httpd/allow_jsonp -d \"true\"