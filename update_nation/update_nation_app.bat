call install_node_modules.bat
node push_nation_design_docs.js %1
cd update_nation
curl -X PUT %1/_config/httpd/allow_jsonp -d \"true\"